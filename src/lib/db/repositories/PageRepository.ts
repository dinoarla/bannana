import { db } from "@/lib/db/client";
import type { Block, Page, PageWithBlocks, PageWithUserAndBlocks, Profile, UserWithProfile } from "@/types/db.types";

function parseBlock(row: Record<string, unknown>): Block {
  return {
    id: row.id as string,
    pageId: row.pageId as string,
    type: row.type as Block["type"],
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

function parsePage(row: Record<string, unknown>): Page {
  return {
    id: row.id as string,
    userId: row.userId as string,
    title: row.title as string,
    slug: row.slug as string,
    theme: row.theme as string,
    isPublished: Boolean(row.isPublished),
    customCss: row.customCss as string | null,
    viewCount: row.viewCount as number,
    uniqueVisitors: row.uniqueVisitors as number,
    createdAt: row.createdAt as Date,
    updatedAt: row.updatedAt as Date,
  };
}

export class PageRepository {
  async listByUser(userId: string): Promise<PageWithBlocks[]> {
    const [pageRows] = await db.query(
      "SELECT * FROM Page WHERE userId = ? ORDER BY updatedAt DESC",
      [userId]
    );
    const pages = (pageRows as Record<string, unknown>[]).map(parsePage);
    if (!pages.length) return [];

    const pageIds = pages.map((p) => p.id);
    const [blockRows] = await db.query(
      `SELECT * FROM Block WHERE pageId IN (${pageIds.map(() => "?").join(",")}) ORDER BY position ASC`,
      pageIds
    );
    const blocksByPage: Record<string, Block[]> = {};
    for (const row of blockRows as Record<string, unknown>[]) {
      const b = parseBlock(row);
      (blocksByPage[b.pageId] ??= []).push(b);
    }
    return pages.map((p) => ({ ...p, blocks: blocksByPage[p.id] ?? [] }));
  }

  async findById(id: string): Promise<PageWithUserAndBlocks | null> {
    const [pageRows] = await db.query("SELECT * FROM Page WHERE id = ? LIMIT 1", [id]);
    const pageRow = (pageRows as Record<string, unknown>[])[0];
    if (!pageRow) return null;
    const page = parsePage(pageRow);

    const [blockRows] = await db.query(
      "SELECT * FROM Block WHERE pageId = ? ORDER BY position ASC",
      [id]
    );
    const blocks = (blockRows as Record<string, unknown>[]).map(parseBlock);

    const [userRows] = await db.query(
      `SELECT u.*, p.id AS p_id, p.displayName, p.bio, p.avatarUrl, p.avatarIcon, p.tags, p.socialLinks, p.createdAt AS p_createdAt, p.updatedAt AS p_updatedAt
       FROM User u LEFT JOIN Profile p ON p.userId = u.id WHERE u.id = ? LIMIT 1`,
      [page.userId]
    );
    const ur = (userRows as Record<string, unknown>[])[0];
    if (!ur) return null;

    const profile: Profile | null = ur.p_id
      ? {
          id: ur.p_id as string, userId: ur.id as string, displayName: ur.displayName as string,
          bio: ur.bio as string | null, avatarUrl: ur.avatarUrl as string | null, avatarIcon: ur.avatarIcon as string | null,
          website: ur.website as string | null,
          tags: typeof ur.tags === "string" ? JSON.parse(ur.tags as string) : (ur.tags ?? []),
          socialLinks: typeof ur.socialLinks === "string" ? JSON.parse(ur.socialLinks as string) : (ur.socialLinks ?? []),
          createdAt: ur.p_createdAt as Date, updatedAt: ur.p_updatedAt as Date,
        }
      : null;

    const user: UserWithProfile = {
      id: ur.id as string, email: ur.email as string, username: ur.username as string,
      passwordHash: ur.passwordHash as string, emailVerified: ur.emailVerified as Date | null,
      googleId: (ur.googleId as string | null) ?? null,
      role: ur.role as "USER" | "ADMIN", deletedAt: ur.deletedAt as Date | null,
      createdAt: ur.createdAt as Date, updatedAt: ur.updatedAt as Date,
      profile,
    };

    return { ...page, blocks, user };
  }

  async findPublicByUsername(username: string): Promise<PageWithUserAndBlocks | null> {
    const [userRows] = await db.query(
      `SELECT u.*, p.id AS p_id, p.displayName, p.bio, p.avatarUrl, p.avatarIcon, p.website, p.tags, p.socialLinks, p.createdAt AS p_createdAt, p.updatedAt AS p_updatedAt
       FROM User u LEFT JOIN Profile p ON p.userId = u.id WHERE u.username = ? LIMIT 1`,
      [username]
    );
    const ur = (userRows as Record<string, unknown>[])[0];
    if (!ur) return null;

    const [pageRows] = await db.query(
      "SELECT * FROM Page WHERE userId = ? AND isPublished = 1 LIMIT 1",
      [ur.id]
    );
    const pageRow = (pageRows as Record<string, unknown>[])[0];
    if (!pageRow) return null;
    const page = parsePage(pageRow);

    const [blockRows] = await db.query(
      "SELECT * FROM Block WHERE pageId = ? AND isEnabled = 1 ORDER BY position ASC",
      [page.id]
    );
    const blocks = (blockRows as Record<string, unknown>[]).map(parseBlock);

    const profile: Profile | null = ur.p_id
      ? {
          id: ur.p_id as string, userId: ur.id as string, displayName: ur.displayName as string,
          bio: ur.bio as string | null, avatarUrl: ur.avatarUrl as string | null, avatarIcon: ur.avatarIcon as string | null,
          website: ur.website as string | null,
          tags: typeof ur.tags === "string" ? JSON.parse(ur.tags as string) : (ur.tags ?? []),
          socialLinks: typeof ur.socialLinks === "string" ? JSON.parse(ur.socialLinks as string) : (ur.socialLinks ?? []),
          createdAt: ur.p_createdAt as Date, updatedAt: ur.p_updatedAt as Date,
        }
      : null;

    const user: UserWithProfile = {
      id: ur.id as string, email: ur.email as string, username: ur.username as string,
      passwordHash: ur.passwordHash as string, emailVerified: ur.emailVerified as Date | null,
      googleId: (ur.googleId as string | null) ?? null,
      role: ur.role as "USER" | "ADMIN", deletedAt: ur.deletedAt as Date | null,
      createdAt: ur.createdAt as Date, updatedAt: ur.updatedAt as Date,
      profile,
    };

    return { ...page, blocks, user };
  }

  async findBySlug(slug: string): Promise<Page | null> {
    const [rows] = await db.query("SELECT * FROM Page WHERE slug = ? LIMIT 1", [slug]);
    const row = (rows as Record<string, unknown>[])[0];
    return row ? parsePage(row) : null;
  }

  async create(userId: string, input: { title: string; slug: string }): Promise<PageWithBlocks> {
    const id = crypto.randomUUID();
    const blockId = crypto.randomUUID();
    const now = new Date();

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        "INSERT INTO Page (id, userId, title, slug, theme, isPublished, viewCount, uniqueVisitors, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'classic', 0, 0, 0, ?, ?)",
        [id, userId, input.title, input.slug, now, now]
      );
      await conn.query(
        "INSERT INTO Block (id, pageId, type, title, position, isEnabled, config, clickCount, createdAt, updatedAt) VALUES (?, ?, 'HEADER', ?, 1, 1, ?, 0, ?, ?)",
        [blockId, id, "Heading Baru", JSON.stringify({ subtitle: "Tulis sapaan singkat di sini" }), now, now]
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    const block: Block = {
      id: blockId, pageId: id, type: "HEADER", title: "Heading Baru", url: null,
      position: 1, isEnabled: true, config: { subtitle: "Tulis sapaan singkat di sini" },
      clickCount: 0, createdAt: now, updatedAt: now,
    };
    return { id, userId, title: input.title, slug: input.slug, theme: "classic", isPublished: false, customCss: null, viewCount: 0, uniqueVisitors: 0, createdAt: now, updatedAt: now, blocks: [block] };
  }

  async update(id: string, data: { title?: string; slug?: string; theme?: string; customCss?: string; isPublished?: boolean }): Promise<PageWithBlocks | null> {
    const updates: string[] = [];
    const vals: unknown[] = [];
    if (data.title !== undefined) { updates.push("title = ?"); vals.push(data.title); }
    if (data.slug !== undefined) { updates.push("slug = ?"); vals.push(data.slug); }
    if (data.theme !== undefined) { updates.push("theme = ?"); vals.push(data.theme); }
    if (data.customCss !== undefined) { updates.push("customCss = ?"); vals.push(data.customCss); }
    if (data.isPublished !== undefined) { updates.push("isPublished = ?"); vals.push(data.isPublished ? 1 : 0); }
    const now = new Date();
    updates.push("updatedAt = ?"); vals.push(now);
    vals.push(id);
    await db.query(`UPDATE Page SET ${updates.join(", ")} WHERE id = ?`, vals);

    const [pageRows] = await db.query("SELECT * FROM Page WHERE id = ? LIMIT 1", [id]);
    const pageRow = (pageRows as Record<string, unknown>[])[0];
    if (!pageRow) return null;
    const [blockRows] = await db.query("SELECT * FROM Block WHERE pageId = ? ORDER BY position ASC", [id]);
    return { ...parsePage(pageRow), blocks: (blockRows as Record<string, unknown>[]).map(parseBlock) };
  }

  async delete(id: string): Promise<void> {
    await db.query("DELETE FROM Page WHERE id = ?", [id]);
  }

  async incrementView(id: string): Promise<void> {
    await db.query("UPDATE Page SET viewCount = viewCount + 1 WHERE id = ?", [id]);
  }

  async countByUser(userId: string): Promise<number> {
    const [rows] = await db.query("SELECT COUNT(*) AS cnt FROM Page WHERE userId = ?", [userId]);
    return Number((rows as Record<string, unknown>[])[0]?.cnt ?? 0);
  }
}
