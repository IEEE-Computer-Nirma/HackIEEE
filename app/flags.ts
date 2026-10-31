import { flag } from "flags/next";

export const showKiroCollaboration = flag<boolean>({
  key: "showKiroCollaboration",
  description: "Show Kiro collaboration logo and label in the hero section",
  origin: "https://vercel.com",
  options: [
    { value: true, label: "On" },
    { value: false, label: "Off" },
  ],
  async decide() {
    // Allows toggling via environment variables (default: true)
    if (
      process.env.SHOW_KIRO_COLLABORATION === "false" ||
      process.env.NEXT_PUBLIC_SHOW_KIRO_COLLABORATION === "false"
    ) {
      return false;
    }
    return true;
  },
});

