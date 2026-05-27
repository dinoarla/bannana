"use client";

import { useState } from "react";

export type TxRow = {
  id: string;
  plan: string;
  status: string;
  billingCycle: string;
  midtransPaymentType: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
  lastReminderAt: string | null;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let bg = "var(--n-100)", color = "var(--n-600)";
  if (s === "active") { bg = "#D1FAE5"; color = "#065F46"; }
  else if (s === "cancelled" || s === "expired") { bg = "#FEE2E2"; color = "#DC2626"; }
  else if (s === "pending") { bg = "#FEF3C7"; color = "#D97706"; }
  return (
    <span style={{ borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700, background: bg, color }}>
      {status}
    </span>
  );
}

export function TransactionsTable({ transactions: initial }: { transactions: TxRow[] }) {
  const [transactions, setTransactions] = useState<TxRow[]>(initial);
  const [sending, setSending] = useState<string | null>(null);

  async function sendReminder(tx: TxRow) {
    if (!confirm(`Kirim reminder pembayaran ke ${tx.email}?`)) return;
    setSending(tx.id);
    try {
      const res = await fetch(`/api/admin/transactions/${tx.id}/remind`, {
        method: "POST",
        headers: { "X-CSRF-Token": getCsrf() },
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error?.message ?? "Gagal kirim reminder.");
        return;
      }
      const now = new Date().toISOString();
      setTransactions((prev) => prev.map((t) => (t.id === tx.id ? { ...t, lastReminderAt: now } : t)));
      alert(`Reminder terkirim ke ${tx.email}`);
    } catch {
      alert("Koneksi gagal. Coba lagi.");
    } finally {
      setSending(null);
    }
  }

  if (transactions.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--n-400)" }}>
        <i className="fa-solid fa-inbox" style={{ display: "block", fontSize: "2rem", marginBottom: ".75rem" }} />
        Belum ada transaksi
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--n-50)", borderBottom: "1px solid var(--n-200)" }}>
            {["Pengguna", "Email", "Plan", "Siklus", "Status", "Metode", "Periode", "Dibuat", "Aksi"].map((h) => (
              <th key={h} style={{
                padding: ".75rem 1rem", textAlign: "left", fontSize: ".75rem",
                fontWeight: 700, color: "var(--n-500)", textTransform: "uppercase", letterSpacing: ".06em",
                whiteSpace: "nowrap"
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} style={{ borderBottom: "1px solid var(--n-100)" }}>
              <td style={{ padding: ".875rem 1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: "var(--b-100)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", flexShrink: 0
                  }}>
                    {tx.avatarUrl
                      ? <img src={tx.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <i className="fa-solid fa-user" style={{ color: "var(--b-500)", fontSize: ".75rem" }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--b-900)", fontSize: ".875rem" }}>{tx.displayName}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--n-400)" }}>@{tx.username}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)", whiteSpace: "nowrap" }}>
                {tx.email}
              </td>
              <td style={{ padding: ".875rem 1rem" }}>
                {tx.plan === "pro"
                  ? <span style={{ borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700, background: "var(--b-100)", color: "var(--b-700)" }}>Pro</span>
                  : <span style={{ borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700, background: "var(--n-100)", color: "var(--n-600)" }}>{tx.plan}</span>}
              </td>
              <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)" }}>
                {tx.billingCycle === "yearly" ? "Tahunan" : "Bulanan"}
              </td>
              <td style={{ padding: ".875rem 1rem" }}>
                <StatusBadge status={tx.status} />
              </td>
              <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-500)" }}>
                {tx.midtransPaymentType ?? "—"}
              </td>
              <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-500)", whiteSpace: "nowrap" }}>
                {tx.currentPeriodStart && tx.currentPeriodEnd
                  ? `${formatDate(tx.currentPeriodStart)} → ${formatDate(tx.currentPeriodEnd)}`
                  : "—"}
              </td>
              <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-400)", whiteSpace: "nowrap" }}>
                {formatDate(tx.createdAt)}
              </td>
              <td style={{ padding: ".875rem 1rem", whiteSpace: "nowrap" }}>
                {tx.status === "pending" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button
                      onClick={() => sendReminder(tx)}
                      disabled={sending === tx.id}
                      style={{
                        background: "var(--b-500)", color: "var(--b-950)", border: "none",
                        padding: "6px 12px", borderRadius: 8, fontSize: ".75rem", fontWeight: 700,
                        cursor: sending === tx.id ? "wait" : "pointer", opacity: sending === tx.id ? 0.6 : 1,
                        display: "inline-flex", alignItems: "center", gap: 6,
                      }}
                    >
                      {sending === tx.id
                        ? <><i className="fa-solid fa-spinner fa-spin" /> Mengirim...</>
                        : <><i className="fa-solid fa-paper-plane" /> Kirim Reminder</>}
                    </button>
                    {tx.lastReminderAt && (
                      <span style={{ fontSize: ".68rem", color: "var(--n-400)" }}>
                        Terakhir: {relativeTime(tx.lastReminderAt)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span style={{ color: "var(--n-300)", fontSize: ".8rem" }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
