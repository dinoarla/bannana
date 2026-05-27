import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";
import { sendRenewalReminderEmail } from "@/lib/utils/mailer";

type Params = Promise<{ userId: string }>;

export async function POST(_req: Request, { params }: { params: Params }) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();
    const { userId } = await params;

    const [rows] = await db.query(
      `SELECT s.id, s.status, s.billingCycle, s.currentPeriodEnd,
              u.email, COALESCE(p.displayName, u.username) AS displayName
       FROM Subscription s
       JOIN User u ON u.id = s.userId
       LEFT JOIN Profile p ON p.userId = s.userId
       WHERE s.userId = ? AND s.status = 'active' AND s.plan = 'pro'
       LIMIT 1`,
      [userId]
    );
    const sub = (rows as Record<string, unknown>[])[0];
    if (!sub) throw errors.notFound("Langganan Pro aktif tidak ditemukan.");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bannana.id";
    const periodEnd = sub.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd as string | Date).toISOString()
      : new Date().toISOString();

    const sent = await sendRenewalReminderEmail(sub.email as string, {
      displayName: sub.displayName as string,
      billingCycle: sub.billingCycle as string,
      periodEnd,
      renewUrl: `${baseUrl}/dashboard/langganan`,
    });
    if (!sent) throw errors.validation("SMTP belum dikonfigurasi.");

    return ok({ sent: true });
  } catch (error) {
    return handleApiError(error);
  }
}
