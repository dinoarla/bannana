import { db } from "@/lib/db/client";
import type { Analytics } from "@/types/db.types";

function parseAnalytics(row: Record<string, unknown>): Analytics {
  return {
    id: row.id as string,
    pageId: row.pageId as string,
    blockId: row.blockId as string | null,
    event: row.event as string,
    referrer: row.referrer as string | null,
    userAgent: row.userAgent as string | null,
    country: row.country as string | null,
    device: row.device as string | null,
    createdAt: row.createdAt as Date,
  };
}

export class AnalyticsRepository {
  async create(input: { pageId: string; blockId?: string; event: "view" | "click"; referrer?: string | null; userAgent?: string | null }): Promise<Analytics> {
    const id = crypto.randomUUID();
    const now = new Date();
    await db.query(
      "INSERT INTO Analytics (id, pageId, blockId, event, referrer, userAgent, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, input.pageId, input.blockId ?? null, input.event, input.referrer ?? null, input.userAgent ?? null, now]
    );
    return { id, pageId: input.pageId, blockId: input.blockId ?? null, event: input.event, referrer: input.referrer ?? null, userAgent: input.userAgent ?? null, country: null, device: null, createdAt: now };
  }

  async listPageEvents(pageId: string, from: Date): Promise<Analytics[]> {
    const [rows] = await db.query(
      "SELECT * FROM Analytics WHERE pageId = ? AND createdAt >= ? ORDER BY createdAt ASC",
      [pageId, from]
    );
    return (rows as Record<string, unknown>[]).map(parseAnalytics);
  }
}
