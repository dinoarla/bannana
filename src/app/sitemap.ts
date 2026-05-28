import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface";
import { db } from "@/lib/db/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bannana.id";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/pricing`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/register`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/login`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/demo`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/dokumentasi`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/kontak`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  let userPages: MetadataRoute.Sitemap = [];
  try {
    const [rows] = await db.query(
      `SELECT u.username, p.updatedAt
       FROM Page p
       JOIN User u ON u.id = p.userId
       WHERE p.isPublished = 1 AND u.deletedAt IS NULL
       ORDER BY p.updatedAt DESC
       LIMIT 5000`
    );
    userPages = (rows as Array<{ username: string; updatedAt: Date }>).map((row) => ({
      url: `${baseUrl}/${row.username}`,
      lastModified: row.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch { /* DB unavailable at build time */ }

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const [rows] = await db.query(
      `SELECT slug, updatedAt FROM Post WHERE status = 'published' ORDER BY publishedAt DESC LIMIT 1000`
    );
    blogPages = (rows as Array<{ slug: string; updatedAt: Date }>).map((row) => ({
      url: `${baseUrl}/blog/${row.slug}`,
      lastModified: row.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch { /* Post table may not exist yet */ }

  return [...staticPages, ...blogPages, ...userPages];
}
