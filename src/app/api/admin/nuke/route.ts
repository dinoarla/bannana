import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";

export async function POST() {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      // Order matters: delete dependencies first
      await conn.query("DELETE a FROM Analytics a JOIN Page p ON a.pageId = p.id JOIN User u ON p.userId = u.id WHERE u.role = 'USER'");
      await conn.query("DELETE b FROM Block b JOIN Page p ON b.pageId = p.id JOIN User u ON p.userId = u.id WHERE u.role = 'USER'");
      await conn.query("DELETE pg FROM Page pg JOIN User u ON pg.userId = u.id WHERE u.role = 'USER'");
      await conn.query("DELETE s FROM Session s JOIN User u ON s.userId = u.id WHERE u.role = 'USER'");
      await conn.query("DELETE ak FROM ApiKey ak JOIN User u ON ak.userId = u.id WHERE u.role = 'USER'");
      await conn.query("DELETE al FROM AuditLog al JOIN User u ON al.userId = u.id WHERE u.role = 'USER'");
      await conn.query("DELETE p FROM Profile p JOIN User u ON p.userId = u.id WHERE u.role = 'USER'");
      await conn.query("DELETE FROM User WHERE role = 'USER'");
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    return ok({ nuked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
