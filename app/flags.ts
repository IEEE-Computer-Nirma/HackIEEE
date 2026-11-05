import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export type AuthNavMode = "registration_only" | "both" | "login_only" | "none";

/**
 * Vercel Feature Flag: AUTH_NAV_MODE (Type: String)
 * Variants:
 *  - "registration_only": Shows Register button on the right corner
 *  - "both": Shows Login on left side, Register on the right corner
 *  - "login_only": Shows Login button on the right corner
 *  - "none": Shows Contact Us button
 */
export const authNavMode = flag<AuthNavMode>({
  key: "AUTH_NAV_MODE",
  adapter: vercelAdapter(),
  defaultValue: "registration_only",
  options: [
    { value: "registration_only", label: "Registration Only" },
    { value: "both", label: "Both Login & Register" },
    { value: "login_only", label: "Login Only" },
    { value: "none", label: "None (Contact Us Only)" },
  ],
});

export const showKiroCollaboration = flag<boolean>({
  key: "showKiroCollaboration",
  adapter: vercelAdapter(),
  defaultValue: false,
});
