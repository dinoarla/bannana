type Report = {
  totals: { views: number; clicks: number; ctr: number; uniqueVisitors: number };
  trend: Array<{ day: number; views: number; clicks: number }>;
  topLinks: Array<{ id: string; title: string | null; clickCount: number }>;
};

export function AnalyticsOverview({ report, range }: { report: Report; range?: string }) {
  const max = Math.max(...report.trend.map((d) => d.views), 1);

  return (
    <>
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        <MetricCard label="Total Views" value={report.totals.views.toLocaleString("id-ID")} icon="👁" />
        <MetricCard label="Total Klik" value={report.totals.clicks.toLocaleString("id-ID")} icon="🖱" />
        <MetricCard label="Click Rate" value={`${report.totals.ctr}%`} icon="📊" />
        <MetricCard label="Pengunjung Unik" value={report.totals.uniqueVisitors.toLocaleString("id-ID")} icon="👤" />
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 className="section-title">Tren Kunjungan</h2>
          <span className="badge badge-brand">{range ?? "30 hari"}</span>
        </div>
        <div style={{ height: 160, display: "flex", alignItems: "end", gap: 3 }}>
          {report.trend.map((d) => (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: "stretch", height: "100%" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "end" }}>
                <div
                  title={`Hari ${d.day}: ${d.views} views, ${d.clicks} klik`}
                  style={{
                    width: "100%",
                    height: `${Math.max(6, (d.views / max) * 100)}%`,
                    background: "linear-gradient(180deg,var(--b-300),var(--b-500))",
                    borderRadius: "4px 4px 0 0",
                    minHeight: 4,
                    transition: "height 300ms ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".5rem", fontSize: ".7rem", color: "var(--n-400)" }}>
          <span>Hari 1</span>
          <span>Hari {Math.floor(report.trend.length / 2)}</span>
          <span>Hari {report.trend.length}</span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: "1.5rem" }}>
        {/* Top Links */}
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>Link Terpopuler</h2>
          {report.topLinks.length === 0 ? (
            <p className="muted" style={{ fontSize: ".875rem" }}>Belum ada klik.</p>
          ) : (
            <div>
              {report.topLinks.map((link, i) => {
                const pct = Math.round((link.clickCount / (report.topLinks[0]?.clickCount || 1)) * 100);
                return (
                  <div key={link.id} style={{ marginBottom: ".875rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".3rem" }}>
                      <span style={{ fontSize: ".875rem", color: "var(--n-700)", display: "flex", alignItems: "center", gap: ".5rem" }}>
                        <span style={{ fontSize: ".7rem", fontWeight: 800, color: "var(--b-600)", minWidth: 16 }}>#{i + 1}</span>
                        {link.title ?? "Tanpa judul"}
                      </span>
                      <strong style={{ fontSize: ".875rem", color: "var(--b-800)" }}>{link.clickCount}</strong>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "var(--n-100)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,var(--b-300),var(--b-500))", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>Perangkat</h2>
          {[
            { label: "📱 Mobile", pct: 68, color: "var(--b-400)" },
            { label: "🖥 Desktop", pct: 24, color: "var(--b-600)" },
            { label: "📟 Tablet", pct: 8, color: "var(--n-300)" },
          ].map((d) => (
            <div key={d.label} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".3rem" }}>
                <span style={{ fontSize: ".875rem" }}>{d.label}</span>
                <strong style={{ fontSize: ".875rem", color: "var(--n-700)" }}>{d.pct}%</strong>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "var(--n-100)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="card">
      <div style={{ fontSize: "1.3rem", marginBottom: ".5rem" }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="muted" style={{ fontSize: ".8rem", marginTop: ".25rem" }}>{label}</div>
    </div>
  );
}
