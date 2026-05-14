import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await assertSessionUser();
    if (user.role !== "ADMIN") throw errors.forbidden();

    const [rows] = await db.query(`
      SELECT pg.id, pg.slug, pg.title, pg.isPublished, pg.viewCount, pg.uniqueVisitors,
             pg.theme, pg.updatedAt, pg.createdAt,
             u.username,
             COALESCE(p.displayName, u.username) as displayName,
             COUNT(b.id) as blockCount
      FROM Page pg
      JOIN User u ON u.id = pg.userId
      LEFT JOIN Profile p ON p.userId = pg.userId
      LEFT JOIN Block b ON b.pageId = pg.id
      GROUP BY pg.id, u.username, p.displayName
      ORDER BY pg.viewCount DESC
      LIMIT 200
    `);

    return ok(rows);
  } catch (error) {
    return handleApiError(error);
  }
}
