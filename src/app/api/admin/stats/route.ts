import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

export const dynamic = "force-dynamic";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function GET() {
  try {
    const user = await assertSessionUser();
    if (user.role !== "ADMIN") throw errors.forbidden();

    const totalUsers = await safeQuery(async () => {
      const [rows] = await db.query("SELECT COUNT(*) as totalUsers FROM User WHERE role = 'USER'");
      return Number((rows as Record<string, unknown>[])[0]?.totalUsers ?? 0);
    }, 0);

    const newToday = await safeQuery(async () => {
      const [rows] = await db.query(
        "SELECT COUNT(*) as newToday FROM User WHERE role = 'USER' AND createdAt >= DATE(CONVERT_TZ(NOW(), '+00:00', '+07:00'))"
      );
      return Number((rows as Record<string, unknown>[])[0]?.newToday ?? 0);
    }, 0);

    const newThisWeek = await safeQuery(async () => {
      const [rows] = await db.query(
        "SELECT COUNT(*) as newThisWeek FROM User WHERE role = 'USER' AND createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
      );
      return Number((rows as Record<string, unknown>[])[0]?.newThisWeek ?? 0);
    }, 0);

    const activeSessions = await safeQuery(async () => {
      const [rows] = await db.query("SELECT COUNT(*) as activeSessions FROM Session WHERE expiresAt > NOW()");
      return Number((rows as Record<string, unknown>[])[0]?.activeSessions ?? 0);
    }, 0);

    const { totalPages, publishedPages } = await safeQuery(async () => {
      const [rows] = await db.query("SELECT COUNT(*) as totalPages, SUM(isPublished) as publishedPages FROM Page");
      const row = (rows as Record<string, unknown>[])[0] ?? {};
      return {
        totalPages: Number(row.totalPages ?? 0),
        publishedPages: Number(row.publishedPages ?? 0),
      };
    }, { totalPages: 0, publishedPages: 0 });

    const { proUsers, estRevenue } = await safeQuery(async () => {
      const [rows] = await db.query(
        "SELECT COUNT(*) as proUsers, SUM(CASE WHEN billingCycle='yearly' THEN 150000 ELSE 15000 END) as estRevenue FROM Subscription WHERE plan = 'pro' AND status = 'active'"
      );
      const row = (rows as Record<string, unknown>[])[0] ?? {};
      return {
        proUsers: Number(row.proUsers ?? 0),
        estRevenue: Number(row.estRevenue ?? 0),
      };
    }, { proUsers: 0, estRevenue: 0 });

    const totalEvents = await safeQuery(async () => {
      const [rows] = await db.query("SELECT COUNT(*) as totalEvents FROM Analytics");
      return Number((rows as Record<string, unknown>[])[0]?.totalEvents ?? 0);
    }, 0);

    return ok({
      totalUsers,
      newToday,
      newThisWeek,
      activeSessions,
      totalPages,
      publishedPages,
      proUsers,
      estRevenue,
      totalEvents,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
