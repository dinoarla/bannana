import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { PageService } from "@/lib/services/PageService";
import { ok } from "@/lib/utils/response";
import { publishSchema } from "@/lib/validations/page";

type Context = { params: Promise<{ pageId: string }> };

export async function POST(request: Request, context: Context) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const { pageId } = await context.params;
    const input = publishSchema.parse(await request.json());
    return ok(await new PageService().publish(pageId, input.publish));
  } catch (error) {
    return handleApiError(error);
  }
}
