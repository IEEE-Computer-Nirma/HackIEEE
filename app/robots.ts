import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://hack.ieeenirma.org");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        // Generative search & LLM crawler permissions (AEO / GEO)
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: ["/", "/llms.txt"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
