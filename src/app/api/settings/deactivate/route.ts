import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

export async function POST() {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const now = new Date();
    await db.query("UPDATE User SET deletedAt = ? WHERE id = ?", [now, user.id]);
    await db.query("UPDATE Page SET isPublished = 0 WHERE userId = ?", [user.id]);
    return ok({ deactivated: true });
  } catch (error) {
    return handleApiError(error);
  }
}
