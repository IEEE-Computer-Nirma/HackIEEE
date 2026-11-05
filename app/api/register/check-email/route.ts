import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPersonal = typeof body.personalEmail === "string" ? body.personalEmail.trim().toLowerCase() : "";
    const rawCollege = typeof body.collegeEmail === "string" ? body.collegeEmail.trim().toLowerCase() : "";

    if (!rawPersonal && !rawCollege) {
      return NextResponse.json({
        exists: false,
        conflicts: { personalEmail: false, collegeEmail: false },
      });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      // If Supabase client is not available, allow continuation
      return NextResponse.json({
        exists: false,
        conflicts: { personalEmail: false, collegeEmail: false },
        warning: "Database verification unavailable",
      });
    }

    let personalConflict = false;
    let collegeConflict = false;

    // Check personal email if provided
    if (rawPersonal) {
      const { data: personalMatches, error: pErr } = await supabase
        .from("registrations")
        .select("id, email, college_email")
        .or(`email.ilike.${rawPersonal},college_email.ilike.${rawPersonal}`)
        .limit(1);

      if (pErr) {
        console.error("[Check Email API] Error checking personal email:", pErr);
      } else if (personalMatches && personalMatches.length > 0) {
        personalConflict = true;
      }
    }

    // Check college / student email if provided
    if (rawCollege) {
      const { data: collegeMatches, error: cErr } = await supabase
        .from("registrations")
        .select("id, email, college_email")
        .or(`email.ilike.${rawCollege},college_email.ilike.${rawCollege}`)
        .limit(1);

      if (cErr) {
        console.error("[Check Email API] Error checking college email:", cErr);
      } else if (collegeMatches && collegeMatches.length > 0) {
        collegeConflict = true;
      }
    }

    const exists = personalConflict || collegeConflict;

    return NextResponse.json({
      exists,
      conflicts: {
        personalEmail: personalConflict,
        collegeEmail: collegeConflict,
      },
      message: exists
        ? "This email, or this particular email ID, is already being used for registration."
        : null,
    });
  } catch (err: unknown) {
    console.error("[Check Email API] Unexpected error:", err);
    return NextResponse.json(
      {
        exists: false,
        conflicts: { personalEmail: false, collegeEmail: false },
        error: "Failed to verify email availability",
      },
      { status: 500 }
    );
  }
}
