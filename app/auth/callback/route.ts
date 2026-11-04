import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import { isRegistrationActive } from "@/app/flags";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  let active = false;
  try {
    active = Boolean(await isRegistrationActive());
  } catch {
    active = false;
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
