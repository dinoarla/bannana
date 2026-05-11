import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { destroySession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

export async function DELETE(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { confirmation } = await request.json() as { confirmation: string };
    if (confirmation !== user.username) {
      return Response.json({ success: false, error: { message: "Konfirmasi username tidak cocok." } }, { status: 400 });
    }
    await destroySession();
    await db.query("DELETE FROM User WHERE id = ?", [user.id]);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
