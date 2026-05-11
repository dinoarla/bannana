import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";

type Params = Promise<{ userId: string }>;

export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();
    const { userId } = await params;
    if (userId === admin.id) throw errors.validation("Tidak bisa hapus akun sendiri.");

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        "DELETE FROM Analytics WHERE pageId IN (SELECT id FROM Page WHERE userId = ?)",
        [userId]
      );
      await conn.query("DELETE FROM Block WHERE pageId IN (SELECT id FROM Page WHERE userId = ?)", [userId]);
      await conn.query("DELETE FROM Page WHERE userId = ?", [userId]);
      await conn.query("DELETE FROM Session WHERE userId = ?", [userId]);
      await conn.query("DELETE FROM ApiKey WHERE userId = ?", [userId]);
      await conn.query("DELETE FROM AuditLog WHERE userId = ?", [userId]);
      await conn.query("DELETE FROM Profile WHERE userId = ?", [userId]);
      await conn.query("DELETE FROM User WHERE id = ?", [userId]);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();
    const { userId } = await params;

    const body = await req.json();
    const role = body.role === "ADMIN" ? "ADMIN" : "USER";
    await db.query("UPDATE User SET role = ?, updatedAt = ? WHERE id = ?", [role, new Date(), userId]);

    return ok({ updated: true, role });
  } catch (error) {
    return handleApiError(error);
  }
}
