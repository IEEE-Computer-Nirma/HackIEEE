import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Returns a Supabase client with administrative / service-role privileges.
 * Prefers SUPABASE_SERVICE_ROLE_KEY to bypass RLS for server-side registration writes.
 * Falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY if service role is not provided or invalid.
 * Automatically sanitizes URLs ending in /rest/v1.
 */
export function getSupabaseAdminClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // If serviceKey looks like a raw HMAC JWT secret (e.g. 88-char base64 ending in ==)
  // rather than an API key JWT (starting with eyJ...) or Supabase secret key (sb_secret_...),
  // we fallback to anonKey so PostgREST doesn't reject with "Invalid API key".
  const isRawJwtSecret =
    Boolean(serviceKey) &&
    !serviceKey!.startsWith("eyJ") &&
    !serviceKey!.startsWith("sb_") &&
    serviceKey!.endsWith("==");

  const activeKey = (!isRawJwtSecret && serviceKey) ? serviceKey : (anonKey || serviceKey);

  if (
    !supabaseUrl ||
    !activeKey ||
    supabaseUrl.trim() === "" ||
    activeKey.trim() === "" ||
    supabaseUrl.includes("placeholder.supabase.co") ||
    activeKey === "placeholder-key"
  ) {
    return null;
  }

  return createClient(supabaseUrl, activeKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
