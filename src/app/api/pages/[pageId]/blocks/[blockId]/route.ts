import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { BlockService } from "@/lib/services/BlockService";
import { ok } from "@/lib/utils/response";
import { blockUpdateSchema } from "@/lib/validations/block";
import type { Prisma } from "@prisma/client";

type Context = { params: Promise<{ blockId: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const { blockId } = await context.params;
    const input = blockUpdateSchema.parse(await request.json());
    return ok(await new BlockService().update(blockId, { ...input, config: input.config as Prisma.InputJsonValue | undefined }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const { blockId } = await context.params;
    await new BlockService().delete(blockId);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
