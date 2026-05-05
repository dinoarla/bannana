import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { BlockService } from "@/lib/services/BlockService";
import { ok } from "@/lib/utils/response";
import { reorderSchema } from "@/lib/validations/block";

export async function PUT(request: Request) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const input = reorderSchema.parse(await request.json());
    return ok(await new BlockService().reorder(input));
  } catch (error) {
    return handleApiError(error);
  }
}
