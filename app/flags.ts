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
    return "registration_only";
  }
  return "registration_only";
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
 * Resolves local / environment fallback for SHOW_KIRO_COLLABORATION (Master Toggle).
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

/**
 * Variant 1: Hero Section 2-line badge above HACKIEEE title
 */
export function getFallbackShowKiroInHero(): boolean {
  if (process.env.SHOW_KIRO_COLLABORATION === "false") return false;
  if (process.env.SHOW_KIRO_IN_HERO === "true") return true;
  if (process.env.SHOW_KIRO_IN_HERO === "false") return false;
  return false; // Default OFF
}

export const showKiroInHero = flag<boolean>({
  key: "SHOW_KIRO_IN_HERO",
  adapter: vercelAdapter(),
  defaultValue: getFallbackShowKiroInHero(),
});

/**
 * Variant 2: About Section "Supported by" block above "Organised by"
 */
export function getFallbackShowKiroInAbout(): boolean {
  if (process.env.SHOW_KIRO_COLLABORATION === "false") return false;
  if (process.env.SHOW_KIRO_IN_ABOUT === "true") return true;
  return false; // Default OFF
}

export const showKiroInAbout = flag<boolean>({
  key: "SHOW_KIRO_IN_ABOUT",
  adapter: vercelAdapter(),
  defaultValue: getFallbackShowKiroInAbout(),
});

/**
 * Variant 3: Top-left header bar badge beside navigation (Active Variant)
 */
export function getFallbackShowKiroInNav(): boolean {
  if (process.env.SHOW_KIRO_COLLABORATION === "false") return false;
  if (process.env.SHOW_KIRO_IN_NAV === "false") return false;
  if (process.env.SHOW_KIRO_IN_NAV === "true") return true;
  return true; // Default ON
}

export const showKiroInNav = flag<boolean>({
  key: "SHOW_KIRO_IN_NAV",
  adapter: vercelAdapter(),
  defaultValue: getFallbackShowKiroInNav(),
});
