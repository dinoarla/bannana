import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

export async function GET() {
  try {
    const user = await assertSessionUser();
    const [rows] = await db.query(
      "SELECT * FROM Subscription WHERE userId = ? LIMIT 1",
      [user.id]
    );
    const row = (rows as Record<string, unknown>[])[0];
    if (!row) {
      return ok({ plan: "free", status: "active", billingCycle: null, currentPeriodEnd: null });
    }
    return ok({
      plan: row.plan as string,
      status: row.status as string,
      billingCycle: row.billingCycle as string,
      midtransPaymentType: row.midtransPaymentType as string | null,
      currentPeriodStart: row.currentPeriodStart as Date | null,
      currentPeriodEnd: row.currentPeriodEnd as Date | null,
      cancelledAt: row.cancelledAt as Date | null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
