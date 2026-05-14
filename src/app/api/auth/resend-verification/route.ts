import { assertSessionUser } from "@/lib/auth/session";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { queueVerificationEmail } from "@/lib/utils/emailVerification";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

export async function POST() {
  try {
    const user = await assertSessionUser();

    if (user.emailVerified) {
      throw errors.validation("Email kamu sudah terverifikasi.");
    }

    // Rate limit: one resend per minute
    const [recent] = await db.query(
      "SELECT id FROM EmailVerificationToken WHERE userId = ? AND createdAt > DATE_SUB(NOW(), INTERVAL 1 MINUTE) LIMIT 1",
      [user.id]
    ).catch(() => [[]]);
    if ((recent as unknown[]).length > 0) {
      throw errors.validation("Tunggu 1 menit sebelum kirim ulang.");
    }

    await queueVerificationEmail(user.id, user.email, sendVerificationEmail);
    return ok({ message: "Email verifikasi sudah dikirim ulang." });
  } catch (error) {
    return handleApiError(error);
  }
}
