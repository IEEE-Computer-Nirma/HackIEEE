import { NextRequest, NextResponse } from "next/server";
import { fullRegistrationSchema } from "@/app/lib/registration-schema";
import fs from "node:fs";
import path from "node:path";
import { getSupabaseAdminClient } from "@/app/lib/supabase/server";
import { sendRegistrationConfirmationEmail } from "@/services/email";
import { isRegistrationActive } from "@/app/flags";

const REGISTRATIONS_FILE = path.join(process.cwd(), ".data", "registrations.json");

interface PersistedRegistration {
  registrationId: string;
  createdAt: string;
  data: Record<string, unknown>;
}

function getStoredRegistrations(): PersistedRegistration[] {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const content = fs.readFileSync(REGISTRATIONS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read registrations store:", err);
  }
  return [];
}

function saveRegistration(reg: PersistedRegistration) {
  try {
    const dir = path.dirname(REGISTRATIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current = getStoredRegistrations();
    current.push(reg);
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save registration to file:", err);
  }
}

function generateRegistrationId(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude easily confused chars
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HACK-2026-${id}`;
}

export async function POST(req: NextRequest) {
  // Gate backend registration behind feature flag
  let active = false;
  try {
    active = Boolean(await isRegistrationActive());
  } catch {
    active = false;
  }

  if (!active) {
    return NextResponse.json(
      {
        success: false,
        error: "HackIEEE registrations are currently closed. Please check back later.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    // 1. Validation with Zod
    const parsed = fullRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please review the highlighted fields.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 2. Check existing registration by personal email (Local JSON backup store)
    const existingList = getStoredRegistrations();
    const existingIndex = existingList.findIndex(
      (r) =>
        (r.data.personalEmail as string)?.toLowerCase().trim() ===
        data.personalEmail.toLowerCase().trim()
    );

    let registrationId: string;
    let successMessage = "Registration submitted successfully!";

    if (existingIndex >= 0) {
      // Update existing record
      registrationId = existingList[existingIndex].registrationId;
      existingList[existingIndex] = {
        registrationId,
        createdAt: existingList[existingIndex].createdAt,
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      };
      try {
        fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(existingList, null, 2), "utf-8");
      } catch (err) {
        console.error("Failed to update registration locally:", err);
      }
      successMessage = "Your registration has been updated!";
    } else {
      // Create new registration record
      registrationId = generateRegistrationId();
      saveRegistration({
        registrationId,
        createdAt: new Date().toISOString(),
        data: {
          ...data,
          registrationId,
        },
      });
    }

    // 3. Supabase Sync (Primary Database)
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const fullPayload = {
          registration_id: registrationId,
          email: data.personalEmail.toLowerCase().trim(),
          full_name: data.fullName.trim(),
          phone: `${data.countryCode || "+91"} ${data.phoneNumber.trim()}`,
          city: data.city?.trim() || null,
          state: data.state?.trim() || null,
          country: data.country?.trim() || "India",
          college_email: data.collegeEmail?.trim() || null,
          university: data.university.trim(),
          degree:
            data.degree === "Other" && data.customDegree
              ? data.customDegree.trim()
              : data.degree.trim(),
          branch: data.branch.trim(),
          year_of_study: data.yearOfStudy,
          graduation_year: data.graduationYear,
          is_ieee_member: data.isIeeeMember,
          ieee_membership_number: data.ieeeMembershipNumber?.trim() || null,
          is_ieee_cs_member: data.isIeeeCsMember,
          linkedin_url: data.linkedinUrl?.trim() || null,
          github_url: data.githubUrl?.trim() || null,
          hear_about: data.hearAbout?.trim() || null,
          data: data,
          updated_at: new Date().toISOString(),
        };

        let { error: sbError } = await supabase
          .from("registrations")
          .upsert(fullPayload, { onConflict: "email" });

        // If extra columns are not in the table yet, retry with core schema columns + JSONB data
        if (sbError && sbError.message?.toLowerCase().includes("column")) {
          console.warn("[Supabase] Retrying upsert with core schema columns:", sbError.message);
          const corePayload = {
            registration_id: registrationId,
            email: data.personalEmail.toLowerCase().trim(),
            full_name: data.fullName.trim(),
            phone: `${data.countryCode || "+91"} ${data.phoneNumber.trim()}`,
            university: data.university.trim(),
            degree: data.degree.trim(),
            branch: data.branch.trim(),
            year_of_study: data.yearOfStudy,
            is_ieee_member: data.isIeeeMember,
            ieee_membership_number: data.ieeeMembershipNumber?.trim() || null,
            data: data,
            updated_at: new Date().toISOString(),
          };
          const retryResult = await supabase
            .from("registrations")
            .upsert(corePayload, { onConflict: "email" });
          sbError = retryResult.error;
        }

        if (sbError) {
          console.error("[Supabase Error] Failed to sync registration to database:", sbError.message, sbError.details);
        } else {
          console.log(`[Supabase Success] Synced registration ${registrationId} (${data.personalEmail}) to database`);
        }
      } else {
        console.info("[Supabase] Sync skipped: Supabase credentials not yet configured in environment");
      }
    } catch (sbErr) {
      console.warn("[Supabase Sync Warning]", sbErr);
    }

    // 4. Send Confirmation Email via Resend
    try {
      await sendRegistrationConfirmationEmail({
        name: data.fullName,
        email: data.personalEmail,
        registrationId,
        college: data.university,
        degree: data.degree,
        branch: data.branch,
        yearOfStudy: data.yearOfStudy,
        isIeeeMember: data.isIeeeMember,
        ieeeMembershipNumber: data.ieeeMembershipNumber || undefined,
        track: data.areasOfInterest?.[0] || "Open Innovation",
      });
    } catch (mailError) {
      console.warn("Email confirmation non-fatal warning:", mailError);
    }

    // 5. Return response
    return NextResponse.json({
      success: true,
      registrationId,
      participantName: data.fullName,
      email: data.personalEmail,
      message: successMessage,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while processing registration.",
      },
      { status: 500 }
    );
  }
}
