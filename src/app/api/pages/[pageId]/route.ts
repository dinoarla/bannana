import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { PageService } from "@/lib/services/PageService";
import { ok } from "@/lib/utils/response";
import { pageUpdateSchema } from "@/lib/validations/page";

type Context = { params: Promise<{ pageId: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const svc = new PageService();
    const page = await svc.get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    return ok(page);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const svc = new PageService();
    const page = await svc.get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    const input = pageUpdateSchema.parse(await request.json());
    return ok(await svc.update(pageId, input));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const svc = new PageService();
    const page = await svc.get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    await svc.delete(pageId);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
