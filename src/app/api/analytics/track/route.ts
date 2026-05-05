import { headers } from "next/headers";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { trackSchema } from "@/lib/validations/analytics";

export async function POST(request: Request) {
  try {
    const input = trackSchema.parse(await request.json());
    const headerBag = await headers();
    await new AnalyticsService().track({
      ...input,
      referrer: headerBag.get("referer"),
      userAgent: headerBag.get("user-agent")
    });
    return ok({ tracked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
