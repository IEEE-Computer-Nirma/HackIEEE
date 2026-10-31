import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export const showKiroCollaboration = flag<boolean>({
  key: "showKiroCollaboration",
  description: "Show Kiro collaboration logo and label in the hero section",
  adapter: vercelAdapter(),
  options: [
    { value: true, label: "On" },
    { value: false, label: "Off" },
  ],
  async decide() {
    if (
      process.env.SHOW_KIRO_COLLABORATION === "false" ||
      process.env.NEXT_PUBLIC_SHOW_KIRO_COLLABORATION === "false"
    ) {
      return false;
    }
    return true;
  },
});
