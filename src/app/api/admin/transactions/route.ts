import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await assertSessionUser();
    if (user.role !== "ADMIN") throw errors.forbidden();

    let rows: Record<string, unknown>[] = [];
    try {
      const [result] = await db.query(`
        SELECT s.id, s.plan, s.status, s.billingCycle, s.midtransPaymentType,
               s.currentPeriodStart, s.currentPeriodEnd, s.cancelledAt, s.createdAt,
               u.email, u.username,
               COALESCE(p.displayName, u.username) as displayName,
               p.avatarUrl
        FROM Subscription s
        JOIN User u ON u.id = s.userId
        LEFT JOIN Profile p ON p.userId = s.userId
        ORDER BY s.createdAt DESC
        LIMIT 100
      `);
      rows = result as Record<string, unknown>[];
    } catch {
      rows = [];
    }

    return ok(rows);
  } catch (error) {
    return handleApiError(error);
  }
}
