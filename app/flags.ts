import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

function createSafeVercelAdapter(fallbackValue: boolean = false) {
  const base = vercelAdapter();
  return {
    ...base,
    async decide(args: any) {
      try {
        const value = await base.decide(args);
        if (value !== undefined && value !== null) {
          return Boolean(value);
        }
        return fallbackValue;
      } catch {
        // Fallback when Vercel OIDC is unavailable (e.g. local dev without vercel env pull)
        return fallbackValue;
      }
    },
    async bulkDecide(args: any): Promise<Record<string, any>> {
      try {
        if (base.bulkDecide) {
          const res = await base.bulkDecide(args);
          if (res) return res;
        }
      } catch {
        // Fallback on error
      }
      const result: Record<string, boolean> = {};
      for (const f of args.flags) {
        result[f.key] = f.key === "isRegistrationActive" ? fallbackValue : false;
      }
      return result;
    },
  };
}

export const showKiroCollaboration = flag<boolean>({
  key: "showKiroCollaboration",
  adapter: createSafeVercelAdapter(false),
  defaultValue: false,
});

/**
 * Flag controlling HackIEEE 2026-27 Registrations:
 * - When TRUE: Navbar swaps "Contact Us" for "Login" & "Register", Hero displays "Register for HackIEEE"
 * - When FALSE: Navbar retains "Contact Us", Hero displays "Tracks & Challenges" & "Timeline"
 * (The direct routes /register and /login remain accessible anytime for review & staging)
 */
export const isRegistrationActive = flag<boolean>({
  key: "isRegistrationActive",
  adapter: createSafeVercelAdapter(true),
  defaultValue: true,
});
