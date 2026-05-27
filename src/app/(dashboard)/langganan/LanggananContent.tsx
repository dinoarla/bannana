"use client";

import { useState, useEffect } from "react";

type SubStatus = {
  plan: string;
  status: string;
  billingCycle: string | null;
  midtransPaymentType: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
};

type Props = { csrfToken: string };

const PRO_FEATURES = [
  { icon: "fa-solid fa-infinity", label: "Halaman tak terbatas" },
  { icon: "fa-solid fa-cubes-stacked", label: "Blok tak terbatas per halaman" },
  { icon: "fa-solid fa-palette", label: "12+ tema premium" },
  { icon: "fa-solid fa-code", label: "Custom CSS editor" },
  { icon: "fa-solid fa-chart-line", label: "Analytics 90 hari retensi" },
  { icon: "fa-solid fa-file-csv", label: "Export data CSV" },
  { icon: "fa-solid fa-plug", label: "REST API access" },
  { icon: "fa-solid fa-headset", label: "Priority support" },
];

const COMPARISON_ROWS = [
  { label: "Jumlah halaman", free: "1", pro: "Tak terbatas" },
  { label: "Blok per halaman", free: "10", pro: "Tak terbatas" },
  { label: "Tema preset", free: "3 tema", pro: "12+ tema" },
  { label: "Custom CSS", free: false, pro: true },
  { label: "Analytics dasar", free: true, pro: true },
  { label: "Retensi data analytics", free: "7 hari", pro: "90 hari" },
  { label: "Export CSV", free: false, pro: true },
  { label: "REST API access", free: false, pro: true },
  { label: "Priority support", free: false, pro: true },
];

