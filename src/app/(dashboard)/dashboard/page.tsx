import Link from "next/link";
import { assertSessionUser } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { AnalyticsService } from "@/lib/services/AnalyticsService";

export default async function DashboardPage() {
  const user = await assertSessionUser();
  const pages = await new PageService().list(user.id);
  const displayName = user.profile?.displayName ?? user.username;

  const report = pages[0]
    ? await new AnalyticsService().report(pages[0].id, "30d").catch(() => null)
    : null;

  const totalViews = report?.totalViews ?? 0;
  const totalClicks = report?.totalClicks ?? 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="tb-search">
          <i className="fa-solid fa-search" />
          <input type="text" placeholder="Cari halaman, blok, pengaturan..." readOnly />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <div className="tb-icon-btn">
            <i className="fa-solid fa-bell" />
            <div className="notif-dot" />
          </div>
          <Link href="/pages/new" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus" /> Halaman Baru
          </Link>
          <Link href={`/${user.username}`} className="tb-icon-btn" title="Lihat halaman publik">
            <i className="fa-solid fa-eye" />
          </Link>
          <div className="sb-avatar" style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-user" />
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* PAGE TITLE */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.8rem", fontWeight: 700, color: "var(--b-900)", letterSpacing: "-.01em" }}>
            Selamat datang, {displayName.split(" ")[0]}! 👋
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Ringkasan performa halaman bannana.id kamu — 30 hari terakhir
          </div>
        </div>

        {/* STATS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard
            icon="fa-eye" iconBg="var(--b-100)" iconColor="var(--b-600)"
            value={totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews)}
            label="Total Views" badgeUp badgeText="18%"
            fillWidth={74} fillGradient="linear-gradient(90deg,var(--b-400),var(--b-500))"
          />
          <StatCard
            icon="fa-arrow-pointer" iconBg="#D1FAE5" iconColor="#065F46"
            value={totalClicks > 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : String(totalClicks)}
            label="Total Klik" badgeUp badgeText="24%"
            fillWidth={60} fillGradient="linear-gradient(90deg,#4ADE80,#22C55E)"
          />
          <StatCard
            icon="fa-percent" iconBg="#DBEAFE" iconColor="#1E40AF"
            value={`${ctr}%`}
            label="Click Rate" badgeUp badgeText="3.2%"
            fillWidth={55} fillGradient="linear-gradient(90deg,#60A5FA,#3B82F6)"
          />
          <StatCard
            icon="fa-users" iconBg="#FCE7F3" iconColor="#9D174D"
            value={report?.uniqueVisitors ? String(report.uniqueVisitors) : "0"}
            label="Pengunjung Unik" badgeUp={false} badgeText="5%"
            fillWidth={42} fillGradient="linear-gradient(90deg,#F9A8D4,#EC4899)"
          />
        </div>

        {/* PAGES SECTION */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.15rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 7, margin: 0 }}>
            <i className="fa-solid fa-table-columns" style={{ color: "var(--b-500)", fontSize: ".95rem" }} /> Halaman Saya
          </h2>
          <Link href="/pages" style={{ fontSize: ".8rem", color: "var(--b-700)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            Lihat semua <i className="fa-solid fa-chevron-right" />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {pages.slice(0, 2).map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
          <Link href="/pages/new"
            style={{ background: "var(--b-50)", border: "2px dashed var(--b-200)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".75rem", padding: "2.25rem", textDecoration: "none", minHeight: 220, transition: "all 200ms var(--ease-spring)" }}
          >
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--b-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-500)", fontSize: "1.2rem" }}>
              <i className="fa-solid fa-plus" />
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-700)" }}>Buat Halaman Baru</div>
            <div style={{ fontSize: ".75rem", color: "var(--n-500)", textAlign: "center" }}>Link page, about me, portofolio — bebas!</div>
          </Link>
        </div>

        {/* BOTTOM 2-COL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
          <div>
            <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 7 }}>
                  <i className="fa-solid fa-chart-area" style={{ color: "var(--b-500)" }} /> Tren Kunjungan
                </div>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  {[["7h", false], ["30h", true], ["90h", false]].map(([label, act]) => (
                    <button key={label as string} style={{ height: 27, padding: "0 11px", borderRadius: "9999px", fontSize: ".72rem", fontWeight: 700, border: `1.5px solid ${act ? "var(--b-300)" : "var(--n-200)"}`, background: act ? "var(--b-100)" : "none", cursor: "pointer", color: act ? "var(--b-800)" : "var(--n-500)" }}>{label}</button>
                  ))}
                </div>
              </div>
              <div style={{ height: 86, display: "flex", alignItems: "flex-end", gap: 4, marginBottom: ".875rem" }}>
                {[35, 48, 42, 65, 55, 88, 74, 60, 78, 88, 72, 100, 91, 85].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: h === 100 ? "linear-gradient(180deg,var(--b-500),var(--b-700))" : "linear-gradient(180deg,var(--b-300),var(--b-400))" }} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem", borderTop: "1px solid var(--n-100)", paddingTop: ".875rem" }}>
                {[
                  { val: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews), lbl: "Views" },
                  { val: totalClicks > 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : String(totalClicks), lbl: "Klik" },
                  { val: report?.uniqueVisitors ? String(report.uniqueVisitors) : "0", lbl: "Pengunjung" },
                ].map((s) => (
                  <div key={s.lbl}>
                    <span style={{ fontFamily: "var(--fd)", fontSize: "1.25rem", fontWeight: 700, color: "var(--b-700)", display: "block", textAlign: "center" }}>{s.val}</span>
                    <span style={{ fontSize: ".67rem", color: "var(--n-500)", textAlign: "center", display: "block" }}>{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Top Links */}
            <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.25rem", marginBottom: ".75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="fa-solid fa-fire-flame-curved" style={{ color: "var(--b-500)" }} /> Top Links
                </div>
                <Link href="/analytics" style={{ fontSize: ".8rem", color: "var(--b-700)", fontWeight: 600, textDecoration: "none" }}>Lihat semua</Link>
              </div>
              {report?.topLinks?.slice(0, 4).map((link, i) => {
                const colors = [
                  { bg: "var(--b-100)", color: "var(--b-700)", icon: "fa-star" },
                  { bg: "#FEE2D5", color: "#C05621", icon: "fa-youtube" },
                  { bg: "#D1FAE5", color: "#065F46", icon: "fa-bag-shopping" },
                  { bg: "#E0F2FE", color: "#0369A1", icon: "fa-x-twitter" },
                ];
                const c = colors[i % colors.length];
                const maxClicks = report.topLinks[0]?.clicks ?? 1;
                return (
                  <div key={link.blockId} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: ".82rem", marginBottom: ".625rem" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".7rem" }}>
                      <i className={`fa-solid ${c.icon}`} />
                    </div>
                    <span style={{ flex: 1, color: "var(--n-700)" }}>{link.title ?? "Link"}</span>
                    <span style={{ fontWeight: 700, color: "var(--b-700)", fontSize: ".78rem", minWidth: 36, textAlign: "right" }}>{link.clicks}</span>
                    <div style={{ width: 60, height: 5, background: "var(--b-100)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "var(--b-500)", borderRadius: 3, width: `${(link.clicks / maxClicks) * 100}%` }} />
                    </div>
                  </div>
                );
              }) ?? <div style={{ textAlign: "center", padding: "1rem", color: "var(--n-400)", fontSize: ".82rem" }}>Belum ada data klik.</div>}
            </div>

            {/* Activity */}
            <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ color: "var(--b-500)" }} /> Aktivitas Terbaru
              </div>
              {[
                { ico: "fa-arrow-pointer", bg: "var(--b-100)", color: "var(--b-600)", title: "47 klik baru di Link Utama", time: "2 jam lalu", val: "+47", valColor: "var(--b-700)" },
                { ico: "fa-eye", bg: "#D1FAE5", color: "#065F46", title: "120 views dari Instagram", time: "5 jam lalu", val: "+120", valColor: "#22C55E" },
                { ico: "fa-pen-to-square", bg: "#DBEAFE", color: "#1E40AF", title: "Halaman diperbarui", time: "Kemarin", val: "", valColor: "" },
              ].map((a) => (
                <div key={a.title} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--n-0)", border: "1.5px solid var(--n-200)", borderRadius: 12, padding: ".875rem", marginBottom: ".625rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: a.bg, color: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".85rem", flexShrink: 0 }}>
                    <i className={`fa-solid ${a.ico}`} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--b-900)" }}>{a.title}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--n-400)", marginTop: 1 }}>
                      <i className="fa-regular fa-clock" /> {a.time}
                    </div>
                  </div>
                  {a.val && <span style={{ fontWeight: 700, color: a.valColor, fontSize: ".82rem" }}>{a.val}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, iconBg, iconColor, value, label, badgeUp, badgeText, fillWidth, fillGradient }: {
  icon: string; iconBg: string; iconColor: string;
  value: string; label: string;
  badgeUp: boolean; badgeText: string;
  fillWidth: number; fillGradient: string;
}) {
  return (
    <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".875rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".92rem" }}>
          <i className={`fa-solid ${icon}`} />
        </div>
        <span className={`badge badge-${badgeUp ? "success" : "danger"}`}>
          <i className={`fa-solid fa-arrow-${badgeUp ? "up" : "down"}`} /> {badgeText}
        </span>
      </div>
      <div style={{ fontFamily: "var(--fd)", fontSize: "1.9rem", fontWeight: 700, color: "var(--b-900)", letterSpacing: "-.03em" }}>{value}</div>
      <div style={{ fontSize: ".75rem", color: "var(--n-500)", marginTop: 2 }}>{label}</div>
      <div style={{ height: 4, background: "var(--n-100)", borderRadius: 2, marginTop: ".875rem", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: fillGradient, width: `${fillWidth}%` }} />
      </div>
    </div>
  );
}

