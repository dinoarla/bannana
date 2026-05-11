import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";
import { z } from "zod";

const prefsSchema = z.object({
  emailWeekly: z.boolean(),
  alertHighClick: z.boolean(),
  productUpdates: z.boolean(),
  tipsTutorial: z.boolean(),
});

export async function GET() {
  try {
    const user = await assertSessionUser();
    let row: Record<string, unknown> | undefined;
    try {
      const [rows] = await db.query(
        "SELECT emailWeekly, alertHighClick, productUpdates, tipsTutorial FROM UserNotifPrefs WHERE userId = ? LIMIT 1",
        [user.id]
      );
      row = (rows as Record<string, unknown>[])[0];
    } catch { /* table may not exist yet */ }
    if (!row) {
      return ok({ emailWeekly: true, alertHighClick: true, productUpdates: false, tipsTutorial: true });
    }
    return ok({
      emailWeekly: Boolean(row.emailWeekly),
      alertHighClick: Boolean(row.alertHighClick),
      productUpdates: Boolean(row.productUpdates),
      tipsTutorial: Boolean(row.tipsTutorial),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const input = prefsSchema.parse(await request.json());
    const now = new Date();

    const [existing] = await db.query("SELECT id FROM UserNotifPrefs WHERE userId = ? LIMIT 1", [user.id]);
    if ((existing as unknown[]).length === 0) {
      const id = crypto.randomUUID();
      await db.query(
        "INSERT INTO UserNotifPrefs (id, userId, emailWeekly, alertHighClick, productUpdates, tipsTutorial, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, user.id, input.emailWeekly ? 1 : 0, input.alertHighClick ? 1 : 0, input.productUpdates ? 1 : 0, input.tipsTutorial ? 1 : 0, now, now]
      );
    } else {
      await db.query(
        "UPDATE UserNotifPrefs SET emailWeekly=?, alertHighClick=?, productUpdates=?, tipsTutorial=?, updatedAt=? WHERE userId=?",
        [input.emailWeekly ? 1 : 0, input.alertHighClick ? 1 : 0, input.productUpdates ? 1 : 0, input.tipsTutorial ? 1 : 0, now, user.id]
      );
    }
    return ok(input);
  } catch (error) {
    return handleApiError(error);
  }
}
