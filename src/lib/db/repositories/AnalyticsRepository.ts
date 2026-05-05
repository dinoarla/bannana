import { prisma } from "@/lib/db/client";

export class AnalyticsRepository {
  create(input: { pageId: string; blockId?: string; event: "view" | "click"; referrer?: string | null; userAgent?: string | null }) {
    return prisma.analytics.create({
      data: {
        pageId: input.pageId,
        blockId: input.blockId,
        event: input.event,
        referrer: input.referrer,
        userAgent: input.userAgent
      }
    });
  }

  listPageEvents(pageId: string, from: Date) {
    return prisma.analytics.findMany({
      where: { pageId, createdAt: { gte: from } },
      orderBy: { createdAt: "asc" }
    });
  }
}
