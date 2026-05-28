import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { handleApiError } from "@/lib/errors/errorHandler";
import { sendPaymentSuccessEmail, sendVerificationEmail, sendPasswordResetEmail } from "@/lib/utils/mailer";
import { z } from "zod";

const schema = z.object({
  to: z.string().email(),
  template: z.enum(["payment_success", "verification", "password_reset"]).default("payment_success"),
});

async function assertAdmin() {
  const user = await assertSessionUser();
  const [rows] = await db.query("SELECT role FROM User WHERE id = ? LIMIT 1", [user.id]);
  const r = (rows as Record<string, unknown>[])[0];
  if (r?.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function POST(request: Request) {
  try {
    await assertAdmin();
    const { to, template } = schema.parse(await request.json());

    let sent = false;

    if (template === "payment_success") {
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      sent = await sendPaymentSuccessEmail(to, {
        displayName: to.split("@")[0],
        billingCycle: "monthly",
        periodEnd: periodEnd.toISOString(),
      });
    } else if (template === "verification") {
      sent = await sendVerificationEmail(to, "https://bannana.id/verify?token=test-token-preview");
    } else if (template === "password_reset") {
      sent = await sendPasswordResetEmail(to, "https://bannana.id/reset-password?token=test-token-preview");
    }

    if (!sent) {
      return Response.json({ success: false, error: { message: "SMTP belum dikonfigurasi atau gagal kirim." } }, { status: 503 });
    }

    return Response.json({ success: true, data: { to, template } });
  } catch (error) {
    return handleApiError(error);
  }
}
