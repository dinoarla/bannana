import { destroySession } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";

export async function DELETE() {
  try {
    await verifyCsrf();
    await destroySession();
    return ok({ loggedOut: true });
  } catch (error) {
    return handleApiError(error);
  }
}
