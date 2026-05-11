import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

type Context = { params: Promise<{ keyId: string }> };

export async function DELETE(_request: Request, context: Context) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { keyId } = await context.params;
    await db.query(
      "UPDATE ApiKey SET revokedAt = NOW() WHERE id = ? AND userId = ? AND revokedAt IS NULL",
      [keyId, user.id]
    );
    return ok({ revoked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
