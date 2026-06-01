import { db } from "@/lib/db/client";
import { readFileSync } from "fs";
import { join } from "path";

type Params = Promise<{ username: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { username } = await params;

  try {
    const [rows] = await db.query(
      `SELECT pg.avatarUrl AS pageAvatarUrl, p.avatarUrl AS profileAvatarUrl,
              sub.plan AS subPlan
       FROM Page pg
       JOIN User u ON u.id = pg.userId
       LEFT JOIN Profile p ON p.userId = u.id
       LEFT JOIN Subscription sub ON sub.userId = u.id AND sub.status = 'active'
       WHERE pg.isPublished = 1 AND (pg.slug = ? OR u.username = ?)
       ORDER BY CASE WHEN pg.slug = ? THEN 0 ELSE 1 END
       LIMIT 1`,
      [username, username, username]
    );
    const row = (rows as Record<string, unknown>[])[0];
    const isPro = row?.subPlan === "pro";
    // Pro: page avatar → profile avatar → default
    // Free: profile avatar (from Pengaturan) → default
    const avatarUrl = isPro
      ? ((row?.pageAvatarUrl ?? row?.profileAvatarUrl) as string | null)
      : (row?.profileAvatarUrl as string | null);

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
