"use client";

import { useState } from "react";

export type UserRow = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  emailVerified: string | null;
  createdAt: string;
  displayName: string;
  avatarUrl: string | null;
  pageCount: number;
  plan: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: string | null;
  billingCycle: string | null;
};

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

interface UsersTableProps {
  users: UserRow[];
  adminId: string;
}

export function UsersTable({ users: initialUsers, adminId }: UsersTableProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [actionUser, setActionUser] = useState<string | null>(null);
  const [reminding, setReminding] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q)
    );
  });

  async function deleteUser(userId: string, username: string) {
    if (!confirm(`Hapus user @${username}? Semua data mereka akan ikut terhapus.`)) return;
    setActionUser(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": getCsrf() },
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } finally {
      setActionUser(null);
    }
  }

  async function toggleRole(userId: string, currentRole: "USER" | "ADMIN") {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Ubah role menjadi ${newRole}?`)) return;
    setActionUser(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "X-CSRF-Token": getCsrf(), "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } finally {
      setActionUser(null);
    }
  }

  async function sendRenewalReminder(u: UserRow) {
    if (!confirm(`Kirim reminder perpanjangan ke ${u.email}?`)) return;
    setReminding(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}/renewal-remind`, {
        method: "POST",
        headers: { "X-CSRF-Token": getCsrf() },
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error?.message ?? "Gagal kirim reminder.");
        return;
      }
      alert(`Reminder perpanjangan terkirim ke ${u.email}`);
    } catch {
      alert("Koneksi gagal. Coba lagi.");
    } finally {
      setReminding(null);
    }
  }

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ position: "relative", maxWidth: 320 }}>
          <i className="fa-solid fa-magnifying-glass" style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--n-400)", fontSize: ".85rem", pointerEvents: "none"
          }} />
          <input
            type="text"
            className="input"
            placeholder="Cari username, email, nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.25rem", height: 38, fontSize: ".875rem" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          padding: "1rem 1.5rem", borderBottom: "1px solid var(--n-200)",
          display: "flex", alignItems: "center", gap: ".5rem"
        }}>
          <i className="fa-solid fa-users" style={{ color: "var(--b-500)" }} />
          <span style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)" }}>
            Pengguna ({filtered.length})
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--n-50)", borderBottom: "1px solid var(--n-200)" }}>
                {["Pengguna", "Email", "Role", "Plan & Langganan", "Halaman", "Bergabung", "Aksi"].map((h) => (
                  <th key={h} style={{
                    padding: ".75rem 1rem", textAlign: "left", fontSize: ".75rem",
                    fontWeight: 700, color: "var(--n-500)", textTransform: "uppercase", letterSpacing: ".06em",
                    whiteSpace: "nowrap"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "var(--n-400)" }}>
                    <i className="fa-solid fa-inbox" style={{ display: "block", fontSize: "1.5rem", marginBottom: ".5rem" }} />
                    {search ? "Tidak ditemukan hasil pencarian." : "Belum ada pengguna."}
                  </td>
                </tr>
              ) : filtered.map((u) => {
                const days = daysUntil(u.currentPeriodEnd);
                const isExpiringSoon = days !== null && days <= 7 && days >= 0;
                const isExpired = days !== null && days < 0;

                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--n-100)", transition: "background .15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--n-50)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}>

                    {/* Avatar + Name */}
                    <td style={{ padding: ".875rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%", background: "var(--b-100)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          overflow: "hidden", flexShrink: 0
                        }}>
                          {u.avatarUrl
                            ? <img src={u.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <i className="fa-solid fa-user" style={{ color: "var(--b-500)", fontSize: ".8rem" }} />}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                            <span style={{ fontWeight: 600, color: "var(--b-900)", fontSize: ".875rem" }}>{u.displayName}</span>
                            {u.id === adminId && (
                              <span style={{ fontSize: ".65rem", background: "var(--b-100)", color: "var(--b-600)", padding: "1px 7px", borderRadius: 99, fontWeight: 700 }}>Kamu</span>
                            )}
                          </div>
                          <div style={{ fontSize: ".75rem", color: "var(--n-400)" }}>@{u.username}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)" }}>
                      <div>{u.email}</div>
                      {!u.emailVerified && (
                        <div style={{ fontSize: ".72rem", color: "#F59E0B", marginTop: ".15rem" }}>
                          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: ".25rem" }} />
                          Belum verifikasi
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td style={{ padding: ".875rem 1rem" }}>
                      <span style={{
                        borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700,
                        background: u.role === "ADMIN" ? "rgba(124,58,237,.12)" : "var(--n-100)",
                        color: u.role === "ADMIN" ? "#7C3AED" : "var(--n-600)"
                      }}>
                        {u.role}
                      </span>
                    </td>

                    {/* Plan & Subscription */}
                    <td style={{ padding: ".875rem 1rem", minWidth: 160 }}>
                      {u.plan === "pro" ? (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginBottom: ".35rem" }}>
                            <span style={{ borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700, background: "var(--b-100)", color: "var(--b-700)" }}>Pro</span>
                            <span style={{ fontSize: ".72rem", color: "var(--n-400)" }}>
                              {u.billingCycle === "yearly" ? "Tahunan" : "Bulanan"}
                            </span>
                          </div>
                          {u.currentPeriodEnd && (
                            <div style={{
                              fontSize: ".72rem", fontWeight: 600,
                              color: isExpired ? "#DC2626" : isExpiringSoon ? "#D97706" : "var(--n-500)",
                              display: "flex", alignItems: "center", gap: ".3rem"
                            }}>
                              {isExpired ? (
                                <><i className="fa-solid fa-circle-xmark" /> Berakhir {formatDate(u.currentPeriodEnd)}</>
                              ) : isExpiringSoon ? (
                                <><i className="fa-solid fa-triangle-exclamation" /> Habis {days === 0 ? "hari ini" : `${days} hari lagi`} ({formatDate(u.currentPeriodEnd)})</>
                              ) : (
                                <><i className="fa-regular fa-calendar" /> s/d {formatDate(u.currentPeriodEnd)}</>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700, background: "var(--n-100)", color: "var(--n-600)" }}>Gratis</span>
                      )}
                    </td>

                    {/* Page count */}
                    <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)", textAlign: "center" }}>
                      {Number(u.pageCount)}
                    </td>

                    {/* Joined */}
                    <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-400)", whiteSpace: "nowrap" }}>
                      {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: ".875rem 1rem" }}>
                      {u.id !== adminId ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                          <div style={{ display: "flex", gap: ".4rem" }}>
                            <button
                              onClick={() => toggleRole(u.id, u.role)}
                              disabled={!!actionUser}
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: ".75rem", padding: "4px 10px" }}
                              title={u.role === "ADMIN" ? "Jadikan User" : "Jadikan Admin"}
                            >
                              <i className={`fa-solid ${u.role === "ADMIN" ? "fa-user-minus" : "fa-user-shield"}`} />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id, u.username)}
                              disabled={!!actionUser}
                              className="btn btn-sm"
                              style={{ fontSize: ".75rem", padding: "4px 10px", background: "#FEE2E2", color: "#DC2626", border: "none" }}
                            >
                              {actionUser === u.id
                                ? <i className="fa-solid fa-spinner fa-spin" />
                                : <i className="fa-solid fa-trash" />}
                            </button>
                          </div>
                          {u.plan === "pro" && (
                            <button
                              onClick={() => sendRenewalReminder(u)}
                              disabled={reminding === u.id}
                              style={{
                                background: isExpiringSoon || isExpired ? "#FEF3C7" : "var(--n-100)",
                                color: isExpiringSoon || isExpired ? "#D97706" : "var(--n-500)",
                                border: `1px solid ${isExpiringSoon || isExpired ? "#FDE68A" : "var(--n-200)"}`,
                                padding: "4px 10px", borderRadius: 8, fontSize: ".72rem", fontWeight: 700,
                                cursor: reminding === u.id ? "wait" : "pointer",
                                opacity: reminding === u.id ? 0.6 : 1,
                                display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap"
                              }}
                            >
                              {reminding === u.id
                                ? <><i className="fa-solid fa-spinner fa-spin" /> Mengirim...</>
                                : <><i className="fa-solid fa-bell" /> Kirim Renewal</>}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: ".8rem", color: "var(--n-300)" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
