import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

function createSafeVercelAdapter() {
  const base = vercelAdapter();
  return {
    ...base,
    async decide(args: any) {
      try {
        const value = await base.decide(args);
        return Boolean(value);
      } catch {
        // Fallback when Vercel OIDC is unavailable (e.g. local dev without vercel env pull)
        return false;
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
        result[f.key] = false;
      }
      return result;
    },
  };
}

export const showKiroCollaboration = flag<boolean>({
  key: "showKiroCollaboration",
  adapter: createSafeVercelAdapter(),
  defaultValue: false,
});
