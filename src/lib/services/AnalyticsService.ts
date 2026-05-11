import { AnalyticsRepository } from "@/lib/db/repositories/AnalyticsRepository";
import { BlockRepository } from "@/lib/db/repositories/BlockRepository";
import { PageRepository } from "@/lib/db/repositories/PageRepository";
import { errors } from "@/lib/errors/AppError";

export class AnalyticsService {
  constructor(
    private readonly analytics = new AnalyticsRepository(),
    private readonly pages = new PageRepository(),
    private readonly blocks = new BlockRepository()
  ) {}

  async track(input: { pageId: string; blockId?: string; event: "view" | "click"; referrer?: string | null; userAgent?: string | null }) {
    const page = await this.pages.findById(input.pageId);
    if (!page) throw errors.notFound("Halaman tidak ditemukan.");
    if (input.event === "view") await this.pages.incrementView(input.pageId);
    if (input.event === "click" && input.blockId) await this.blocks.incrementClick(input.blockId);
    return this.analytics.create(input);
  }

  async report(pageId: string, range: "7d" | "30d" | "90d" = "30d") {
    const page = await this.pages.findById(pageId);
    if (!page) throw errors.notFound("Halaman tidak ditemukan.");
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const events = await this.analytics.listPageEvents(pageId, from);
    const clicks = page.blocks.reduce((sum, block) => sum + block.clickCount, 0);
    const viewEvents = events.filter((e) => e.event === "view");
    const viewTotal = viewEvents.length || 1;

    return {
      pageId,
      range,
      totals: {
        views: page.viewCount,
        clicks,
        ctr: page.viewCount ? Number(((clicks / page.viewCount) * 100).toFixed(1)) : 0,
        uniqueVisitors: page.uniqueVisitors,
      },
      trend: Array.from({ length: days }, (_, index) => {
        const day = new Date(from.getTime() + index * 24 * 60 * 60 * 1000);
        const label = `${day.getDate()}/${day.getMonth() + 1}`;
        const dayEvents = events.filter((e) => e.createdAt.toDateString() === day.toDateString());
        return {
          day: index + 1,
          label,
          views: dayEvents.filter((e) => e.event === "view").length,
          clicks: dayEvents.filter((e) => e.event === "click").length,
        };
      }),
      topLinks: page.blocks
        .filter((b) => ["LINK", "EMBED"].includes(b.type))
        .sort((a, b) => b.clickCount - a.clickCount),
      devices: (() => {
        const counts: Record<string, number> = {};
        for (const e of viewEvents) {
          const d = e.device ?? "Unknown";
          counts[d] = (counts[d] ?? 0) + 1;
        }
        return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([label, count]) => ({ label, count, percent: Number(((count / viewTotal) * 100).toFixed(1)) }));
      })(),
      referrers: (() => {
        const counts: Record<string, number> = {};
        for (const e of viewEvents) {
          let ref = "Direct";
          if (e.referrer) {
            try { ref = new URL(e.referrer).hostname.replace(/^www\./, ""); } catch { ref = e.referrer.slice(0, 40); }
          }
          counts[ref] = (counts[ref] ?? 0) + 1;
        }
        return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([source, count]) => ({ source, count, pct: Number(((count / viewTotal) * 100).toFixed(1)) }));
      })(),
      countries: (() => {
        const counts: Record<string, number> = {};
        for (const e of viewEvents) {
          const c = e.country ?? "Unknown";
          counts[c] = (counts[c] ?? 0) + 1;
        }
        return Object.entries(counts)
          .filter(([k]) => k !== "Unknown")
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([country, count]) => ({ country, count, pct: Number(((count / viewTotal) * 100).toFixed(1)) }));
      })(),
      heatmap: (() => {
        const hours = new Array(24).fill(0) as number[];
        for (const e of viewEvents) hours[e.createdAt.getHours()]++;
        return hours;
      })(),
    };
  }
}
