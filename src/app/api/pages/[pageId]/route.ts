import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { PageService } from "@/lib/services/PageService";
import { ok } from "@/lib/utils/response";
import { pageUpdateSchema } from "@/lib/validations/page";

type Context = { params: Promise<{ pageId: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    await assertSessionUser();
    const { pageId } = await context.params;
    return ok(await new PageService().get(pageId));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const { pageId } = await context.params;
    const input = pageUpdateSchema.parse(await request.json());
    return ok(await new PageService().update(pageId, input));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const { pageId } = await context.params;
    await new PageService().delete(pageId);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
