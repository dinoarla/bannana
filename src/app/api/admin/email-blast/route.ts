import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";
import { sendBlastEmail } from "@/lib/utils/mailer";

export async function POST(req: Request) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

    const { subject, body, segment } = await req.json() as {
      subject: string;
      body: string;
      segment: "all" | "free" | "pro";
    };

    if (!subject?.trim() || !body?.trim()) throw errors.validation("Subject dan isi pesan wajib diisi.");
    if (!["all", "free", "pro"].includes(segment)) throw errors.validation("Segmen tidak valid.");

    let emailQuery: string;
    if (segment === "pro") {
      emailQuery = `
        SELECT DISTINCT u.email FROM User u
        INNER JOIN Subscription sub ON sub.userId = u.id AND sub.status = 'active' AND sub.plan = 'pro'
        WHERE u.deletedAt IS NULL
      `;
    } else if (segment === "free") {
      emailQuery = `
        SELECT DISTINCT u.email FROM User u
        LEFT JOIN Subscription sub ON sub.userId = u.id AND sub.status = 'active' AND sub.plan = 'pro'
        WHERE u.deletedAt IS NULL AND sub.id IS NULL
      `;
    } else {
      emailQuery = `SELECT email FROM User WHERE deletedAt IS NULL`;
    }

    const [rows] = await db.query(emailQuery);
    const emails = (rows as { email: string }[]).map((r) => r.email);

    if (emails.length === 0) {
      return ok({ sent: 0, failed: 0, total: 0 });
    }

    let sent = 0;
    let failed = 0;
    for (const email of emails) {
      try {
        const ok2 = await sendBlastEmail(email, { subject: subject.trim(), body: body.trim() });
        if (ok2) sent++; else failed++;
      } catch {
        failed++;
      }
    }

    return ok({ sent, failed, total: emails.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(_req: Request) {
  try {
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

    const [[allRows], [proRows], [freeRows]] = await Promise.all([
      db.query(`SELECT COUNT(*) as cnt FROM User WHERE deletedAt IS NULL`),
      db.query(`SELECT COUNT(DISTINCT u.id) as cnt FROM User u INNER JOIN Subscription sub ON sub.userId = u.id AND sub.status = 'active' AND sub.plan = 'pro' WHERE u.deletedAt IS NULL`),
      db.query(`SELECT COUNT(DISTINCT u.id) as cnt FROM User u LEFT JOIN Subscription sub ON sub.userId = u.id AND sub.status = 'active' AND sub.plan = 'pro' WHERE u.deletedAt IS NULL AND sub.id IS NULL`),
    ]);

    return ok({
      all: Number((allRows as { cnt: number }[])[0]?.cnt ?? 0),
      pro: Number((proRows as { cnt: number }[])[0]?.cnt ?? 0),
      free: Number((freeRows as { cnt: number }[])[0]?.cnt ?? 0),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
