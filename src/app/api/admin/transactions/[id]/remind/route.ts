import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";
import { sendPaymentReminderEmail } from "@/lib/utils/mailer";

type Params = Promise<{ id: string }>;

export async function POST(_req: Request, { params }: { params: Params }) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();
    const { id } = await params;

    const [rows] = await db.query(
      `SELECT s.id, s.status, s.billingCycle, s.lastReminderAt,
              u.email, COALESCE(p.displayName, u.username) AS displayName
       FROM Subscription s
       JOIN User u ON u.id = s.userId
       LEFT JOIN Profile p ON p.userId = s.userId
       WHERE s.id = ? LIMIT 1`,
      [id]
    );
    const sub = (rows as Record<string, unknown>[])[0];
    if (!sub) throw errors.notFound("Subscription tidak ditemukan.");
    if (sub.status !== "pending") throw errors.validation("Reminder hanya untuk status pending.");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bannana.id";
    const sent = await sendPaymentReminderEmail(sub.email as string, {
      displayName: sub.displayName as string,
      billingCycle: sub.billingCycle as string,
      checkoutUrl: `${baseUrl}/dashboard/langganan`,
    });
    if (!sent) throw errors.validation("SMTP belum dikonfigurasi.");

    await db.query("UPDATE Subscription SET lastReminderAt = NOW(), updatedAt = NOW() WHERE id = ?", [id]);

    return ok({ sent: true });
  } catch (error) {
    return handleApiError(error);
  }
}
