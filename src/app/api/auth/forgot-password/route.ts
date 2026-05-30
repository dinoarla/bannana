import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { randomToken, sha256 } from "@/lib/utils/hash";
import { sendPasswordResetEmail } from "@/lib/utils/mailer";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { checkRateLimit, rateLimitedResponse } from "@/lib/utils/rateLimit";

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS PasswordResetToken (
      id VARCHAR(36) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      tokenHash VARCHAR(64) NOT NULL,
      expiresAt DATETIME NOT NULL,
      usedAt DATETIME NULL,
      createdAt DATETIME NOT NULL,
      PRIMARY KEY (id),
      INDEX idx_token (tokenHash)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(`forgot:${ip}`, 3, 300_000)) {
    return rateLimitedResponse("Terlalu banyak permintaan reset. Tunggu 5 menit.");
  }
  try {
    const { email } = await request.json() as { email: string };
    if (!email) return NextResponse.json({ success: false, error: { message: "Email wajib diisi." } }, { status: 400 });

    await ensureTable();

    const user = await new UserRepository().findByEmail(email.toLowerCase().trim());

    if (user) {
      const rawToken = randomToken(32);
      const tokenHash = sha256(rawToken);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      const now = new Date();

      await db.query(
        "INSERT INTO PasswordResetToken (id, userId, tokenHash, expiresAt, usedAt, createdAt) VALUES (?, ?, ?, ?, NULL, ?)",
        [crypto.randomUUID(), user.id, tokenHash, expiresAt, now]
      );

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "https://bannana.id";
      const resetUrl = `${baseUrl}/reset-password/${rawToken}`;
      const emailSent = await sendPasswordResetEmail(user.email, resetUrl);

      if (!emailSent) {
        // Only expose link in local dev (no SMTP configured)
        if (process.env.NODE_ENV !== "production") {
          return ok({ resetUrl });
        }
      }
    }

    return ok({ message: "Kalau email kamu terdaftar, link reset sudah dikirim." });
  } catch (error) {
    return handleApiError(error);
  }
}
