import { db } from "@/lib/db/client";
import { randomToken, sha256 } from "./hash";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://bannana.id";

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS EmailVerificationToken (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      tokenHash VARCHAR(64) NOT NULL UNIQUE,
      expiresAt DATETIME NOT NULL,
      usedAt DATETIME,
      createdAt DATETIME NOT NULL
    )
  `);
}

export async function queueVerificationEmail(
  userId: string,
  email: string,
  send: (to: string, url: string) => Promise<boolean>
): Promise<void> {
  await ensureTable();
  const rawToken = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  await db.query(
    "INSERT INTO EmailVerificationToken (id, userId, tokenHash, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?)",
    [crypto.randomUUID(), userId, sha256(rawToken), expiresAt, now]
  );
  const url = `${BASE_URL}/verify-email?token=${rawToken}`;
  await send(email, url);
}
