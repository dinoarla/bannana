import { db } from "@/lib/db/client";
import type { Block, DbBlockType } from "@/types/db.types";

function parseBlock(row: Record<string, unknown>): Block {
  return {
    id: row.id as string,
    pageId: row.pageId as string,
    type: row.type as DbBlockType,
    title: row.title as string | null,
    url: row.url as string | null,
    position: row.position as number,
    isEnabled: Boolean(row.isEnabled),
    config: typeof row.config === "string" ? JSON.parse(row.config) : (row.config ?? {}),
    clickCount: row.clickCount as number,
    createdAt: row.createdAt as Date,
    updatedAt: row.updatedAt as Date,
  };
}

function defaultTitle(type: DbBlockType): string | null {
  if (type === "HEADER") return "Heading Baru";
  if (type === "DIVIDER") return null;
  if (type === "SOCIAL") return "Sosial Media";
  return "Link Baru";
}

export class BlockRepository {
  async list(pageId: string): Promise<Block[]> {
    const [rows] = await db.query(
      "SELECT * FROM Block WHERE pageId = ? ORDER BY position ASC",
      [pageId]
    );
    return (rows as Record<string, unknown>[]).map(parseBlock);
  }

  async create(pageId: string, input: { type: DbBlockType; title?: string | null; url?: string | null; config?: Record<string, unknown> }): Promise<Block> {
    const id = crypto.randomUUID();
    const now = new Date();
    const config = input.config ?? {};
    const title = input.title ?? defaultTitle(input.type);
    const url = input.url ?? null;

    const conn = await db.getConnection();
    let position: number;
    try {
      await conn.beginTransaction();
      const [maxRows] = await conn.query(
        "SELECT COALESCE(MAX(position), 0) AS maxPos FROM Block WHERE pageId = ? FOR UPDATE",
        [pageId]
      );
      position = Number((maxRows as Record<string, unknown>[])[0]?.maxPos ?? 0) + 1;
      await conn.query(
        "INSERT INTO Block (id, pageId, type, title, url, position, isEnabled, config, clickCount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 1, ?, 0, ?, ?)",
        [id, pageId, input.type, title, url, position, JSON.stringify(config), now, now]
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    return { id, pageId, type: input.type, title, url, position, isEnabled: true, config, clickCount: 0, createdAt: now, updatedAt: now };
  }

  async update(id: string, data: { title?: string | null; url?: string | null; isEnabled?: boolean; config?: Record<string, unknown> }): Promise<Block> {
    const updates: string[] = [];
    const vals: unknown[] = [];
    if (data.title !== undefined) { updates.push("title = ?"); vals.push(data.title); }
    if (data.url !== undefined) { updates.push("url = ?"); vals.push(data.url); }
    if (data.isEnabled !== undefined) { updates.push("isEnabled = ?"); vals.push(data.isEnabled ? 1 : 0); }
    if (data.config !== undefined) { updates.push("config = ?"); vals.push(JSON.stringify(data.config)); }
    const now = new Date();
    updates.push("updatedAt = ?"); vals.push(now);
    vals.push(id);
    await db.query(`UPDATE Block SET ${updates.join(", ")} WHERE id = ?`, vals);

    const [rows] = await db.query("SELECT * FROM Block WHERE id = ? LIMIT 1", [id]);
    return parseBlock((rows as Record<string, unknown>[])[0]);
  }

  async reorder(items: Array<{ id: string; position: number }>): Promise<void> {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      for (const item of items) {
        await conn.query("UPDATE Block SET position = ?, updatedAt = ? WHERE id = ?", [item.position, new Date(), item.id]);
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async delete(id: string): Promise<void> {
    await db.query("DELETE FROM Block WHERE id = ?", [id]);
  }

  async incrementClick(id: string): Promise<void> {
    await db.query("UPDATE Block SET clickCount = clickCount + 1 WHERE id = ?", [id]);
  }
}
