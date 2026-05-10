import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { sha256 } from "@/lib/utils/hash";
import { ok } from "@/lib/utils/response";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";

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

export async function GET(request: Request) {
  try {
    await ensureTable();
    const token = new URL(request.url).searchParams.get("token");
    if (!token) throw errors.validation("Token tidak valid.");

    const hash = sha256(token);
    const [rows] = await db.query(
      "SELECT * FROM EmailVerificationToken WHERE tokenHash = ? LIMIT 1",
      [hash]
    );
    const row = (rows as Record<string, unknown>[])[0];
    if (!row) throw errors.notFound("Token tidak valid atau sudah dipakai.");
    if (row.usedAt) throw errors.validation("Token sudah dipakai.");
    if ((row.expiresAt as Date) < new Date()) throw errors.validation("Token sudah kadaluarsa.");

    const now = new Date();
    await db.query("UPDATE EmailVerificationToken SET usedAt = ? WHERE tokenHash = ?", [now, hash]);
    await db.query("UPDATE User SET emailVerified = ?, updatedAt = ? WHERE id = ?", [now, now, row.userId]);

    return ok({ message: "Email berhasil diverifikasi." });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  return GET(request);
}

export { ensureTable as ensureVerificationTable };
