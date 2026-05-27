export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function AdminOverviewPage() {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  // ─── Stats ───
  const totalUsers = await safeQuery(async () => {
    const [rows] = await db.query("SELECT COUNT(*) as c FROM User WHERE role = 'USER'");
    return Number((rows as Record<string, unknown>[])[0]?.c ?? 0);
  }, 0);

  const newToday = await safeQuery(async () => {
    const [rows] = await db.query(
      "SELECT COUNT(*) as c FROM User WHERE role = 'USER' AND DATE(createdAt + INTERVAL 7 HOUR) = DATE(NOW() + INTERVAL 7 HOUR)"
    );
    return Number((rows as Record<string, unknown>[])[0]?.c ?? 0);
  }, 0);

  const activeSessions = await safeQuery(async () => {
    const [rows] = await db.query("SELECT COUNT(*) as c FROM Session WHERE expiresAt > NOW()");
    return Number((rows as Record<string, unknown>[])[0]?.c ?? 0);
  }, 0);

  const { publishedPages, totalPages } = await safeQuery(async () => {
    const [rows] = await db.query("SELECT COUNT(*) as totalPages, SUM(isPublished) as publishedPages FROM Page");
    const row = (rows as Record<string, unknown>[])[0] ?? {};
    return { totalPages: Number(row.totalPages ?? 0), publishedPages: Number(row.publishedPages ?? 0) };
  }, { publishedPages: 0, totalPages: 0 });

  const { proUsers, estRevenue } = await safeQuery(async () => {
    const [rows] = await db.query(
      "SELECT COUNT(*) as proUsers, SUM(CASE WHEN billingCycle='yearly' THEN 150000 ELSE 15000 END) as estRevenue FROM Subscription WHERE plan = 'pro' AND status = 'active'"
    );
    const row = (rows as Record<string, unknown>[])[0] ?? {};
    return { proUsers: Number(row.proUsers ?? 0), estRevenue: Number(row.estRevenue ?? 0) };
  }, { proUsers: 0, estRevenue: 0 });

  // ─── Recent Registrations (last 10 users) ───
  const recentUsers = await safeQuery(async () => {
    const [rows] = await db.query(`
      SELECT u.id, u.email, u.username, u.role, u.createdAt,
             COALESCE(p.displayName, u.username) as displayName,
             p.avatarUrl
      FROM User u
      LEFT JOIN Profile p ON p.userId = u.id
      ORDER BY u.createdAt DESC
      LIMIT 10
    `);
    return rows as Record<string, unknown>[];
  }, []);

  const statCards = [
    { label: "Total Pengguna", value: totalUsers.toLocaleString("id-ID"), icon: "fa-users", color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Baru Hari Ini", value: newToday.toLocaleString("id-ID"), icon: "fa-user-plus", color: "#10B981", bg: "#ECFDF5" },
    { label: "Sesi Aktif", value: activeSessions.toLocaleString("id-ID"), icon: "fa-mobile-screen", color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Halaman Published", value: `${publishedPages} / ${totalPages}`, icon: "fa-table-columns", color: "#8B5CF6", bg: "#F5F3FF" },
    { label: "Pengguna Pro", value: proUsers.toLocaleString("id-ID"), icon: "fa-crown", color: "#D97706", bg: "#FEF3C7" },
    { label: "Est. Revenue", value: formatRupiah(estRevenue), icon: "fa-money-bill-wave", color: "#059669", bg: "#D1FAE5" },
  ];

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-chart-pie" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            Ringkasan Admin
          </span>
        </div>
      </div>

      <div className="page-content">
        {/* Stat grid */}
        <div className="three-col" style={{ marginBottom: "2rem" }}>
          {statCards.map((s) => (
            <div key={s.label} style={{
              background: "#fff", border: "2px solid var(--b-100)", borderRadius: "var(--r-xl)",
              padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem",
              borderLeft: `4px solid ${s.color}`
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: s.color, fontSize: "1.1rem", flexShrink: 0
              }}>
                <i className={`fa-solid ${s.icon}`} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)", lineHeight: 1.2 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: ".8rem", color: "var(--n-500)", marginTop: ".15rem" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Registrations */}
        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "2rem" }}>
          <div style={{
            padding: "1rem 1.5rem", borderBottom: "1px solid var(--n-200)",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)", fontSize: "1rem" }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: ".5rem", color: "var(--b-500)" }} />
              Registrasi Terbaru
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--n-50)", borderBottom: "1px solid var(--n-200)" }}>
                  {["Pengguna", "Email", "Role", "Bergabung"].map((h) => (
                    <th key={h} style={{
                      padding: ".75rem 1rem", textAlign: "left", fontSize: ".75rem",
                      fontWeight: 700, color: "var(--n-500)", textTransform: "uppercase", letterSpacing: ".06em"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--n-400)" }}>
                      <i className="fa-solid fa-inbox" style={{ display: "block", fontSize: "1.5rem", marginBottom: ".5rem" }} />
                      Belum ada pengguna
                    </td>
                  </tr>
                ) : recentUsers.map((u) => (
                  <tr key={u.id as string} style={{ borderBottom: "1px solid var(--n-100)" }}>
                    <td style={{ padding: ".875rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%", background: "var(--b-100)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          overflow: "hidden", flexShrink: 0
                        }}>
                          {u.avatarUrl
                            ? <img src={u.avatarUrl as string} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <i className="fa-solid fa-user" style={{ color: "var(--b-500)", fontSize: ".8rem" }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--b-900)", fontSize: ".875rem" }}>{u.displayName as string}</div>
                          <div style={{ fontSize: ".75rem", color: "var(--n-400)" }}>@{u.username as string}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)" }}>
                      {u.email as string}
                    </td>
                    <td style={{ padding: ".875rem 1rem" }}>
                      <span style={{
                        borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700,
                        background: u.role === "ADMIN" ? "rgba(124,58,237,.12)" : "var(--n-100)",
                        color: u.role === "ADMIN" ? "#7C3AED" : "var(--n-600)"
                      }}>
                        {u.role as string}
                      </span>
                    </td>
                    <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-400)" }}>
                      {new Date(u.createdAt as string).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Sessions summary */}
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: "#FFFBEB",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", fontSize: "1.2rem"
            }}>
              <i className="fa-solid fa-mobile-screen" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)", fontSize: "1rem" }}>
                Sesi Aktif
              </div>
              <div style={{ fontSize: ".875rem", color: "var(--n-500)" }}>
                {activeSessions} sesi sedang aktif sekarang
              </div>
            </div>
          </div>
          <Link href="/admin/sessions" className="btn btn-ghost btn-sm">
            Lihat semua <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </>
  );
}
