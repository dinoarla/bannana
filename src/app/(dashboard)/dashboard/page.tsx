export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { assertSessionUser, CSRF_COOKIE } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { db } from "@/lib/db/client";
import type { PageWithBlocks } from "@/types/db.types";
import { DashboardTopbar } from "@/components/shared/DashboardTopbar";

type SearchParams = Promise<{ range?: string }>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const range = (sp.range as "7d" | "30d" | "90d") ?? "30d";

  const user = await assertSessionUser();
  if (user.role === "ADMIN") redirect("/admin");
  const jar = await cookies();
  const csrfToken = jar.get(CSRF_COOKIE)?.value ?? "";
  const pages = await new PageService().list(user.id);
  const displayName = user.profile?.displayName ?? user.username;

  let isPro = false;
  try {
    const [subRows] = await db.query("SELECT plan, status FROM Subscription WHERE userId = ? LIMIT 1", [user.id]);
    const subRow = (subRows as Record<string, unknown>[])[0];
    isPro = subRow?.plan === "pro" && subRow?.status === "active";
  } catch { /* Subscription table may not exist yet */ }
  const canCreatePage = isPro || pages.length === 0;

  const report = pages[0]
    ? await new AnalyticsService().report(pages[0].id, range).catch(() => null)
    : null;

  const totalViews = report?.totals.views ?? 0;
  const totalClicks = report?.totals.clicks ?? 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <>
      <DashboardTopbar
        pages={pages.map((p) => ({ id: p.id, title: p.title, isPublished: p.isPublished }))}
        username={user.username}
        avatarUrl={user.profile?.avatarUrl ?? null}
        csrfToken={csrfToken}
        canCreatePage={canCreatePage}
      />

      <div className="page-content">
        {/* PAGE TITLE */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.8rem", fontWeight: 700, color: "var(--b-900)", letterSpacing: "-.01em" }}>
            Selamat datang, {displayName.split(" ")[0]}! 👋
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Ringkasan performa halaman bannana.id kamu —{" "}
            {range === "7d" ? "7 hari" : range === "30d" ? "30 hari" : "90 hari"} terakhir
          </div>
        </div>

        {/* STATS GRID */}
        <div className="dash-stat-grid">
          <StatCard
            icon="fa-eye" iconBg="var(--b-100)" iconColor="var(--b-600)"
            value={totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews)}
            label="Total Views"
            fillGradient="linear-gradient(90deg,var(--b-400),var(--b-500))"
          />
          <StatCard
            icon="fa-arrow-pointer" iconBg="#D1FAE5" iconColor="#065F46"
            value={totalClicks > 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : String(totalClicks)}
            label="Total Klik"
            fillGradient="linear-gradient(90deg,#4ADE80,#22C55E)"
          />
          <StatCard
            icon="fa-percent" iconBg="#DBEAFE" iconColor="#1E40AF"
            value={`${ctr}%`}
            label="Click Rate"
            fillGradient="linear-gradient(90deg,#60A5FA,#3B82F6)"
          />
          <StatCard
            icon="fa-users" iconBg="#FCE7F3" iconColor="#9D174D"
            value={report?.totals.uniqueVisitors ? String(report.totals.uniqueVisitors) : "0"}
            label="Pengunjung Unik"
            fillGradient="linear-gradient(90deg,#F9A8D4,#EC4899)"
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
            <PageCard key={page.id} page={page} avatarUrl={user.profile?.avatarUrl ?? null} username={user.username} />
          ))}
          {canCreatePage ? (
            <Link href="/pages/new"
              style={{ background: "var(--b-50)", border: "2px dashed var(--b-200)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".75rem", padding: "2.25rem", textDecoration: "none", minHeight: 220 }}
            >
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--b-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-500)", fontSize: "1.2rem" }}>
                <i className="fa-solid fa-plus" />
              </div>
              <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-700)" }}>Buat Halaman Baru</div>
              <div style={{ fontSize: ".75rem", color: "var(--n-500)", textAlign: "center" }}>Link page, about me, portofolio — bebas!</div>
            </Link>
          ) : (
            <Link href="/langganan"
              style={{ background: "var(--b-50)", border: "2px dashed var(--b-200)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".75rem", padding: "2.25rem", textDecoration: "none", minHeight: 220, position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(3px)", background: "rgba(255,251,235,.65)", zIndex: 1, borderRadius: 18 }} />
              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: ".6rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--b-200)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-600)", fontSize: "1.2rem" }}>
                  <i className="fa-solid fa-crown" />
                </div>
                <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-800)" }}>Upgrade ke Pro</div>
                <div style={{ fontSize: ".75rem", color: "var(--b-700)", textAlign: "center", fontWeight: 600 }}>Buat halaman tak terbatas</div>
                <div style={{ fontSize: ".7rem", color: "var(--n-500)", textAlign: "center" }}>Paket Gratis hanya 1 halaman</div>
              </div>
            </Link>
          )}
        </div>

        {/* BOTTOM 2-COL */}
        <div className="dash-bottom-grid">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 7 }}>
                  <i className="fa-solid fa-chart-area" style={{ color: "var(--b-500)" }} /> Tren Kunjungan
                </div>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  {(["7d", "30d", "90d"] as const).map((r) => (
                    <Link
                      key={r}
                      href={`/dashboard?range=${r}`}
                      style={{ height: 27, padding: "0 11px", borderRadius: "9999px", fontSize: ".72rem", fontWeight: 700, border: `1.5px solid ${range === r ? "var(--b-300)" : "var(--n-200)"}`, background: range === r ? "var(--b-100)" : "none", color: range === r ? "var(--b-800)" : "var(--n-500)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                    >
                      {r === "7d" ? "7h" : r === "30d" ? "30h" : "90h"}
                    </Link>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 120, display: "flex", alignItems: "flex-end", gap: 4, marginBottom: ".875rem" }}>
                {(report?.trend && report.trend.length > 0
                  ? report.trend.map((d) => d.views)
                  : [35, 48, 42, 65, 55, 88, 74, 60, 78, 88, 72, 100, 91, 85]
                ).map((h, i, arr) => {
                  const max = Math.max(...arr, 1);
                  const pct = Math.round((h / max) * 100);
                  return (
                    <div key={i} style={{ flex: 1, height: `${Math.max(4, pct)}%`, borderRadius: "4px 4px 0 0", background: pct === 100 ? "linear-gradient(180deg,var(--b-500),var(--b-700))" : "linear-gradient(180deg,var(--b-300),var(--b-400))" }} />
                  );
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem", borderTop: "1px solid var(--n-100)", paddingTop: ".875rem" }}>
                {[
                  { val: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews), lbl: "Views" },
                  { val: totalClicks > 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : String(totalClicks), lbl: "Klik" },
                  { val: report?.totals.uniqueVisitors ? String(report.totals.uniqueVisitors) : "0", lbl: "Pengunjung" },
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
              {report?.topLinks && report.topLinks.length > 0 ? report.topLinks.slice(0, 4).map((link, i) => {
                const colors = [
                  { bg: "var(--b-100)", color: "var(--b-700)", icon: "fa-star" },
                  { bg: "#FEE2D5", color: "#C05621", icon: "fa-youtube" },
                  { bg: "#D1FAE5", color: "#065F46", icon: "fa-bag-shopping" },
                  { bg: "#E0F2FE", color: "#0369A1", icon: "fa-x-twitter" },
                ];
                const c = colors[i % colors.length];
                const maxClicks = report.topLinks[0]?.clickCount ?? 1;
                return (
                  <div key={link.id} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: ".82rem", marginBottom: ".625rem" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".7rem" }}>
                      <i className={`fa-solid ${c.icon}`} />
                    </div>
                    <span style={{ flex: 1, color: "var(--n-700)" }}>{link.title ?? "Link"}</span>
                    <span style={{ fontWeight: 700, color: "var(--b-700)", fontSize: ".78rem", minWidth: 36, textAlign: "right" }}>{link.clickCount}</span>
                    <div style={{ width: 60, height: 5, background: "var(--b-100)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "var(--b-500)", borderRadius: 3, width: `${(link.clickCount / maxClicks) * 100}%` }} />
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: "center", padding: "1rem", color: "var(--n-400)", fontSize: ".82rem" }}>Belum ada data klik.</div>
              )}
            </div>

            {/* Pages quick list */}
            <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
                <i className="fa-solid fa-table-columns" style={{ color: "var(--b-500)" }} /> Halaman Aktif
              </div>
              {pages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "1rem", color: "var(--n-400)", fontSize: ".82rem" }}>
                  Belum ada halaman. <Link href="/pages/new" style={{ color: "var(--b-700)" }}>Buat sekarang</Link>
                </div>
              ) : pages.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/pages/${p.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: ".75rem", marginBottom: ".375rem", background: "var(--n-50)", border: "1.5px solid var(--n-200)", borderRadius: 10, textDecoration: "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: p.isPublished ? "var(--b-100)" : "var(--n-100)", color: p.isPublished ? "var(--b-700)" : "var(--n-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".7rem" }}>
                    <i className={`fa-solid ${p.isPublished ? "fa-globe" : "fa-file"}`} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--b-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: ".68rem", color: "var(--n-400)" }}>{p.blocks.length} blok · {p.isPublished ? "Live" : "Draft"}</div>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: "var(--n-300)", fontSize: ".7rem" }} />
                </Link>
              ))}
              {pages.length > 3 && (
                <Link href="/pages" style={{ display: "block", textAlign: "center", fontSize: ".78rem", color: "var(--b-700)", fontWeight: 600, textDecoration: "none", paddingTop: ".5rem" }}>
                  Lihat semua {pages.length} halaman →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, iconBg, iconColor, value, label, fillGradient }: {
  icon: string; iconBg: string; iconColor: string;
  value: string; label: string;
  fillGradient: string;
}) {
  return (
    <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".875rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".92rem" }}>
          <i className={`fa-solid ${icon}`} />
        </div>
      </div>
      <div style={{ fontFamily: "var(--fd)", fontSize: "1.9rem", fontWeight: 700, color: "var(--b-900)", letterSpacing: "-.03em" }}>{value}</div>
      <div style={{ fontSize: ".75rem", color: "var(--n-500)", marginTop: 2 }}>{label}</div>
      <div style={{ height: 4, background: "var(--n-100)", borderRadius: 2, marginTop: ".875rem", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: fillGradient, width: "60%" }} />
      </div>
    </div>
  );
}

