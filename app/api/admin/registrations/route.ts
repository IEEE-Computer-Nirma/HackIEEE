
import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/app/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Get the access token from the request
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // 2. Verify the Supabase login
    const supabaseAuth = getSupabaseServerClient();
    const { data: authData, error: authError } =
      await supabaseAuth.auth.getUser(token);

    if (authError || !authData.user?.email) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // 3. Require the service-role key on the server
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Admin database configuration missing" },
        { status: 500 }
      );
    }

    const supabaseAdmin = getSupabaseAdminClient();

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database connection unavailable" },
        { status: 500 }
      );
    }

    // 4. Check whether the user is an active admin
    const { data: admin, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("id, role, is_active")
      .eq("email", authData.user.email.toLowerCase())
      .maybeSingle();

    if (
      adminError ||
      !admin ||
      !admin.is_active ||
      !["owner", "admin"].includes(admin.role)
    ) {
      return NextResponse.json(
        { error: "You do not have admin access" },
        { status: 403 }
      );
    }

    // 5. Fetch registrations only after authorization
    const { data: registrations, error: registrationError } =
      await supabaseAdmin
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

    if (registrationError) {
      console.error("Registration fetch error:", registrationError);

      return NextResponse.json(
        { error: "Could not fetch registrations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    console.error("Admin API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
