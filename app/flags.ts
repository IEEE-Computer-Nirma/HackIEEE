import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export type AuthNavMode = "registration_only" | "both" | "login_only" | "none";

/**
 * Resolves local / environment fallback for AUTH_NAV_MODE.
 * Supports explicit AUTH_NAV_MODE values, with backward-compatibility for IS_REGISTRATION_ACTIVE.
 */
export function getFallbackAuthNavMode(): AuthNavMode {
  const envMode = process.env.AUTH_NAV_MODE?.trim() as AuthNavMode | undefined;
  if (
    envMode === "registration_only" ||
    envMode === "both" ||
    envMode === "login_only" ||
    envMode === "none"
  ) {
    return envMode;
  }
  // Backward compatibility with legacy IS_REGISTRATION_ACTIVE toggle
  if (process.env.IS_REGISTRATION_ACTIVE === "false") {
    return "none";
  }
  if (process.env.IS_REGISTRATION_ACTIVE === "true") {
    return "both";
  }
  return "both";
}

/**
 * Vercel Feature Flag: AUTH_NAV_MODE (Type: String)
 * Variants:
 *  - "both": Shows Login on left side, Register on the right corner (Default live mode)
 *  - "registration_only": Shows Register button on the right corner
 *  - "login_only": Shows Login button on the right corner
 *  - "none": Shows Contact Us button (Registration closed)
 */
export const authNavMode = flag<AuthNavMode>({
  key: "AUTH_NAV_MODE",
  adapter: vercelAdapter(),
  defaultValue: getFallbackAuthNavMode(),
  options: [
    { value: "both", label: "Both Login & Register" },
    { value: "registration_only", label: "Registration Only" },
    { value: "login_only", label: "Login Only" },
    { value: "none", label: "None (Contact Us Only)" },
  ],
});

/**
 * Resolves local / environment fallback for SHOW_KIRO_COLLABORATION.
 * Defaults to true for active event collaboration, unless explicitly disabled with "false".
 */
export function getFallbackShowKiroCollaboration(): boolean {
  if (process.env.SHOW_KIRO_COLLABORATION === "false") {
    return false;
  }
  return true;
}

export const showKiroCollaboration = flag<boolean>({
  key: "showKiroCollaboration",
  adapter: vercelAdapter(),
  defaultValue: getFallbackShowKiroCollaboration(),
});
