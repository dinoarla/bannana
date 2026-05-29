import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { PageService } from "@/lib/services/PageService";
import { ok } from "@/lib/utils/response";

type Context = { params: Promise<{ pageId: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    const url = new URL(request.url);
    const range = url.searchParams.get("range");
    return ok(await new AnalyticsService().report(pageId, range === "7d" || range === "90d" ? range : "30d"));
  } catch (error) {
    return handleApiError(error);
  }
}
