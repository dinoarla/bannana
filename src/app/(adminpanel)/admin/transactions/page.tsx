export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

type TxRow = {
  id: string;
  plan: string;
  status: string;
  billingCycle: string;
  midtransPaymentType: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

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

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function AdminTransactionsPage() {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  let transactions: TxRow[] = [];
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.plan, s.status, s.billingCycle, s.midtransPaymentType,
             s.currentPeriodStart, s.currentPeriodEnd, s.cancelledAt, s.createdAt,
             u.email, u.username,
             COALESCE(p.displayName, u.username) as displayName,
             p.avatarUrl
      FROM Subscription s
      JOIN User u ON u.id = s.userId
      LEFT JOIN Profile p ON p.userId = s.userId
      ORDER BY s.createdAt DESC
      LIMIT 100
    `);
    transactions = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      plan: r.plan as string,
      status: r.status as string,
      billingCycle: r.billingCycle as string,
      midtransPaymentType: r.midtransPaymentType as string | null,
      currentPeriodStart: r.currentPeriodStart ? new Date(r.currentPeriodStart as string).toISOString() : null,
      currentPeriodEnd: r.currentPeriodEnd ? new Date(r.currentPeriodEnd as string).toISOString() : null,
      cancelledAt: r.cancelledAt ? new Date(r.cancelledAt as string).toISOString() : null,
      createdAt: (r.createdAt as Date).toISOString(),
      email: r.email as string,
      username: r.username as string,
      displayName: r.displayName as string,
      avatarUrl: r.avatarUrl as string | null,
    }));
  } catch {
    transactions = [];
  }

  const activeProCount = transactions.filter((t) => t.status === "active" && t.plan === "pro").length;
  const mrr = transactions
    .filter((t) => t.status === "active" && t.plan === "pro")
    .reduce((sum, t) => sum + (t.billingCycle === "yearly" ? 150000 / 12 : 15000), 0);

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-credit-card" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            Transaksi
          </span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)" }}>
            Transaksi &amp; Langganan
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Riwayat semua transaksi dan status langganan
          </div>
        </div>

        {/* Summary bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{
            background: "#fff", border: "2px solid var(--b-100)", borderRadius: "var(--r-xl)",
            padding: "1.25rem", borderLeft: "4px solid #3B82F6"
          }}>
            <div style={{ fontSize: ".8rem", color: "var(--n-500)", marginBottom: ".3rem", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>
              Total Transaksi
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", fontWeight: 700, color: "var(--b-900)" }}>
              {transactions.length}
            </div>
          </div>
          <div style={{
            background: "#fff", border: "2px solid var(--b-100)", borderRadius: "var(--r-xl)",
            padding: "1.25rem", borderLeft: "4px solid #D97706"
          }}>
            <div style={{ fontSize: ".8rem", color: "var(--n-500)", marginBottom: ".3rem", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>
              Aktif Pro
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", fontWeight: 700, color: "var(--b-900)" }}>
              {activeProCount}
            </div>
          </div>
          <div style={{
            background: "#fff", border: "2px solid var(--b-100)", borderRadius: "var(--r-xl)",
            padding: "1.25rem", borderLeft: "4px solid #059669"
          }}>
            <div style={{ fontSize: ".8rem", color: "var(--n-500)", marginBottom: ".3rem", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>
              Est. MRR
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", fontWeight: 700, color: "var(--b-900)" }}>
              {formatRupiah(Math.round(mrr))}
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--n-200)" }}>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)" }}>
              <i className="fa-solid fa-list" style={{ marginRight: ".5rem", color: "var(--b-500)" }} />
              Riwayat Transaksi ({transactions.length})
            </span>
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--n-400)" }}>
              <i className="fa-solid fa-inbox" style={{ display: "block", fontSize: "2rem", marginBottom: ".75rem" }} />
              Belum ada transaksi
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--n-50)", borderBottom: "1px solid var(--n-200)" }}>
                    {["Pengguna", "Email", "Plan", "Siklus", "Status", "Metode", "Periode", "Dibuat"].map((h) => (
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
                    <tr key={tx.id} style={{ borderBottom: "1px solid var(--n-100)", transition: "background .15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--n-50)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}>

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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
