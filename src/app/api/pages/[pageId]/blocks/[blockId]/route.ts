import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { BlockService } from "@/lib/services/BlockService";
import { PageService } from "@/lib/services/PageService";
import { ok } from "@/lib/utils/response";
import { blockUpdateSchema } from "@/lib/validations/block";

type Context = { params: Promise<{ pageId: string; blockId: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { pageId, blockId } = await context.params;
    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    const input = blockUpdateSchema.parse(await request.json());
    return ok(await new BlockService().update(blockId, { ...input, config: input.config as Record<string, unknown> | undefined }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { pageId, blockId } = await context.params;
    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    await new BlockService().delete(blockId);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
