import { headers } from "next/headers";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { trackSchema } from "@/lib/validations/analytics";

async function getCountryFromIp(ip: string): Promise<string | null> {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168") || ip.startsWith("10.")) {
    return null;
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(2000),
    });
    const data = await res.json() as { countryCode?: string };
    return data.countryCode ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const input = trackSchema.parse(await request.json());
    const headerBag = await headers();
    const rawIp = headerBag.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? headerBag.get("x-real-ip")
      ?? "";
    const country = await getCountryFromIp(rawIp);
    await new AnalyticsService().track({
      ...input,
      referrer: headerBag.get("referer"),
      userAgent: headerBag.get("user-agent"),
      country,
    });
    return ok({ tracked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
