import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { ok } from "@/lib/utils/response";

type Context = { params: Promise<{ pageId: string }> };

export async function GET(request: Request, context: Context) {
  try {
    await assertSessionUser();
    const { pageId } = await context.params;
    const url = new URL(request.url);
    const range = url.searchParams.get("range");
    return ok(await new AnalyticsService().report(pageId, range === "7d" || range === "90d" ? range : "30d"));
  } catch (error) {
    return handleApiError(error);
  }
}
