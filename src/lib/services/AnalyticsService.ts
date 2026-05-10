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

    return {
      pageId,
      range,
      totals: {
        views: page.viewCount,
        clicks,
        ctr: page.viewCount ? Number(((clicks / page.viewCount) * 100).toFixed(1)) : 0,
        uniqueVisitors: page.uniqueVisitors
      },
      trend: Array.from({ length: days }, (_, index) => {
        const day = new Date(from.getTime() + index * 24 * 60 * 60 * 1000);
        const sameDay = events.filter((event) => event.createdAt.toDateString() === day.toDateString());
        return {
          day: index + 1,
          views: sameDay.filter((event) => event.event === "view").length,
          clicks: sameDay.filter((event) => event.event === "click").length
        };
      }),
      topLinks: page.blocks.filter((block) => ["LINK", "EMBED"].includes(block.type)).sort((a, b) => b.clickCount - a.clickCount),
      devices: (() => {
        const viewEvents = events.filter((e) => e.event === "view");
        const total = viewEvents.length || 1;
        const counts: Record<string, number> = {};
        for (const e of viewEvents) {
          const d = e.device ?? "Unknown";
          counts[d] = (counts[d] ?? 0) + 1;
        }
        return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([label, count]) => ({ label, percent: Number(((count / total) * 100).toFixed(1)) }));
      })()
    };
  }
}