export function LanggananContent({ csrfToken }: Props) {
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setSub(j.data);
          if (j.data?.billingCycle) setCycle(j.data.billingCycle);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function checkout() {
    setPaying(true);
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify({ billingCycle: cycle }),
      });
      const json = await res.json();
      if (!json.success) { alert(json.error?.message ?? "Gagal memulai pembayaran."); return; }
      const { snapToken, clientKey, isProduction } = json.data as { snapToken: string; clientKey: string; isProduction: boolean };
      const snapSrc = isProduction
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
      if (!document.querySelector(`script[src="${snapSrc}"]`)) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = snapSrc;
          s.setAttribute("data-client-key", clientKey);
          s.onload = () => resolve();
          s.onerror = () => reject();
          document.head.appendChild(s);
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(snapToken, {
        onSuccess: () => { setMsg("Pembayaran berhasil! Halaman akan diperbarui…"); setTimeout(() => window.location.reload(), 2000); },
        onPending: () => { setMsg("Pembayaran sedang diproses. Cek email kamu untuk konfirmasi."); },
        onError: (result: unknown) => { console.error(result); alert("Pembayaran gagal. Silakan coba lagi."); },
        onClose: () => {},
      });
    } catch { alert("Gagal terhubung ke server pembayaran."); }
    finally { setPaying(false); }
  }

  async function cancel() {
    if (!confirm("Yakin ingin membatalkan langganan? Akses Pro akan berakhir di akhir periode.")) return;
    await fetch("/api/subscription/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    });
    window.location.reload();
  }

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", color: "var(--n-400)", fontSize: ".9rem" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} /> Memuat info langganan...
      </div>
    );
  }

  const isPro = sub?.plan === "pro" && sub?.status === "active";
  const isPending = sub?.plan === "pro" && sub?.status === "pending";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* PENDING PAYMENT BANNER */}
      {isPending && (
        <div style={{
          background: "#FFFBEB", border: "2px solid #F59E0B", borderRadius: 20, padding: "1.5rem 2rem",
          display: "flex", flexDirection: "column", gap: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FDE68A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="fa-solid fa-clock" style={{ color: "#D97706", fontSize: "1.1rem" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "#92400E", fontSize: "1.05rem", marginBottom: ".25rem" }}>
                Pembayaran menunggu konfirmasi
              </div>
              <div style={{ fontSize: ".875rem", color: "#78350F", lineHeight: 1.6 }}>
                Kamu sudah memilih paket <strong>Pro {sub?.billingCycle === "yearly" ? "Tahunan" : "Bulanan"}</strong>{" "}
                ({sub?.billingCycle === "yearly" ? "Rp 150.000 / tahun" : "Rp 15.000 / bulan"}) tapi pembayarannya belum selesai.
                Klik tombol di bawah untuk melanjutkan.
              </div>
            </div>
          </div>

          {msg && (
            <div style={{ background: "#D1FAE5", borderRadius: 10, padding: ".75rem 1rem", fontSize: ".875rem", color: "#065F46", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <i className="fa-solid fa-check" /> {msg}
            </div>
          )}

          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={checkout}
              disabled={paying}
              style={{ flex: 1, minWidth: 180, height: 44, borderRadius: 12, fontSize: ".9rem", fontWeight: 700 }}
            >
              {paying
                ? <><i className="fa-solid fa-spinner fa-spin" /> Memproses…</>
                : <><i className="fa-solid fa-crown" /> Lanjutkan Pembayaran</>}
            </button>
            <button
              onClick={cancel}
              style={{
                background: "none", border: "1.5px solid #D97706", color: "#D97706",
                padding: "0 1.25rem", borderRadius: 12, fontSize: ".875rem", fontWeight: 700,
                cursor: "pointer", height: 44, whiteSpace: "nowrap"
              }}
            >
              <i className="fa-solid fa-xmark" style={{ marginRight: ".4rem" }} />
              Batalkan
            </button>
          </div>
        </div>
      )}

      {/* STATUS CARD */}
      {isPro ? (
        <div style={{ background: "linear-gradient(135deg,#FFFBEB,var(--b-50))", border: "2px solid var(--b-300)", borderRadius: 20, padding: "1.75rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontFamily: "var(--fd)", fontSize: "1.6rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 10 }}>
                <i className="fa-solid fa-crown" style={{ color: "var(--b-500)" }} /> Pro Plan
              </div>
              <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: 4 }}>
                {sub?.billingCycle === "yearly" ? "Rp 150.000 / tahun" : "Rp 15.000 / bulan"}
              </div>
            </div>
            <span className="plan-badge" style={{ fontSize: ".85rem", padding: "6px 16px" }}>
              <i className="fa-solid fa-star" /> AKTIF
            </span>
          </div>

          {/* Details grid */}
          <div style={{ background: "rgba(255,255,255,.7)", border: "1.5px solid var(--b-200)", borderRadius: 14, padding: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--b-800)", marginBottom: ".875rem", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="fa-solid fa-circle-info" style={{ color: "var(--b-500)" }} /> Detail Langganan
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".875rem", fontSize: ".82rem", color: "var(--n-700)" }}>
              <div>
                <span style={{ color: "var(--n-400)", fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".02em" }}>Periode mulai</span>
                <div style={{ fontWeight: 700, color: "var(--b-900)", marginTop: 3 }}>{fmt(sub?.currentPeriodStart ?? null)}</div>
              </div>
              <div>
                <span style={{ color: "var(--n-400)", fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".02em" }}>Berlaku hingga</span>
                <div style={{ fontWeight: 700, color: "var(--b-900)", marginTop: 3 }}>{fmt(sub?.currentPeriodEnd ?? null)}</div>
              </div>
              <div>
                <span style={{ color: "var(--n-400)", fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".02em" }}>Siklus tagihan</span>
                <div style={{ fontWeight: 700, color: "var(--b-900)", marginTop: 3 }}>{sub?.billingCycle === "yearly" ? "Tahunan" : "Bulanan"}</div>
              </div>
              <div>
                <span style={{ color: "var(--n-400)", fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".02em" }}>Metode bayar</span>
                <div style={{ fontWeight: 700, color: "var(--b-900)", marginTop: 3 }}>{sub?.midtransPaymentType ?? "-"}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-danger btn-sm" onClick={cancel}>
              <i className="fa-solid fa-xmark" /> Cancel Langganan
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 20, padding: "1.75rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".375rem" }}>
            <div style={{ fontFamily: "var(--fd)", fontSize: "1.6rem", fontWeight: 700, color: "var(--b-900)" }}>Gratis</div>
            <span style={{ background: "var(--n-100)", color: "var(--n-600)", borderRadius: 9999, padding: "5px 14px", fontSize: ".78rem", fontWeight: 700 }}>FREE</span>
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)" }}>Paket saat ini</div>
        </div>
      )}

      {/* COMPARISON TABLE (shown for free users) */}
      {!isPro && (
        <div style={{ background: "linear-gradient(135deg,var(--b-50),#FFFBEB)", border: "1.5px solid var(--b-200)", borderRadius: 20, padding: "1.75rem 2rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)", marginBottom: "1.25rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-rocket" style={{ color: "var(--b-500)" }} /> Upgrade ke Pro — perbandingan fitur
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".84rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", color: "var(--n-500)", fontWeight: 600, paddingBottom: ".625rem", width: "55%" }}>Fitur</th>
                <th style={{ textAlign: "center", color: "var(--n-500)", fontWeight: 600, paddingBottom: ".625rem" }}>Gratis</th>
                <th style={{ textAlign: "center", color: "var(--b-700)", fontWeight: 700, paddingBottom: ".625rem" }}>Pro ⭐</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} style={{ borderTop: "1px solid var(--b-100)" }}>
                  <td style={{ padding: ".5rem 0", color: "var(--n-700)" }}>{row.label}</td>
                  <td style={{ textAlign: "center", padding: ".5rem 0" }}>
                    {typeof row.free === "boolean"
                      ? row.free
                        ? <i className="fa-solid fa-check" style={{ color: "var(--success-600)" }} />
                        : <i className="fa-solid fa-xmark" style={{ color: "var(--n-300)" }} />
                      : <span style={{ color: "var(--n-600)", fontWeight: 500 }}>{row.free}</span>}
                  </td>
                  <td style={{ textAlign: "center", padding: ".5rem 0", background: "rgba(251,191,36,.08)", borderRadius: 4 }}>
                    {typeof row.pro === "boolean"
                      ? row.pro
                        ? <i className="fa-solid fa-check" style={{ color: "var(--b-600)" }} />
                        : <i className="fa-solid fa-xmark" style={{ color: "var(--n-300)" }} />
                      : <span style={{ color: "var(--b-800)", fontWeight: 700 }}>{row.pro}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cycle selector */}
          <div className="billing-cycle-selector" style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                style={{
                  flex: 1, minHeight: 48, borderRadius: 12,
                  border: `2px solid ${cycle === c ? "var(--b-500)" : "var(--n-200)"}`,
                  background: cycle === c ? "var(--b-500)" : "var(--n-0)",
                  color: cycle === c ? "var(--b-950)" : "var(--n-700)",
                  fontWeight: 700, fontSize: ".875rem", cursor: "pointer",
                  transition: "all .15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: ".625rem 1rem", whiteSpace: "nowrap",
                }}
              >
                {c === "monthly" ? "Bulanan · Rp 15K" : "Tahunan · Rp 150K"}
                {c === "yearly" && (
                  <span style={{ fontSize: ".7rem", background: "#D1FAE5", color: "#065F46", borderRadius: 5, padding: "2px 6px", fontWeight: 700, flexShrink: 0 }}>
                    HEMAT 17%
                  </span>
                )}
              </button>
            ))}
          </div>

          {msg && (
            <div style={{ background: "#D1FAE5", borderRadius: 10, padding: ".875rem 1rem", fontSize: ".875rem", color: "#065F46", marginBottom: ".875rem" }}>
              <i className="fa-solid fa-check" style={{ marginRight: 6 }} /> {msg}
            </div>
          )}

          <button
            className="btn btn-primary btn-sm"
            onClick={checkout}
            disabled={paying}
            style={{ width: "100%", height: 50, borderRadius: 12, fontSize: "1rem", fontWeight: 700 }}
          >
            {paying
              ? <><i className="fa-solid fa-spinner fa-spin" /> Memproses…</>
              : <><i className="fa-solid fa-crown" /> Bayar Sekarang</>}
          </button>
        </div>
      )}

      {/* PRO FEATURES PANEL — shown when user is Pro */}
      {isPro && (
        <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 20, padding: "1.75rem 2rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)", fontSize: "1.05rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-sparkles" style={{ color: "var(--b-500)" }} /> Fitur Pro yang aktif
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: ".75rem" }}>
            {PRO_FEATURES.map((feat) => (
              <div
                key={feat.label}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: ".75rem 1rem",
                  background: "var(--b-50)", border: "1.5px solid var(--b-100)", borderRadius: 12,
                  fontSize: ".84rem", color: "var(--n-800)",
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--b-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-600)", flexShrink: 0, fontSize: ".78rem" }}>
                  <i className={feat.icon} />
                </div>
                <span style={{ fontWeight: 600 }}>{feat.label}</span>
                <i className="fa-solid fa-check" style={{ color: "var(--success-600)", marginLeft: "auto", fontSize: ".78rem" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
