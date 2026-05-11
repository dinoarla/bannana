import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await assertSessionUser();
    if (user.role !== "ADMIN") throw errors.forbidden();

    const [rows] = await db.query(`
      SELECT
        u.id, u.email, u.username, u.role,
        u.emailVerified, u.createdAt,
        p.displayName, p.avatarUrl,
        COUNT(DISTINCT pg.id) AS pageCount
      FROM User u
      LEFT JOIN Profile p ON p.userId = u.id
      LEFT JOIN Page pg ON pg.userId = u.id
      GROUP BY u.id, p.displayName, p.avatarUrl
      ORDER BY u.createdAt DESC
    `);

    return ok(rows);
  } catch (error) {
    return handleApiError(error);
  }
}
