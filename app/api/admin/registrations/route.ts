import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const isDev = process.env.NODE_ENV === "development";
    const supabaseAdmin = getSupabaseAdminClient();

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase client is not configured on the server. Check environment variables.",
        },
        { status: 500 }
      );
    }

    // 1. Authorization Verification
    let authorized = false;
    let userEmail: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      const supabaseUser = getSupabaseServerClient();
      const { data: userData, error: userError } = await supabaseUser.auth.getUser(token);

      if (!userError && userData?.user?.email) {
        userEmail = userData.user.email;

        // Verify if user email exists in admin_users table
        const { data: adminRecord, error: adminErr } = await supabaseAdmin
          .from("admin_users")
          .select("id, email, role, is_active")
          .eq("email", userEmail)
          .eq("is_active", true)
          .maybeSingle();

        if (!adminErr && adminRecord) {
          authorized = true;
          // Update last_login timestamp asynchronously
          supabaseAdmin
            .from("admin_users")
            .update({ last_login: new Date().toISOString() })
            .eq("id", adminRecord.id)
            .then();
        }
      }
    }

    // In development mode, allow access if no token was passed yet, but log it
    if (!authorized && isDev) {
      authorized = true;
    }

    if (!authorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. You must be an active organizer or admin to access this resource.",
        },
        { status: 401 }
      );
    }

    // 2. Query Parameters
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase();
    const college = url.searchParams.get("college")?.trim();
    const membership = url.searchParams.get("membership")?.trim().toLowerCase();
    const limit = parseInt(url.searchParams.get("limit") || "2000", 10);

    // 3. Database Query
    let query = supabaseAdmin
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (college) {
      query = query.eq("university", college);
    }

    if (membership === "ieee") {
      query = query.eq("is_ieee_member", true);
    } else if (membership === "non-ieee") {
      query = query.eq("is_ieee_member", false);
    } else if (membership === "ieee-cs") {
      query = query.eq("is_ieee_cs_member", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Admin API] Failed to fetch registrations:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    let results = data || [];

    // Optional server-side text search across multiple fields
    if (search && results.length > 0) {
      results = results.filter((r) => {
        const text = [
          r.registration_id,
          r.full_name,
          r.email,
          r.college_email || "",
          r.phone,
          r.university,
          r.branch,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(search);
      });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      registrations: results,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[Admin API] Error in registrations handler:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
