import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { sha256, hashPassword } from "@/lib/utils/hash";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json() as { token: string; password: string };
    if (!token || !password || password.length < 8) {
      return NextResponse.json({ success: false, error: { message: "Data tidak valid." } }, { status: 400 });
    }

    const tokenHash = sha256(token);
    const [rows] = await db.query(
      "SELECT * FROM PasswordResetToken WHERE tokenHash = ? AND usedAt IS NULL AND expiresAt > NOW() LIMIT 1",
      [tokenHash]
    );
    const row = (rows as Record<string, unknown>[])[0];
    if (!row) {
      return NextResponse.json({ success: false, error: { message: "Link reset tidak valid atau sudah kadaluarsa." } }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await db.query("UPDATE User SET passwordHash = ?, updatedAt = NOW() WHERE id = ?", [passwordHash, row.userId]);
    await db.query("UPDATE PasswordResetToken SET usedAt = NOW() WHERE id = ?", [row.id]);
    await db.query("DELETE FROM Session WHERE userId = ?", [row.userId]);

    return ok({ message: "Password berhasil direset. Silakan login." });
  } catch (error) {
    return handleApiError(error);
  }
}
