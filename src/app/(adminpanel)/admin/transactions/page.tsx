export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { TransactionsTable, type TxRow } from "./TransactionsTable";

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
             s.currentPeriodStart, s.currentPeriodEnd, s.cancelledAt, s.createdAt, s.lastReminderAt,
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
      lastReminderAt: r.lastReminderAt ? new Date(r.lastReminderAt as string).toISOString() : null,
      email: r.email as string,
      username: r.username as string,
      displayName: r.displayName as string,
      avatarUrl: r.avatarUrl as string | null,
    }));
  } catch {
    transactions = [];
  }

  const activeProCount = transactions.filter((t) => t.status === "active" && t.plan === "pro").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <SummaryCard label="Total Transaksi" value={String(transactions.length)} border="#3B82F6" />
          <SummaryCard label="Pending" value={String(pendingCount)} border="#D97706" />
          <SummaryCard label="Aktif Pro" value={String(activeProCount)} border="#F59E0B" />
          <SummaryCard label="Est. MRR" value={formatRupiah(Math.round(mrr))} border="#059669" />
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--n-200)" }}>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)" }}>
              <i className="fa-solid fa-list" style={{ marginRight: ".5rem", color: "var(--b-500)" }} />
              Riwayat Transaksi ({transactions.length})
            </span>
          </div>
          <TransactionsTable transactions={transactions} />
        </div>
      </div>
    </>
  );
}

function SummaryCard({ label, value, border }: { label: string; value: string; border: string }) {
  return (
    <div style={{
      background: "#fff", border: "2px solid var(--b-100)", borderRadius: "var(--r-xl)",
      padding: "1.25rem", borderLeft: `4px solid ${border}`
    }}>
      <div style={{ fontSize: ".8rem", color: "var(--n-500)", marginBottom: ".3rem", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", fontWeight: 700, color: "var(--b-900)" }}>
        {value}
      </div>
    </div>
  );
}
