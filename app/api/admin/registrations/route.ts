import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
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

    // 1. Strict Authentication Verification
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing authentication token. Please sign in with Google.",
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const supabaseUser = getSupabaseServerClient();
    const { data: userData, error: userError } = await supabaseUser.auth.getUser(token);

    if (userError || !userData?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or expired session. Please sign in again.",
        },
        { status: 401 }
      );
    }

    const userEmail = userData.user.email.toLowerCase().trim();

    // 2. Whitelist Verification against admin_users table
    const { data: adminRecord, error: adminErr } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, full_name, role, is_active")
      .ilike("email", userEmail)
      .eq("is_active", true)
      .maybeSingle();

    if (adminErr || !adminRecord) {
      return NextResponse.json(
        {
          success: false,
          error: `Access Denied: The account "${userEmail}" is not authorized. You must be in the organizer whitelist.`,
          userEmail,
        },
        { status: 403 }
      );
    }

    // Update last_login timestamp asynchronously
    supabaseAdmin
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", adminRecord.id)
      .then();

    // 3. Query Parameters
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase();
    const college = url.searchParams.get("college")?.trim();
    const membership = url.searchParams.get("membership")?.trim().toLowerCase();
    const limit = parseInt(url.searchParams.get("limit") || "2000", 10);

    // 4. Database Query
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
      admin: {
        email: adminRecord.email,
        fullName: adminRecord.full_name || userData.user.user_metadata?.full_name || "Organizer",
        role: adminRecord.role || "organizer",
      },
      count: results.length,
      registrations: results,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[Admin API] Error in registrations handler:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
