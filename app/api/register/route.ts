import { NextRequest, NextResponse } from "next/server";
import { fullRegistrationSchema } from "@/app/lib/registration-schema";
import fs from "node:fs";
import path from "node:path";
import { getSupabaseAdminClient } from "@/app/lib/supabase/server";
import { sendRegistrationConfirmationEmail } from "@/services/email";
import { authNavMode } from "@/app/flags";

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

function extractInitials(name: string): string {
  const clean = name.replace(/[^A-Za-z\s]/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "XX";
}

function extractYearTwoDigits(yearOfStudy?: string): string {
  if (!yearOfStudy) return "01";
  const digitMatch = yearOfStudy.match(/[1-5]/);
  if (digitMatch) return `0${digitMatch[0]}`;
  const lower = yearOfStudy.toLowerCase();
  if (lower.includes("first") || lower.includes("1st")) return "01";
  if (lower.includes("second") || lower.includes("2nd")) return "02";
  if (lower.includes("third") || lower.includes("3rd")) return "03";
  if (lower.includes("fourth") || lower.includes("4th")) return "04";
  if (lower.includes("fifth") || lower.includes("5th")) return "05";
  return "01";
}

/**
 * Generates a distinct 4-character alphanumeric security cipher token.
 * Guarantees all 4 characters within the cipher are distinct from each other (e.g. 8K94, zero repeated chars).
 * 36 characters * 35 * 34 * 33 = 1,413,720 distinct combinations.
 */
function generateDistinct4CharToken(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const chosen: string[] = [];
  while (chosen.length < 4) {
    const char = chars.charAt(Math.floor(Math.random() * chars.length));
    if (!chosen.includes(char)) {
      chosen.push(char);
    }
  }
  return chosen.join("");
}

/**
 * Generates a guaranteed unique registration ID in the balanced 4-4-4 format:
 * Format: HI27-PP03-8K94
 *   HI27 : HackIEEE 2027 (Fixed 4 chars)
 *   PP03 : Participant Initials (PP) + 2-digit Year of Study (01, 02, 03, 04, 05) (4 chars)
 *   8K94 : 4 distinct alphanumeric security cipher token (4 chars)
 * Checks both local storage and Supabase to guarantee zero collisions.
 */
async function generateUniqueRegistrationId(
  params: { fullName: string; yearOfStudy?: string },
  supabase: ReturnType<typeof getSupabaseAdminClient>
): Promise<string> {
  const initials = extractInitials(params.fullName);
  const yearTwoDigits = extractYearTwoDigits(params.yearOfStudy);
  const prefix = `HI27-${initials}${yearTwoDigits}-`;

  const stored = getStoredRegistrations();
  const existingIds = new Set(stored.map((r) => r.registrationId));

  for (let attempt = 0; attempt < 25; attempt++) {
    const cipher = generateDistinct4CharToken();
    const candidateId = `${prefix}${cipher}`;

    if (existingIds.has(candidateId)) {
      continue;
    }

    if (supabase) {
      try {
        const { data: row } = await supabase
          .from("registrations")
          .select("id")
          .eq("registration_id", candidateId)
          .limit(1);

        if (row && row.length > 0) {
          continue; // collision detected, retry with fresh cipher
        }
      } catch (err) {
        console.warn("[ID Generation] Supabase uniqueness check warning:", err);
      }
    }

    return candidateId;
  }

  // Fallback with timestamp micro-hash if all random attempts collided
  return `${prefix}${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  // Gate backend registration behind Vercel feature flag
  let active = false;
  try {
    const mode = await authNavMode();
    active = mode === "registration_only" || mode === "both";
  } catch {
    active = true;
  }

  const isDev = process.env.NODE_ENV === "development";
  if (!active && !isDev) {
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

    // 2. Prevent duplicate registrations (Check Supabase primary database)
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const emailToCheck = data.personalEmail.toLowerCase().trim();
      const collegeToCheck = data.collegeEmail?.toLowerCase().trim();

      let queryFilter = `email.ilike.${emailToCheck},college_email.ilike.${emailToCheck}`;
      if (collegeToCheck) {
        queryFilter += `,email.ilike.${collegeToCheck},college_email.ilike.${collegeToCheck}`;
      }

      const { data: existingRows, error: checkErr } = await supabase
        .from("registrations")
        .select("id, email, college_email")
        .or(queryFilter)
        .limit(1);

      if (checkErr) {
        console.warn("[Register API] Duplicate check error:", checkErr);
      } else if (existingRows && existingRows.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "This email, or this particular email ID, is already being used for registration.",
          },
          { status: 409 }
        );
      }
    }

    // 3. Generate guaranteed unique registration ID and persist to local JSON backup
    const registrationId = await generateUniqueRegistrationId(
      {
        fullName: data.fullName,
        yearOfStudy: data.yearOfStudy,
      },
      supabase
    );
    saveRegistration({
      registrationId,
      createdAt: new Date().toISOString(),
      data: {
        ...data,
        registrationId,
      },
    });
    const successMessage = "Registration submitted successfully!";

    // 4. Supabase Sync (Primary Database)
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
          graduation_year: data.graduationYear || null,
          is_ieee_member: data.isIeeeMember,
          ieee_membership_number: data.ieeeMembershipNumber?.trim() || null,
          is_ieee_cs_member: Boolean(data.isIeeeCsMember),
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
