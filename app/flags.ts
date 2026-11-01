import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

function createSafeVercelAdapter() {
  const base = vercelAdapter();
  return {
    ...base,
    async decide(args: any) {
      if (process.env.SHOW_KIRO_COLLABORATION === "false") return false;
      if (process.env.SHOW_KIRO_COLLABORATION === "true") return true;

      try {
        const value = await base.decide(args);
        return Boolean(value);
      } catch {
        return false;
      }
    },
    async bulkDecide(args: any): Promise<Record<string, any>> {
      if (process.env.SHOW_KIRO_COLLABORATION === "false") {
        const result: Record<string, boolean> = {};
        for (const f of args.flags) result[f.key] = false;
        return result;
      }
      if (process.env.SHOW_KIRO_COLLABORATION === "true") {
        const result: Record<string, boolean> = {};
        for (const f of args.flags) result[f.key] = true;
        return result;
      }

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
        result[f.key] = false;
      }
      return result;
    },
  };
}

export const showKiroCollaboration = flag({
  key: "showKiroCollaboration",
  adapter: createSafeVercelAdapter(),
  defaultValue: false,
});
