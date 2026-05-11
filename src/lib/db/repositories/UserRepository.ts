import { db } from "@/lib/db/client";
import type { User, Profile, UserWithProfile } from "@/types/db.types";

function parseProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.p_id as string,
    userId: row.id as string,
    displayName: row.displayName as string,
    bio: row.bio as string | null,
    avatarUrl: row.avatarUrl as string | null,
    avatarIcon: row.avatarIcon as string | null,
    website: row.website as string | null,
    tags: typeof row.tags === "string" ? JSON.parse(row.tags) : (row.tags ?? []),
    socialLinks: typeof row.socialLinks === "string" ? JSON.parse(row.socialLinks) : (row.socialLinks ?? []),
    createdAt: row.p_createdAt as Date,
    updatedAt: row.p_updatedAt as Date,
  };
}

function toUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    username: row.username as string,
    passwordHash: row.passwordHash as string,
    emailVerified: row.emailVerified as Date | null,
    role: row.role as "USER" | "ADMIN",
    deletedAt: row.deletedAt as Date | null,
    createdAt: row.createdAt as Date,
    updatedAt: row.updatedAt as Date,
  };
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.query("SELECT * FROM User WHERE email = ? LIMIT 1", [email]);
    const row = (rows as Record<string, unknown>[])[0];
    return row ? toUser(row) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await db.query("SELECT * FROM User WHERE username = ? LIMIT 1", [username]);
    const row = (rows as Record<string, unknown>[])[0];
    return row ? toUser(row) : null;
  }

  async findById(id: string): Promise<UserWithProfile | null> {
    const [rows] = await db.query(
      `SELECT u.*,
        p.id AS p_id, p.displayName, p.bio, p.avatarUrl, p.avatarIcon,
        p.website, p.tags, p.socialLinks,
        p.createdAt AS p_createdAt, p.updatedAt AS p_updatedAt
       FROM User u
       LEFT JOIN Profile p ON p.userId = u.id
       WHERE u.id = ? LIMIT 1`,
      [id]
    );
    const row = (rows as Record<string, unknown>[])[0];
    if (!row) return null;
    return { ...toUser(row), profile: row.p_id ? parseProfile(row) : null };
  }

  async create(input: { email: string; username: string; passwordHash: string; displayName?: string }): Promise<UserWithProfile> {
    const id = crypto.randomUUID();
    const profileId = crypto.randomUUID();
    const pageId = crypto.randomUUID();
    const blockId = crypto.randomUUID();
    const now = new Date();
    const displayName = input.displayName ?? input.username;

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        "INSERT INTO User (id, email, username, passwordHash, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'USER', ?, ?)",
        [id, input.email, input.username, input.passwordHash, now, now]
      );
      await conn.query(
        "INSERT INTO Profile (id, userId, displayName, bio, avatarIcon, tags, socialLinks, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [profileId, id, displayName, "Satu link, semua tempat.", "User", JSON.stringify(["Creator"]), JSON.stringify([]), now, now]
      );
      await conn.query(
        "INSERT INTO Page (id, userId, title, slug, theme, isPublished, viewCount, uniqueVisitors, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'classic', 1, 0, 0, ?, ?)",
        [pageId, id, "Link Utama", input.username, now, now]
      );
      await conn.query(
        "INSERT INTO Block (id, pageId, type, title, position, isEnabled, config, clickCount, createdAt, updatedAt) VALUES (?, ?, 'HEADER', ?, 1, 1, ?, 0, ?, ?)",
        [blockId, pageId, "Halo! Selamat datang di bannana-ku", JSON.stringify({ subtitle: "Semua link favoritku ada di sini" }), now, now]
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    return {
      id, email: input.email, username: input.username, passwordHash: input.passwordHash,
      emailVerified: null, role: "USER", deletedAt: null, createdAt: now, updatedAt: now,
      profile: { id: profileId, userId: id, displayName, bio: "Satu link, semua tempat.", avatarUrl: null, avatarIcon: "User", website: null, tags: ["Creator"], socialLinks: [], createdAt: now, updatedAt: now },
    };
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const now = new Date();
    await db.query("UPDATE User SET passwordHash = ?, updatedAt = ? WHERE id = ?", [passwordHash, now, id]);
  }

  async updateAvatar(userId: string, avatarUrl: string | null): Promise<void> {
    const now = new Date();
    await db.query("UPDATE Profile SET avatarUrl = ?, updatedAt = ? WHERE userId = ?", [avatarUrl, now, userId]);
  }

  async updateUsernameAndProfile(id: string, data: { username?: string; displayName?: string; bio?: string; website?: string; socialLinks?: Array<{ label: string; url: string; icon: string; color?: string }> }): Promise<UserWithProfile | null> {
    const now = new Date();
    if (data.username) {
      await db.query("UPDATE User SET username = ?, updatedAt = ? WHERE id = ?", [data.username, now, id]);
    }
    if (data.displayName !== undefined || data.bio !== undefined || data.website !== undefined || data.socialLinks !== undefined) {
      const updates: string[] = [];
      const vals: unknown[] = [];
      if (data.displayName !== undefined) { updates.push("displayName = ?"); vals.push(data.displayName); }
      if (data.bio !== undefined) { updates.push("bio = ?"); vals.push(data.bio); }
      if (data.website !== undefined) { updates.push("website = ?"); vals.push(data.website || null); }
      if (data.socialLinks !== undefined) { updates.push("socialLinks = ?"); vals.push(JSON.stringify(data.socialLinks)); }
      updates.push("updatedAt = ?"); vals.push(now);
      vals.push(id);
      await db.query(`UPDATE Profile SET ${updates.join(", ")} WHERE userId = ?`, vals);
    }
    return this.findById(id);
  }
}
