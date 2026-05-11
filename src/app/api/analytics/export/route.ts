import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { PageService } from "@/lib/services/PageService";

export async function GET(request: Request) {
  try {
    const user = await assertSessionUser();
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId") ?? "";
    const range = (searchParams.get("range") as "7d" | "30d" | "90d") || "30d";

    const pages = await new PageService().list(user.id);
    const page = pages.find((p) => p.id === pageId) ?? pages[0];
    if (!page) throw errors.notFound("Halaman tidak ditemukan.");

    const report = await new AnalyticsService().report(page.id, range);

    const rows: string[] = [
      "Tanggal,Views,Klik",
      ...report.trend.map((d) => `"${d.label}",${d.views},${d.clicks}`),
      "",
      "Ringkasan",
      `"Total Views",${report.totals.views}`,
      `"Total Klik",${report.totals.clicks}`,
      `"CTR",${report.totals.ctr}%`,
      `"Pengunjung Unik",${report.totals.uniqueVisitors}`,
      "",
      "Top Links,Klik",
      ...report.topLinks.map((l) => `"${(l.title ?? "Tanpa judul").replace(/"/g, '""')}",${l.clickCount}`),
    ];

    const csv = rows.join("\n");
    const filename = `bannana-analytics-${page.id.slice(0, 8)}-${range}.csv`;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
