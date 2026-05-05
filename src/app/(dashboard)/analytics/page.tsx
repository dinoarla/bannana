import Link from "next/link";
import { assertSessionUser } from "@/lib/auth/session";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { PageService } from "@/lib/services/PageService";
import { AnalyticsPageSelector } from "./AnalyticsControls";

type SearchParams = Promise<{ range?: string; pageId?: string }>;

export default async function AnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await assertSessionUser();
  const sp = await searchParams;
  const range = (sp.range as "7d" | "30d" | "90d") || "30d";

  const pages = await new PageService().list(user.id);
  const activePageId = sp.pageId ?? pages[0]?.id ?? "";
  const page = pages.find((p) => p.id === activePageId) ?? pages[0];
  const report = page ? await new AnalyticsService().report(page.id, range) : null;

  const trend = report?.trend ?? [];
  const trendMax = Math.max(...trend.map((d) => d.views), 1);

  const heatmapHours = [0, 0, 1, 1, 2, 3, 8, 12, 18, 22, 20, 15, 18, 22, 20, 18, 22, 25, 30, 28, 24, 20, 15, 8];
  const heatMax = Math.max(...heatmapHours);

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, color: "var(--b-900)" }}>
          <i className="fa-solid fa-chart-line" style={{ color: "var(--b-500)", marginRight: 8 }} /> Analytics
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <AnalyticsPageSelector pages={pages.map((p) => ({ id: p.id, title: p.title }))} activePageId={activePageId} />
          <a href="#" className="export-btn"><i className="fa-solid fa-file-csv" /> Export CSV</a>
        </div>
      </div>

      <div className="page-content">
        {/* STATS */}
        <div className="stats-grid">
          {[
            { ico: "fa-solid fa-eye", bg: "var(--b-100)", color: "var(--b-600)", val: (report?.totals.views ?? 0).toLocaleString("id-ID"), lbl: "Total Views", chg: "up", pct: "18.4%" },
            { ico: "fa-solid fa-arrow-pointer", bg: "#D1FAE5", color: "#065F46", val: (report?.totals.clicks ?? 0).toLocaleString("id-ID"), lbl: "Total Klik", chg: "up", pct: "23.7%" },
            { ico: "fa-solid fa-percent", bg: "#DBEAFE", color: "#1E40AF", val: `${report?.totals.ctr ?? 0}%`, lbl: "Click Rate (CTR)", chg: "up", pct: "3.1%" },
            { ico: "fa-solid fa-users", bg: "#FCE7F3", color: "#9D174D", val: (report?.totals.uniqueVisitors ?? 0).toLocaleString("id-ID"), lbl: "Pengunjung Unik", chg: "dn", pct: "4.8%" },
          ].map((s) => (
            <div key={s.lbl} className="stat-card">
              <div className="sc-ico" style={{ background: s.bg, color: s.color }}><i className={s.ico} /></div>
              <div className="sc-val">{s.val}</div>
              <div className="sc-lbl">{s.lbl}</div>
              <div className={`sc-chg ${s.chg}`}>
                <i className={`fa-solid fa-arrow-${s.chg === "up" ? "up" : "down"}`} /> {s.pct} vs periode lalu
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CHART */}
        <div className="main-chart-card">
          <div className="chart-head">
            <div className="chart-title"><i className="fa-solid fa-chart-area" /> Tren Kunjungan &amp; Klik</div>
            <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: ".875rem", fontSize: ".75rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--b-500)", display: "inline-block" }} /> Views
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--b-200)", display: "inline-block" }} /> Klik
                </span>
              </div>
              <div className="rng-btns">
                {(["7d", "30d", "90d"] as const).map((r) => (
                  <Link key={r} href={`/analytics?range=${r}${activePageId ? `&pageId=${activePageId}` : ""}`} className={`rng-btn${range === r ? " act" : ""}`}>
                    {r === "7d" ? "7h" : r === "30d" ? "30h" : "90h"}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: 120, display: "flex", alignItems: "flex-end", gap: 3 }}>
            {(trend.length > 0 ? trend : Array.from({ length: 30 }, (_, i) => ({ day: i + 1, views: 20 + ((i * 17 + 5) % 80), clicks: 0 }))).map((d, i) => (
              <div key={i} className={`cbar${d.views >= trendMax ? " hi" : ""}`} style={{ height: `${Math.max(5, (d.views / trendMax) * 100)}%` }} title={`Hari ${d.day}: ${d.views} views`} />
            ))}
          </div>
          <div className="chart-labels">
            {(trend.length > 0 ? trend : Array.from({ length: 30 }, (_, i) => ({ day: i + 1 }))).map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </div>

        {/* 3 COLS */}
        <div className="three-col">
          {/* Top Links */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-fire-flame-curved" /> Top Links</div>
            {(report?.topLinks ?? []).length > 0 ? (report!.topLinks.slice(0, 5).map((link, i) => {
              const maxClicks = report!.topLinks[0]?.clickCount || 1;
              const pct = Math.round((link.clickCount / maxClicks) * 100);
              const colors = [
                { bg: "var(--b-100)", color: "var(--b-700)", ico: "fa-solid fa-star" },
                { bg: "#FEE2D5", color: "#C05621", ico: "fa-brands fa-youtube" },
                { bg: "#D1FAE5", color: "#065F46", ico: "fa-solid fa-bag-shopping" },
                { bg: "#E0F2FE", color: "#0369A1", ico: "fa-brands fa-x-twitter" },
                { bg: "#EDE9FE", color: "#7C3AED", ico: "fa-solid fa-envelope" },
              ];
              const c = colors[i] ?? colors[0];
              return (
                <div key={link.id} className="link-row">
                  <div className="link-row-ico" style={{ background: c.bg, color: c.color }}><i className={c.ico} /></div>
                  <span className="link-row-name">{link.title ?? "Tanpa judul"}</span>
                  <span className="link-row-ct">{link.clickCount}</span>
                  <div className="link-bar"><div className="link-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })) : (
              <p style={{ fontSize: ".82rem", color: "var(--n-400)", padding: ".5rem 0" }}>Belum ada data klik.</p>
            )}
          </div>

          {/* Countries */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-earth-asia" /> Negara Asal</div>
            {[
              { flag: "🇮🇩", name: "Indonesia", ct: "2,841", pct: "73.8%" },
              { flag: "🇲🇾", name: "Malaysia", ct: "384", pct: "9.9%" },
              { flag: "🇸🇬", name: "Singapura", ct: "198", pct: "5.1%" },
              { flag: "🇺🇸", name: "Amerika Serikat", ct: "142", pct: "3.7%" },
              { flag: "🇦🇺", name: "Australia", ct: "98", pct: "2.5%" },
              { flag: "🌍", name: "Lainnya", ct: "184", pct: "4.8%" },
            ].map((g) => (
              <div key={g.name} className="geo-row">
                <span className="geo-flag">{g.flag}</span>
                <span className="geo-name">{g.name}</span>
                <span className="geo-ct">{g.ct}</span>
                <span className="geo-pct">{g.pct}</span>
              </div>
            ))}
          </div>

          {/* Devices */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-mobile-screen" /> Perangkat</div>
            {[
              { ico: "fa-solid fa-mobile-screen", bg: "#D1FAE5", color: "#065F46", name: "Mobile", pct: 68.4, bar: "#4ADE80" },
              { ico: "fa-solid fa-desktop", bg: "#DBEAFE", color: "#1E40AF", name: "Desktop", pct: 24.2, bar: "#60A5FA" },
              { ico: "fa-solid fa-tablet-screen-button", bg: "#FEF3C7", color: "#D97706", name: "Tablet", pct: 7.4, bar: "#FBBF24" },
            ].map((d) => (
              <div key={d.name} className="device-row">
                <div className="dev-ico" style={{ background: d.bg, color: d.color }}><i className={d.ico} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="dev-name">{d.name}</span>
                    <span className="dev-ct">{d.pct}%</span>
                  </div>
                  <div className="dev-bar"><div className="dev-fill" style={{ width: `${d.pct}%`, background: d.bar }} /></div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "1.1rem", paddingTop: ".875rem", borderTop: "1px solid var(--n-100)" }}>
              <div className="anl-card-title" style={{ fontSize: ".85rem", marginBottom: ".75rem" }}><i className="fa-brands fa-chrome" /> Browser Populer</div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", fontSize: ".78rem", color: "var(--n-700)" }}>
                {[["Chrome", "58.2%"], ["Safari", "24.1%"], ["Firefox", "9.8%"], ["Lainnya", "7.9%"]].map(([name, pct]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{name}</span><span style={{ fontWeight: 700, color: "var(--b-700)" }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2 COLS */}
        <div className="two-col">
          {/* Referrals */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-arrow-turn-right" /> Sumber Referral</div>
            {[
              { ico: "fa-brands fa-instagram", color: "#E1306C", name: "Instagram (Bio Link)", ct: "1,248", pct: "32.4%" },
              { ico: "fa-brands fa-x-twitter", color: "#1DA1F2", name: "Twitter / X", ct: "874", pct: "22.7%" },
              { ico: "fa-brands fa-tiktok", color: "#000", name: "TikTok", ct: "632", pct: "16.4%" },
              { ico: "fa-brands fa-google", color: "#EA4335", name: "Google Search", ct: "418", pct: "10.9%" },
              { ico: "fa-solid fa-link", color: "var(--b-500)", name: "Direct / Langsung", ct: "675", pct: "17.6%" },
            ].map((r) => (
              <div key={r.name} className="ref-item">
                <div className="ref-ico"><i className={r.ico} style={{ color: r.color }} /></div>
                <span style={{ flex: 1, color: "var(--n-700)" }}>{r.name}</span>
                <span style={{ fontWeight: 700, color: "var(--b-700)", fontSize: ".78rem" }}>{r.ct}</span>
                <span style={{ fontSize: ".7rem", color: "var(--n-400)", marginLeft: 5 }}>{r.pct}</span>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-clock" /> Jam Paling Ramai</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3, marginTop: ".5rem" }}>
              {heatmapHours.map((v, i) => {
                const pct = v / heatMax;
                return (
                  <div key={i} title={`${i}:00 — ${v} klik`} style={{ height: 40, borderRadius: 6, background: `rgba(245,158,11,${(0.1 + pct * 0.9).toFixed(2)})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".58rem", color: "var(--b-900)", fontWeight: 700, cursor: "pointer" }}>
                    {v > 0 ? v : ""}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".5rem", fontSize: ".62rem", color: "var(--n-400)" }}>
              <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: ".875rem", borderTop: "1px solid var(--n-100)", fontSize: ".82rem", color: "var(--n-600)", lineHeight: 1.65 }}>
              <i className="fa-solid fa-lightbulb" style={{ color: "var(--b-500)", marginRight: 5 }} />
              Waktu terbaik posting: <strong style={{ color: "var(--b-800)" }}>18:00 – 21:00 WIB</strong> berdasarkan tren klikmu.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
