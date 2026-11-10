import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { authNavMode, getFallbackAuthNavMode } from "@/app/flags";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") || "/register?step=confirmed";
  const isAdminAuth = next.startsWith("/admin");

  let active = false;
  try {
    const mode = await authNavMode();
    active = mode === "registration_only" || mode === "both";
  } catch {
    const fallbackMode = getFallbackAuthNavMode();
    active = fallbackMode === "registration_only" || fallbackMode === "both";
  }

  // Allow admin login callback regardless of public registration flag
  if (!active && !isAdminAuth) {
    return NextResponse.redirect(`${origin}/`);
  }

  const code = searchParams.get("code");

  if (code) {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
    console.error("[Auth Callback] Exchange error:", error);
  }

  // Redirect on error or missing code
  return NextResponse.redirect(
    `${origin}${isAdminAuth ? "/admin?error=auth_failed" : "/login?error=auth_failed"}`
  );
}
