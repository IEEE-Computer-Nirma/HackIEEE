import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

function createSafeVercelAdapter() {
  const base = vercelAdapter();
  return {
    ...base,
    async decide(args: any) {
      try {
        return await base.decide(args);
      } catch {
        return process.env.SHOW_KIRO_COLLABORATION !== "false";
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
      const fallback = process.env.SHOW_KIRO_COLLABORATION !== "false";
      const result: Record<string, boolean> = {};
      for (const f of args.flags) {
        result[f.key] = fallback;
      }
      return result;
    },
  };
}

export const showKiroCollaboration = flag({
  key: "showKiroCollaboration",
  adapter: createSafeVercelAdapter(),
  defaultValue: true,
  decide() {
    return process.env.SHOW_KIRO_COLLABORATION !== "false";
  },
});
