export const dynamic = "force-dynamic";
import Link from "next/link";
import { assertSessionUser } from "@/lib/auth/session";
import { AnalyticsService } from "@/lib/services/AnalyticsService";
import { PageService } from "@/lib/services/PageService";
import { AnalyticsPageSelector } from "./AnalyticsControls";

type SearchParams = Promise<{ range?: string; pageId?: string }>;

const COUNTRY_FLAGS: Record<string, string> = {
  ID: "🇮🇩", MY: "🇲🇾", SG: "🇸🇬", US: "🇺🇸", AU: "🇦🇺",
  GB: "🇬🇧", JP: "🇯🇵", KR: "🇰🇷", IN: "🇮🇳", DE: "🇩🇪",
};

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
      <div className="topbar">
        <div style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, color: "var(--b-900)" }}>
          <i className="fa-solid fa-chart-line" style={{ color: "var(--b-500)", marginRight: 8 }} /> Analytics
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <AnalyticsPageSelector pages={pages.map((p) => ({ id: p.id, title: p.title }))} activePageId={activePageId} />
          <a href={`/api/analytics/export?pageId=${activePageId}&range=${range}`} className="export-btn" download><i className="fa-solid fa-file-csv" /> Export CSV</a>
        </div>
      </div>

      <div className="page-content">
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
                {(["7d", "30d", "90d"] as const).map((r) => (
                  <Link key={r} href={`/analytics?range=${r}${activePageId ? `&pageId=${activePageId}` : ""}`} className={`rng-btn${range === r ? " act" : ""}`}>
                    {r === "7d" ? "7h" : r === "30d" ? "30h" : "90h"}
                  </Link>
                ))}
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
                {trend.map((d, i) => (
                  <span key={i} style={{ fontSize: ".6rem" }}>{d.label}</span>
                ))}
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
