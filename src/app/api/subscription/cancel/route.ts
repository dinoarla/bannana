import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

export async function POST() {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    await db.query(
      "UPDATE Subscription SET status='cancelled', cancelledAt=NOW(), updatedAt=NOW() WHERE userId=? AND status='active'",
      [user.id]
    );
    return ok({ cancelled: true });
  } catch (error) {
    return handleApiError(error);
  }
}