function PageCard({ page, avatarUrl, username }: { page: PageWithBlocks; avatarUrl: string | null; username: string }) {
  return (
    <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ height: 112, background: "linear-gradient(160deg,var(--b-50),#fff)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 5 }}>
        <div style={{ position: "absolute", top: 9, right: 9, borderRadius: "9999px", padding: "2px 9px", fontSize: ".62rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, background: page.isPublished ? "var(--success-100)" : "var(--n-200)", color: page.isPublished ? "var(--success-700)" : "var(--n-500)" }}>
          {page.isPublished && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success-600)", display: "inline-block" }} />}
          {page.isPublished ? "Live" : "Draft"}
        </div>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,var(--b-400),var(--b-600))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-950)", fontSize: "1.2rem", overflow: "hidden", padding: avatarUrl ? 0 : undefined }}>
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <i className="fa-solid fa-user" />}
        </div>
        <div style={{ fontFamily: "var(--fd)", fontSize: ".78rem", fontWeight: 700, color: "var(--b-900)" }}>@{username}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", padding: "0 14px" }}>
          <div style={{ height: 7, background: "var(--b-300)", borderRadius: 4, width: "82%" }} />
          <div style={{ height: 7, background: "var(--b-200)", borderRadius: 4, width: "66%" }} />
          <div style={{ height: 7, background: "var(--b-100)", borderRadius: 4, width: "55%" }} />
        </div>
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: ".92rem", color: "var(--b-900)", marginBottom: ".3rem" }}>
          {page.title}
        </div>
        <div style={{ fontFamily: "var(--fm)", fontSize: ".7rem", color: "var(--n-500)", marginBottom: ".75rem" }}>bannana.id/{username}</div>
        <div style={{ display: "flex", gap: ".875rem", fontSize: ".72rem", color: "var(--n-500)", marginBottom: ".875rem" }}>
          <span><i className="fa-solid fa-puzzle-piece" style={{ color: "var(--b-500)", fontSize: ".65rem" }} /> {page.blocks.length} blok</span>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link href={`/pages/${page.id}`} style={{ flex: 1, height: 33, borderRadius: 9, fontSize: ".78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "var(--b-500)", color: "var(--b-950)", textDecoration: "none" }}>
            <i className="fa-solid fa-pen-to-square" /> Edit
          </Link>
          <Link href={`/${username}`} target="_blank" style={{ flex: 1, height: 33, borderRadius: 9, fontSize: ".78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "var(--n-100)", color: "var(--n-700)", border: "1.5px solid var(--n-200)", textDecoration: "none" }}>
            <i className="fa-solid fa-eye" /> Lihat
          </Link>
        </div>
      </div>
    </div>
  );
}
