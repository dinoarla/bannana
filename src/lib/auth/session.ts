import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { errors } from "@/lib/errors/AppError";
import { randomToken, sha256 } from "@/lib/utils/hash";
import type { UserWithProfile, Profile } from "@/types/db.types";

export const SESSION_COOKIE = "bid_session";
export const CSRF_COOKIE = "bid_csrf";

function parseUserWithProfile(row: Record<string, unknown>): UserWithProfile {
  const profile: Profile | null = row.p_id
    ? {
        id: row.p_id as string, userId: row.id as string, displayName: row.displayName as string,
        bio: row.bio as string | null, avatarUrl: row.avatarUrl as string | null, avatarIcon: row.avatarIcon as string | null,
        website: row.website as string | null,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags as string) : (row.tags ?? []),
        socialLinks: typeof row.socialLinks === "string" ? JSON.parse(row.socialLinks as string) : (row.socialLinks ?? []),
        createdAt: row.p_createdAt as Date, updatedAt: row.p_updatedAt as Date,
      }
    : null;
  return {
    id: row.id as string, email: row.email as string, username: row.username as string,
    passwordHash: row.passwordHash as string, emailVerified: row.emailVerified as Date | null,
    role: row.role as "USER" | "ADMIN", deletedAt: row.deletedAt as Date | null,
    createdAt: row.createdAt as Date, updatedAt: row.updatedAt as Date,
    profile,
  };
}

export async function createSession(userId: string) {
  const rawToken = randomToken();
  const csrfToken = randomToken(24);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
  const id = crypto.randomUUID();
  const now = new Date();

  await db.query(
    "INSERT INTO Session (id, userId, tokenHash, csrfToken, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    [id, userId, sha256(rawToken), csrfToken, expiresAt, now]
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE, rawToken, { httpOnly: true, sameSite: "lax", path: "/", expires: expiresAt, secure: process.env.NODE_ENV === "production" });
  jar.set(CSRF_COOKIE, csrfToken, { httpOnly: false, sameSite: "lax", path: "/", expires: expiresAt, secure: process.env.NODE_ENV === "production" });
  return csrfToken;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.query("DELETE FROM Session WHERE tokenHash = ?", [sha256(token)]);
  }
  jar.delete(SESSION_COOKIE);
  jar.delete(CSRF_COOKIE);
}

export async function getSessionUser(): Promise<UserWithProfile | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [rows] = await db.query(
    `SELECT s.expiresAt,
      u.*, p.id AS p_id, p.displayName, p.bio, p.avatarUrl, p.avatarIcon,
      p.website, p.tags, p.socialLinks, p.createdAt AS p_createdAt, p.updatedAt AS p_updatedAt
     FROM Session s
     JOIN User u ON u.id = s.userId
     LEFT JOIN Profile p ON p.userId = u.id
     WHERE s.tokenHash = ? LIMIT 1`,
    [sha256(token)]
  );
  const row = (rows as Record<string, unknown>[])[0];
  if (!row) return null;
  if ((row.expiresAt as Date) < new Date()) return null;
  return parseUserWithProfile(row);
}

export async function assertSessionUser(): Promise<UserWithProfile> {
  const user = await getSessionUser();
  if (!user) throw errors.unauthorized("Silakan login dulu.");
  return user;
}
