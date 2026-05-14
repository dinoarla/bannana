import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";
import { verifyCsrf } from "@/lib/csrf/token";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await assertSessionUser();
    if (user.role !== "ADMIN") throw errors.forbidden();

    const [rows] = await db.query(`
      SELECT s.id, s.createdAt, s.expiresAt,
             u.id as userId, u.email, u.username, u.role,
             COALESCE(p.displayName, u.username) as displayName,
             p.avatarUrl
      FROM Session s
      JOIN User u ON u.id = s.userId
      LEFT JOIN Profile p ON p.userId = s.userId
      WHERE s.expiresAt > NOW()
      ORDER BY s.createdAt DESC
      LIMIT 200
    `);

    return ok(rows);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    if (user.role !== "ADMIN") throw errors.forbidden();

    const body = await req.json() as { sessionId: string };
    if (!body.sessionId) throw errors.validation("sessionId diperlukan.");

    await db.query("DELETE FROM Session WHERE id = ?", [body.sessionId]);

    return ok({ revoked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
