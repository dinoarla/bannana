import { handleApiError } from "@/lib/errors/errorHandler";
import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { ok } from "@/lib/utils/response";

export async function GET(request: Request) {
  try {
    const u = new URL(request.url).searchParams.get("u") ?? "";
    if (!u || u.length < 3) return ok({ available: false });
    const existing = await new UserRepository().findByUsername(u);
    return ok({ available: !existing });
  } catch (error) {
    return handleApiError(error);
  }
}
