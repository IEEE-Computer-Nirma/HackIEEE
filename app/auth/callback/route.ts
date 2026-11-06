import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import { authNavMode, getFallbackAuthNavMode } from "@/app/flags";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  let active = false;
  try {
    const mode = await authNavMode();
    active = mode === "registration_only" || mode === "both";
  } catch {
    const fallbackMode = getFallbackAuthNavMode();
    active = fallbackMode === "registration_only" || fallbackMode === "both";
  }

  if (!active) {
    return NextResponse.redirect(`${origin}/`);
  }

  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/register?step=confirmed";

  if (code) {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect on error or missing code
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
