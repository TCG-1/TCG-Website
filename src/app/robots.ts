import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site-seo";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.url,
    rules: [
      {
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/auth",
          "/client-hub",
          "/newsletter/subscription",
          "/reset-password",
          "/sign-in",
          "/sign-up",
        ],
        userAgent: "*",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
