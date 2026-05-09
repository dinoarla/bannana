import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { BlockService } from "@/lib/services/BlockService";
import { created, ok } from "@/lib/utils/response";
import { blockCreateSchema } from "@/lib/validations/block";
type Context = { params: Promise<{ pageId: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    await assertSessionUser();
    const { pageId } = await context.params;
    return ok(await new BlockService().list(pageId));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: Context) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const { pageId } = await context.params;
    const input = blockCreateSchema.parse(await request.json());
    return created(await new BlockService().create(pageId, { ...input, config: input.config as Record<string, unknown> }));
  } catch (error) {
    return handleApiError(error);
  }
}
