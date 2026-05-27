import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bannana.id";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/settings/",
          "/pages/",
          "/analytics/",
          "/themes/",
          "/langganan/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
