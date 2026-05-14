import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS Notification (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'system',
      title VARCHAR(255) NOT NULL,
      body TEXT,
      href VARCHAR(500),
      readAt DATETIME,
      createdAt DATETIME NOT NULL,
      INDEX idx_notif_user (userId),
      INDEX idx_notif_created (createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

export async function GET() {
  try {
    const user = await assertSessionUser();
    await ensureTable();

    // Get user's notification prefs
    let prefs = { emailWeekly: true, alertHighClick: true, productUpdates: false, tipsTutorial: true };
    try {
      const [rows] = await db.query(
        "SELECT emailWeekly, alertHighClick, productUpdates, tipsTutorial FROM UserNotifPrefs WHERE userId = ? LIMIT 1",
        [user.id]
      );
      const row = (rows as Record<string, unknown>[])[0];
      if (row) prefs = {
        emailWeekly: Boolean(row.emailWeekly),
        alertHighClick: Boolean(row.alertHighClick),
        productUpdates: Boolean(row.productUpdates),
        tipsTutorial: Boolean(row.tipsTutorial),
      };
    } catch { /* table may not exist */ }

    // Build allowed types based on prefs
    const allowedTypes = ["welcome", "system"];
    if (prefs.alertHighClick) allowedTypes.push("click_spike");
    if (prefs.tipsTutorial) allowedTypes.push("tip");
    if (prefs.productUpdates) allowedTypes.push("product_update");
    if (prefs.emailWeekly) allowedTypes.push("weekly_summary");

    // Check if user has any notifications
    const [existingRows] = await db.query(
      "SELECT COUNT(*) as cnt FROM Notification WHERE userId = ?",
      [user.id]
    );
    const count = (existingRows as Record<string, unknown>[])[0]?.cnt as number ?? 0;

    if (count === 0) {
      // Seed initial notifications
      const now = new Date();
      const seeds = [
        { type: "welcome", title: "Selamat datang di bannana.id! 🍌", body: "Akun kamu sudah aktif. Mulai buat halaman pertamamu sekarang!", href: "/pages/new" },
      ];
      if (prefs.tipsTutorial) {
        seeds.push({ type: "tip", title: "Tips: Tambahkan link terpenting di atas", body: "Link yang paling sering diklik sebaiknya diletakkan paling atas di halamanmu.", href: "/pages" });
      }
      if (prefs.productUpdates) {
        seeds.push({ type: "product_update", title: "Fitur baru: Drag & drop blok!", body: "Kamu sekarang bisa mengubah urutan blok konten dengan drag & drop.", href: "/pages" });
      }
      for (const seed of seeds) {
        await db.query(
          "INSERT INTO Notification (id, userId, type, title, body, href, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            crypto.randomUUID(),
            user.id,
            seed.type,
            seed.title,
            seed.body,
            seed.href ?? null,
            new Date(now.getTime() - seeds.indexOf(seed) * 60000),
          ]
        );
      }
    }

    // Fetch latest notifications filtered by allowed types
    const placeholders = allowedTypes.map(() => "?").join(",");
    const [notifRows] = await db.query(
      `SELECT id, type, title, body, href, readAt, createdAt FROM Notification WHERE userId = ? AND type IN (${placeholders}) ORDER BY createdAt DESC LIMIT 10`,
      [user.id, ...allowedTypes]
    );
    const notifications = notifRows as Record<string, unknown>[];
    const unreadCount = notifications.filter((n) => !n.readAt).length;

    return ok({ notifications, unreadCount });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH() {
  try {
    const user = await assertSessionUser();
    await ensureTable();
    await db.query(
      "UPDATE Notification SET readAt = NOW() WHERE userId = ? AND readAt IS NULL",
      [user.id]
    );
    return ok({ marked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
