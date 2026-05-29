export const dynamic = "force-dynamic";
import Link from "next/link";
import { assertSessionUser } from "@/lib/auth/session";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { PageService } from "@/lib/services/PageService";
import { AnalyticsPageSelector } from "./AnalyticsControls";
import { db } from "@/lib/db/client";

type SearchParams = Promise<{ range?: string; pageId?: string }>;

const COUNTRY_FLAGS: Record<string, string> = {
  ID: "🇮🇩", MY: "🇲🇾", SG: "🇸🇬", US: "🇺🇸", AU: "🇦🇺",
  GB: "🇬🇧", JP: "🇯🇵", KR: "🇰🇷", IN: "🇮🇳", DE: "🇩🇪",
};

export default async function AnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await assertSessionUser();
  const sp = await searchParams;

  let isPro = false;
  try {
    const [subRows] = await db.query(
      "SELECT plan, status FROM Subscription WHERE userId = ? AND status = 'active' LIMIT 1",
      [user.id]
    );
    const sub = (subRows as Record<string, unknown>[])[0];
    isPro = sub?.plan === "pro";
  } catch { /* Subscription table may not exist yet */ }

  // Free users capped at 7-day retention
  const rawRange = (sp.range as "7d" | "30d" | "90d") || "30d";
  const range: "7d" | "30d" | "90d" = isPro ? rawRange : "7d";

  const pages = await new PageService().list(user.id);
  const isAllPages = sp.pageId === "";
  const activePageId = isAllPages ? "" : (sp.pageId ?? pages[0]?.id ?? "");
  const page = pages.find((p) => p.id === activePageId) ?? (isAllPages ? undefined : pages[0]);

  type Report = Awaited<ReturnType<InstanceType<typeof AnalyticsService>["report"]>>;
  let report: Report | null = null;
  if (isAllPages && pages.length > 0) {
    const allReports = await Promise.all(
      pages.map((p) => new AnalyticsService().report(p.id, range).catch(() => null))
    );
    const valid = allReports.filter((r): r is Report => r !== null);
    if (valid.length > 0) {
      const totalViews = valid.reduce((s, r) => s + r.totals.views, 0);
      const totalClicks = valid.reduce((s, r) => s + r.totals.clicks, 0);
      const totalUnique = valid.reduce((s, r) => s + r.totals.uniqueVisitors, 0);
      const trend = (valid[0].trend).map((d, i) => ({
        day: d.day, label: d.label,
        views: valid.reduce((s, r) => s + (r.trend[i]?.views ?? 0), 0),
        clicks: valid.reduce((s, r) => s + (r.trend[i]?.clicks ?? 0), 0),
      }));
      const topLinks = [...valid.flatMap((r) => r.topLinks)].sort((a, b) => b.clickCount - a.clickCount);
      const devMap = new Map<string, number>();
      for (const r of valid) for (const d of r.devices) devMap.set(d.label, (devMap.get(d.label) ?? 0) + d.count);
      const devTotal = [...devMap.values()].reduce((s, v) => s + v, 0) || 1;
      const devices = [...devMap.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, percent: Number(((count / devTotal) * 100).toFixed(1)) }));
      const refMap = new Map<string, number>();
      for (const r of valid) for (const rf of r.referrers) refMap.set(rf.source, (refMap.get(rf.source) ?? 0) + rf.count);
      const refTotal = [...refMap.values()].reduce((s, v) => s + v, 0) || 1;
      const referrers = [...refMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([source, count]) => ({ source, count, pct: Number(((count / refTotal) * 100).toFixed(1)) }));
      const ctryMap = new Map<string, number>();
      for (const r of valid) for (const c of r.countries) ctryMap.set(c.country, (ctryMap.get(c.country) ?? 0) + c.count);
      const ctryTotal = [...ctryMap.values()].reduce((s, v) => s + v, 0) || 1;
      const countries = [...ctryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([country, count]) => ({ country, count, pct: Number(((count / ctryTotal) * 100).toFixed(1)) }));
      const heatmap = new Array(24).fill(0).map((_, i) => valid.reduce((s, r) => s + (r.heatmap[i] ?? 0), 0)) as number[];
      report = { pageId: "all", range, totals: { views: totalViews, clicks: totalClicks, ctr: totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0, uniqueVisitors: totalUnique }, trend, topLinks, devices, referrers, countries, heatmap };
    }
  } else if (page) {
    report = await new AnalyticsService().report(page.id, range);
  }

  const trend = report?.trend ?? [];
  const trendMax = Math.max(...trend.map((d) => d.views), 1);
  const heatmap = report?.heatmap ?? new Array(24).fill(0);
  const heatMax = Math.max(...heatmap, 1);
  const peakHour = heatmap.indexOf(Math.max(...heatmap));

  const deviceIcons: Record<string, { ico: string; bg: string; color: string; bar: string }> = {
    Mobile:  { ico: "fa-solid fa-mobile-screen",         bg: "#D1FAE5", color: "#065F46", bar: "#4ADE80" },
    Desktop: { ico: "fa-solid fa-desktop",               bg: "#DBEAFE", color: "#1E40AF", bar: "#60A5FA" },
    Tablet:  { ico: "fa-solid fa-tablet-screen-button",  bg: "#FEF3C7", color: "#D97706", bar: "#FBBF24" },
    Unknown: { ico: "fa-solid fa-question",              bg: "var(--n-100)", color: "var(--n-500)", bar: "var(--n-400)" },
  };

  return (
    <>
      <div className="topbar topbar-wrap">
        <div style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, color: "var(--b-900)" }}>
          <i className="fa-solid fa-chart-line" style={{ color: "var(--b-500)", marginRight: 8 }} /> Analytics
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <AnalyticsPageSelector pages={pages.map((p) => ({ id: p.id, title: p.title }))} activePageId={activePageId} />
          {isPro
            ? <a href={`/api/analytics/export?pageId=${activePageId}&range=${range}`} className="export-btn" download><i className="fa-solid fa-file-csv" /><span className="hide-mobile"> Export CSV</span></a>
            : <span className="export-btn" style={{ opacity: .5, cursor: "not-allowed" }} title="Export CSV hanya untuk Pro"><i className="fa-solid fa-lock" /><span className="hide-mobile"> Export CSV</span></span>
          }
        </div>
      </div>

      <div className="page-content">
        {!isPro && (
          <div style={{
            background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 14,
            padding: ".875rem 1.25rem", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: ".875rem", flexWrap: "wrap",
          }}>
            <i className="fa-solid fa-clock-rotate-left" style={{ color: "#7C3AED", fontSize: "1rem", flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: ".84rem", color: "#5B21B6" }}>
              <strong>Retensi data: 7 hari</strong> — Upgrade ke Pro untuk akses data 90 hari, Export CSV, dan REST API.
            </div>
            <a href="/langganan" style={{
              background: "#7C3AED", color: "#fff", fontWeight: 700, fontSize: ".78rem",
              padding: "5px 14px", borderRadius: 9, textDecoration: "none", flexShrink: 0,
            }}>
              <i className="fa-solid fa-crown" /> Upgrade Pro
            </a>
          </div>
        )}

        {/* STATS */}
        <div className="stats-grid">
          {[
            { ico: "fa-solid fa-eye",          bg: "var(--b-100)", color: "var(--b-600)",   val: (report?.totals.views ?? 0).toLocaleString("id-ID"),          lbl: "Total Views" },
            { ico: "fa-solid fa-arrow-pointer", bg: "#D1FAE5",       color: "#065F46",        val: (report?.totals.clicks ?? 0).toLocaleString("id-ID"),         lbl: "Total Klik" },
            { ico: "fa-solid fa-percent",       bg: "#DBEAFE",       color: "#1E40AF",        val: `${report?.totals.ctr ?? 0}%`,                                 lbl: "Click Rate (CTR)" },
            { ico: "fa-solid fa-users",         bg: "#FCE7F3",       color: "#9D174D",        val: (report?.totals.uniqueVisitors ?? 0).toLocaleString("id-ID"),  lbl: "Pengunjung Unik" },
          ].map((s) => (
            <div key={s.lbl} className="stat-card">
              <div className="sc-ico" style={{ background: s.bg, color: s.color }}><i className={s.ico} /></div>
              <div className="sc-val">{s.val}</div>
              <div className="sc-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* TREND CHART */}
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
                {(["7d", "30d", "90d"] as const).map((r) => {
                  const locked = !isPro && r !== "7d";
                  return locked
                    ? <span key={r} className="rng-btn" style={{ opacity: .45, cursor: "not-allowed" }} title="Upgrade ke Pro untuk data 30/90 hari"><i className="fa-solid fa-lock" style={{ fontSize: ".6rem", marginRight: 3 }} />{r === "30d" ? "30h" : "90h"}</span>
                    : <Link key={r} href={`/analytics?range=${r}${isAllPages ? "&pageId=" : activePageId ? `&pageId=${activePageId}` : ""}`} className={`rng-btn${range === r ? " act" : ""}`}>{r === "7d" ? "7h" : r === "30d" ? "30h" : "90h"}</Link>;
                })}
              </div>
            </div>
          </div>

          {trend.every((d) => d.views === 0 && d.clicks === 0) ? (
            <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--n-400)", fontSize: ".875rem" }}>
              <i className="fa-solid fa-chart-bar" style={{ marginRight: ".5rem" }} /> Belum ada data kunjungan dalam periode ini.
            </div>
          ) : (
            <>
              <div style={{ height: 120, display: "flex", alignItems: "flex-end", gap: 3 }}>
                {trend.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: "stretch" }}>
                    {d.clicks > 0 && (
                      <div style={{ height: `${Math.max(3, (d.clicks / trendMax) * 50)}px`, background: "var(--b-200)", borderRadius: "2px 2px 0 0" }} title={`${d.label}: ${d.clicks} klik`} />
                    )}
                    <div className={`cbar${d.views >= trendMax ? " hi" : ""}`} style={{ height: `${Math.max(4, (d.views / trendMax) * 100)}%` }} title={`${d.label}: ${d.views} views`} />
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                {trend.map((d, i) => {
                  const step = trend.length > 30 ? 7 : trend.length > 14 ? 3 : 1;
                  return <span key={i} style={{ fontSize: ".6rem" }}>{i % step === 0 ? d.label : ""}</span>;
                })}
              </div>
            </>
          )}
        </div>

        {/* 3 COLS */}
        <div className="three-col">
          {/* Top Links */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-fire-flame-curved" /> Top Links</div>
            {(report?.topLinks ?? []).length > 0 ? report!.topLinks.slice(0, 5).map((link, i) => {
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
            }) : (
              <p style={{ fontSize: ".82rem", color: "var(--n-400)", padding: ".5rem 0" }}>Belum ada data klik.</p>
            )}
          </div>

          {/* Countries — real data only */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-earth-asia" /> Negara Asal</div>
            {(report?.countries ?? []).length > 0 ? report!.countries.map((g) => (
              <div key={g.country} className="geo-row">
                <span className="geo-flag">{COUNTRY_FLAGS[g.country] ?? "🌍"}</span>
                <span className="geo-name">{g.country}</span>
                <span className="geo-ct">{g.count.toLocaleString("id-ID")}</span>
                <span className="geo-pct">{g.pct}%</span>
              </div>
            )) : (
              <p style={{ fontSize: ".82rem", color: "var(--n-400)", padding: ".5rem 0" }}>Data negara belum tersedia.</p>
            )}
          </div>

          {/* Devices — real data */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-mobile-screen" /> Perangkat</div>
            {(report?.devices ?? []).length > 0 ? report!.devices.map((d) => {
              const di = deviceIcons[d.label] ?? deviceIcons.Unknown;
              return (
                <div key={d.label} className="device-row">
                  <div className="dev-ico" style={{ background: di.bg, color: di.color }}><i className={di.ico} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="dev-name">{d.label}</span>
                      <span className="dev-ct">{d.percent}%</span>
                    </div>
                    <div className="dev-bar"><div className="dev-fill" style={{ width: `${d.percent}%`, background: di.bar }} /></div>
                  </div>
                </div>
              );
            }) : (
              <p style={{ fontSize: ".82rem", color: "var(--n-400)", padding: ".5rem 0" }}>Belum ada data perangkat.</p>
            )}
          </div>
        </div>

        {/* 2 COLS */}
        <div className="two-col">
          {/* Referrals — real data */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-arrow-turn-right" /> Sumber Referral</div>
            {(report?.referrers ?? []).length > 0 ? report!.referrers.map((r) => {
              const iconMap: Record<string, { ico: string; color: string }> = {
                "instagram.com": { ico: "fa-brands fa-instagram", color: "#E1306C" },
                "twitter.com":   { ico: "fa-brands fa-x-twitter", color: "#1DA1F2" },
                "x.com":         { ico: "fa-brands fa-x-twitter", color: "#1DA1F2" },
                "tiktok.com":    { ico: "fa-brands fa-tiktok",    color: "#000" },
                "google.com":    { ico: "fa-brands fa-google",    color: "#EA4335" },
                "facebook.com":  { ico: "fa-brands fa-facebook",  color: "#1877F2" },
                "youtube.com":   { ico: "fa-brands fa-youtube",   color: "#FF0000" },
                "Direct":        { ico: "fa-solid fa-link",       color: "var(--b-500)" },
              };
              const ic = iconMap[r.source] ?? { ico: "fa-solid fa-globe", color: "var(--n-500)" };
              return (
                <div key={r.source} className="ref-item">
                  <div className="ref-ico"><i className={ic.ico} style={{ color: ic.color }} /></div>
                  <span style={{ flex: 1, color: "var(--n-700)" }}>{r.source}</span>
                  <span style={{ fontWeight: 700, color: "var(--b-700)", fontSize: ".78rem" }}>{r.count}</span>
                  <span style={{ fontSize: ".7rem", color: "var(--n-400)", marginLeft: 5 }}>{r.pct}%</span>
                </div>
              );
            }) : (
              <p style={{ fontSize: ".82rem", color: "var(--n-400)", padding: ".5rem 0" }}>Belum ada data referral.</p>
            )}
          </div>

          {/* Heatmap — real data */}
          <div className="anl-card">
            <div className="anl-card-title"><i className="fa-solid fa-clock" /> Jam Paling Ramai</div>
            {heatmap.every((v) => v === 0) ? (
              <p style={{ fontSize: ".82rem", color: "var(--n-400)", padding: ".5rem 0" }}>Belum ada data kunjungan.</p>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3, marginTop: ".5rem" }}>
                  {heatmap.map((v, i) => {
                    const pct = v / heatMax;
                    return (
                      <div key={i} title={`${i.toString().padStart(2,"0")}:00 — ${v} kunjungan`}
                        style={{ height: 40, borderRadius: 6, background: `rgba(245,158,11,${(0.08 + pct * 0.92).toFixed(2)})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".58rem", color: "var(--b-900)", fontWeight: 700, cursor: "pointer" }}>
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
                  Jam paling ramai: <strong style={{ color: "var(--b-800)" }}>{peakHour.toString().padStart(2, "0")}:00 – {(peakHour + 1).toString().padStart(2, "0")}:00</strong>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
