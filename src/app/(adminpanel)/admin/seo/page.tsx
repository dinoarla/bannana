export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

type PageRow = {
  id: string;
  slug: string;
  title: string | null;
  isPublished: number;
  viewCount: number;
  uniqueVisitors: number;
  theme: string;
  updatedAt: string;
  createdAt: string;
  username: string;
  displayName: string;
  blockCount: number;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminSeoPage() {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  let pages: PageRow[] = [];
  try {
    const [rows] = await db.query(`
      SELECT pg.id, pg.slug, pg.title, pg.isPublished, pg.viewCount, pg.uniqueVisitors,
             pg.theme, pg.updatedAt, pg.createdAt,
             u.username,
             COALESCE(p.displayName, u.username) as displayName,
             COUNT(b.id) as blockCount
      FROM Page pg
      JOIN User u ON u.id = pg.userId
      LEFT JOIN Profile p ON p.userId = pg.userId
      LEFT JOIN Block b ON b.pageId = pg.id
      GROUP BY pg.id, u.username, p.displayName
      ORDER BY pg.viewCount DESC
      LIMIT 200
    `);
    pages = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      slug: r.slug as string,
      title: r.title as string | null,
      isPublished: Number(r.isPublished),
      viewCount: Number(r.viewCount ?? 0),
      uniqueVisitors: Number(r.uniqueVisitors ?? 0),
      theme: r.theme as string,
      updatedAt: (r.updatedAt as Date).toISOString(),
      createdAt: (r.createdAt as Date).toISOString(),
      username: r.username as string,
      displayName: r.displayName as string,
      blockCount: Number(r.blockCount ?? 0),
    }));
  } catch {
    pages = [];
  }

  const totalPages = pages.length;
  const publishedCount = pages.filter((p) => p.isPublished).length;
  const publishedPct = totalPages > 0 ? Math.round((publishedCount / totalPages) * 100) : 0;
  const avgViews = totalPages > 0 ? Math.round(pages.reduce((s, p) => s + p.viewCount, 0) / totalPages) : 0;
  const noTitle = pages.filter((p) => !p.title || p.title.trim() === "").length;

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-magnifying-glass-chart" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            SEO &amp; Halaman
          </span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)" }}>
            SEO &amp; Halaman
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Pantau status halaman publik dan indikator SEO
          </div>
        </div>

        {/* SEO Health stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Halaman", value: String(totalPages), icon: "fa-table-columns", color: "#3B82F6", bg: "#EFF6FF" },
            { label: "Published", value: `${publishedPct}%`, icon: "fa-circle-check", color: "#10B981", bg: "#ECFDF5" },
            { label: "Rata-rata Views", value: String(avgViews), icon: "fa-eye", color: "#F59E0B", bg: "#FFFBEB" },
            { label: "Tanpa Judul", value: String(noTitle), icon: "fa-triangle-exclamation", color: noTitle > 0 ? "#DC2626" : "#10B981", bg: noTitle > 0 ? "#FEE2E2" : "#ECFDF5" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#fff", border: "2px solid var(--b-100)", borderRadius: "var(--r-xl)",
              padding: "1.25rem", borderLeft: `4px solid ${s.color}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color, flexShrink: 0
                }}>
                  <i className={`fa-solid ${s.icon}`} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", fontWeight: 700, color: "var(--b-900)", lineHeight: 1.2 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: ".78rem", color: "var(--n-500)" }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pages SEO table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--n-200)" }}>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)" }}>
              <i className="fa-solid fa-table-columns" style={{ marginRight: ".5rem", color: "var(--b-500)" }} />
              Semua Halaman ({totalPages})
            </span>
          </div>
          {pages.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--n-400)" }}>
              <i className="fa-solid fa-inbox" style={{ display: "block", fontSize: "2rem", marginBottom: ".75rem" }} />
              Belum ada halaman
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--n-50)", borderBottom: "1px solid var(--n-200)" }}>
                    {["Status", "Judul / URL", "Views", "Pengunjung Unik", "Blok", "Tema", "Diperbarui"].map((h) => (
                      <th key={h} style={{
                        padding: ".75rem 1rem", textAlign: "left", fontSize: ".75rem",
                        fontWeight: 700, color: "var(--n-500)", textTransform: "uppercase", letterSpacing: ".06em",
                        whiteSpace: "nowrap"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages.map((pg) => {
                    const isHighTraffic = pg.viewCount >= 100;
                    const isZeroViews = pg.viewCount === 0 && pg.isPublished;
                    const rowBg = isHighTraffic ? "rgba(16,185,129,.04)" : isZeroViews ? "rgba(239,68,68,.03)" : "";

                    return (
                      <tr key={pg.id} style={{ borderBottom: "1px solid var(--n-100)", background: rowBg, transition: "background .15s" }}
                        onMouseEnter={(e) => {
                          if (!isHighTraffic && !isZeroViews) (e.currentTarget as HTMLTableRowElement).style.background = "var(--n-50)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = rowBg;
                        }}>

                        {/* Status */}
                        <td style={{ padding: ".875rem 1rem" }}>
                          {pg.isPublished
                            ? <span style={{ borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700, background: "var(--success-100)", color: "var(--success-700)" }}>Live</span>
                            : <span style={{ borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700, background: "var(--n-200)", color: "var(--n-500)" }}>Draft</span>}
                        </td>

                        {/* Title / URL */}
                        <td style={{ padding: ".875rem 1rem", minWidth: 220 }}>
                          <div style={{ fontWeight: 600, color: "var(--b-900)", fontSize: ".875rem" }}>
                            {pg.title || <span style={{ color: "var(--n-400)", fontStyle: "italic" }}>Tanpa judul</span>}
                          </div>
                          <div style={{ fontSize: ".72rem", color: "var(--n-400)", fontFamily: "var(--fm)", marginTop: ".15rem" }}>
                            bannana.id/{pg.username}
                          </div>
                        </td>

                        {/* Views */}
                        <td style={{ padding: ".875rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                            <span style={{ fontWeight: 700, color: isHighTraffic ? "#059669" : isZeroViews ? "#DC2626" : "var(--b-900)", fontSize: ".9rem" }}>
                              {pg.viewCount.toLocaleString("id-ID")}
                            </span>
                            {isHighTraffic && <i className="fa-solid fa-arrow-trend-up" style={{ color: "#10B981", fontSize: ".75rem" }} />}
                          </div>
                        </td>

                        {/* Unique Visitors */}
                        <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)" }}>
                          {pg.uniqueVisitors.toLocaleString("id-ID")}
                        </td>

                        {/* Block count */}
                        <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)", textAlign: "center" }}>
                          {pg.blockCount}
                        </td>

                        {/* Theme */}
                        <td style={{ padding: ".875rem 1rem" }}>
                          <span style={{
                            borderRadius: 9999, padding: "3px 10px", fontSize: ".72rem", fontWeight: 700,
                            background: "var(--b-50)", color: "var(--b-700)", fontFamily: "var(--fm)"
                          }}>
                            {pg.theme}
                          </span>
                        </td>

                        {/* Updated */}
                        <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-400)", whiteSpace: "nowrap" }}>
                          {formatDate(pg.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
