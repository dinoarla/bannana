import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { BlockService } from "@/lib/services/BlockService";
import { PageService } from "@/lib/services/PageService";
import { ok } from "@/lib/utils/response";
import { reorderSchema } from "@/lib/validations/block";

type Context = { params: Promise<{ pageId: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    const input = reorderSchema.parse(await request.json());
    return ok(await new BlockService().reorder(input));
  } catch (error) {
    return handleApiError(error);
  }
}
