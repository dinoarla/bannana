import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { ok } from "@/lib/utils/response";

export async function GET(request: Request) {
  try {
    const user = await assertSessionUser();
    const u = new URL(request.url).searchParams.get("u") ?? "";
    if (!u || u === user.username) return ok({ available: true });
    const existing = await new UserRepository().findByUsername(u);
    return ok({ available: !existing });
  } catch (error) {
    return handleApiError(error);
  }
}