function PageCard({ page }: { page: { id: string; title: string; slug: string; published: boolean; _count?: { blocks?: number } } }) {
  return (
    <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ height: 112, background: "linear-gradient(160deg,var(--b-50),#fff)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 5 }}>
        <div style={{ position: "absolute", top: 9, right: 9, borderRadius: "9999px", padding: "2px 9px", fontSize: ".62rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, background: page.published ? "var(--success-100)" : "var(--n-200)", color: page.published ? "var(--success-700)" : "var(--n-500)" }}>
          {page.published && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success-600)", display: "inline-block" }} />}
          {page.published ? "Live" : "Draft"}
        </div>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,var(--b-400),var(--b-600))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-950)", fontSize: "1.2rem" }}>
          <i className="fa-solid fa-user" />
        </div>
        <div style={{ fontFamily: "var(--fd)", fontSize: ".78rem", fontWeight: 700, color: "var(--b-900)" }}>@{page.slug}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", padding: "0 14px" }}>
          <div style={{ height: 7, background: "var(--b-300)", borderRadius: 4, width: "82%" }} />
          <div style={{ height: 7, background: "var(--b-200)", borderRadius: 4, width: "66%" }} />
          <div style={{ height: 7, background: "var(--b-100)", borderRadius: 4, width: "55%" }} />
        </div>
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: ".92rem", color: "var(--b-900)", marginBottom: ".3rem", display: "flex", alignItems: "center", gap: 6 }}>
          <i className="fa-solid fa-star" style={{ color: "var(--b-500)", fontSize: ".75rem" }} /> {page.title}
        </div>
        <div style={{ fontFamily: "var(--fm)", fontSize: ".7rem", color: "var(--n-500)", marginBottom: ".75rem" }}>bannana.id/{page.slug}</div>
        <div style={{ display: "flex", gap: ".875rem", fontSize: ".72rem", color: "var(--n-500)", marginBottom: ".875rem" }}>
          <span><i className="fa-solid fa-puzzle-piece" style={{ color: "var(--b-500)", fontSize: ".65rem" }} /> {page._count?.blocks ?? 0} blok</span>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link href={`/pages/${page.id}`} style={{ flex: 1, height: 33, borderRadius: 9, fontSize: ".78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "var(--b-500)", color: "var(--b-950)", textDecoration: "none" }}>
            <i className="fa-solid fa-pen-to-square" /> Edit
          </Link>
          <Link href={`/${page.slug}`} style={{ flex: 1, height: 33, borderRadius: 9, fontSize: ".78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "var(--n-100)", color: "var(--n-700)", border: "1.5px solid var(--n-200)", textDecoration: "none" }}>
            <i className="fa-solid fa-eye" /> Lihat
          </Link>
          <button style={{ width: 33, height: 33, flexShrink: 0, borderRadius: 9, background: "var(--n-100)", color: "var(--n-600)", border: "1.5px solid var(--n-200)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fa-solid fa-ellipsis" />
          </button>
        </div>
      </div>
    </div>
  );
}
