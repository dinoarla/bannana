import { db } from "@/lib/db/client";
import { readFileSync } from "fs";
import { join } from "path";

type Params = Promise<{ username: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { username } = await params;

  try {
    const [rows] = await db.query(
      `SELECT pg.avatarUrl AS pageAvatarUrl, p.avatarUrl AS profileAvatarUrl
       FROM User u
       LEFT JOIN Profile p ON p.userId = u.id
       LEFT JOIN Page pg ON pg.userId = u.id AND pg.isPublished = 1
       WHERE u.username = ?
       ORDER BY CASE WHEN pg.slug = u.username THEN 0 ELSE 1 END, pg.createdAt ASC
       LIMIT 1`,
      [username]
    );
    const row = (rows as Record<string, unknown>[])[0];
    const avatarUrl = (row?.pageAvatarUrl ?? row?.profileAvatarUrl) as string | null;

    if (avatarUrl) {
      if (avatarUrl.startsWith("data:image/")) {
        const [meta, base64] = avatarUrl.split(",");
        const mimeMatch = meta.match(/data:(image\/[a-z+]+);/);
        const mime = mimeMatch?.[1] ?? "image/jpeg";
        const buffer = Buffer.from(base64, "base64");
        return new Response(buffer, {
          headers: { "Content-Type": mime, "Cache-Control": "public, max-age=86400" },
        });
      } else if (avatarUrl.startsWith("http")) {
        // Fetch and proxy so social scrapers don't have to follow redirects
        const res = await fetch(avatarUrl, { headers: { "User-Agent": "bannana-og/1.0" } });
        if (res.ok) {
          const buf = await res.arrayBuffer();
          const ct = res.headers.get("content-type") ?? "image/jpeg";
          return new Response(buf, {
            headers: { "Content-Type": ct, "Cache-Control": "public, max-age=86400" },
          });
        }
      }
    }
  } catch {
    // fall through to default
  }

  // Serve og-default.png as fallback
  try {
    const png = readFileSync(join(process.cwd(), "public/og-default.png"));
    return new Response(png, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
