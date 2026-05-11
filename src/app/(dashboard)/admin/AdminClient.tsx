"use client";

import { useEffect, useState, useCallback } from "react";

type UserRow = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  emailVerified: string | null;
  createdAt: string;
  displayName: string | null;
  avatarUrl: string | null;
  pageCount: number;
};

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", color }}>
          <i className={`fa-solid ${icon}`} />
        </div>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)", fontFamily: "var(--fd)" }}>{value.toLocaleString()}</div>
          <div style={{ fontSize: ".8rem", color: "var(--n-500)" }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

export function AdminClient({ adminId }: { adminId: string }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [nukeConfirm, setNukeConfirm] = useState("");
  const [nukeOpen, setNukeOpen] = useState(false);
  const [nuking, setNuking] = useState(false);
  const [actionUser, setActionUser] = useState<string | null>(null);

  const stats = {
    users: users.filter((u) => u.role === "USER").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    pages: users.reduce((a, u) => a + Number(u.pageCount), 0),
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const json = await res.json();
    if (json.success) setUsers(json.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function deleteUser(userId: string, username: string) {
    if (!confirm(`Hapus user @${username}? Semua data mereka akan ikut terhapus.`)) return;
    setActionUser(userId);
    await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { "X-CSRF-Token": getCsrf() },
    });
    setActionUser(null);
    fetchUsers();
  }

  async function toggleRole(userId: string, currentRole: "USER" | "ADMIN") {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Ubah role menjadi ${newRole}?`)) return;
    setActionUser(userId);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "X-CSRF-Token": getCsrf(), "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setActionUser(null);
    fetchUsers();
  }

  async function nukeAll() {
    if (nukeConfirm !== "HAPUS SEMUA") return;
    setNuking(true);
    await fetch("/api/admin/nuke", {
      method: "POST",
      headers: { "X-CSRF-Token": getCsrf() },
    });
    setNuking(false);
    setNukeOpen(false);
    setNukeConfirm("");
    fetchUsers();
  }

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--b-900)", fontFamily: "var(--fd)" }}>
            <i className="fa-solid fa-shield-halved" style={{ color: "var(--b-500)", marginRight: ".5rem" }} />
            Admin Panel
          </span>
          <span style={{ fontSize: ".75rem", background: "#FEF3C7", color: "#92400E", padding: "2px 10px", borderRadius: 99, fontWeight: 600 }}>
            SUPERUSER
          </span>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={fetchUsers} className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-rotate-right" /> Refresh
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Title */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.8rem", fontWeight: 700, color: "var(--b-900)" }}>
            Manajemen Pengguna
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Kelola semua user, data, dan sistem bannana.id
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="Total User" value={stats.users} icon="fa-users" color="#3B82F6" />
          <StatCard label="Total Admin" value={stats.admins} icon="fa-user-shield" color="#8B5CF6" />
          <StatCard label="Total Halaman" value={stats.pages} icon="fa-table-columns" color="#10B981" />
        </div>

        {/* Users Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--n-200)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "var(--b-900)" }}>
              <i className="fa-solid fa-list" style={{ marginRight: ".5rem", color: "var(--b-500)" }} />
              Daftar Pengguna ({users.length})
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--n-400)" }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "1.5rem" }} />
              <div style={{ marginTop: ".75rem" }}>Memuat data...</div>
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--n-400)" }}>
              <i className="fa-solid fa-inbox" style={{ fontSize: "2rem", marginBottom: ".75rem", display: "block" }} />
              Belum ada pengguna
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--n-50)", borderBottom: "1px solid var(--n-200)" }}>
                    {["Pengguna", "Email", "Role", "Halaman", "Bergabung", "Aksi"].map((h) => (
                      <th key={h} style={{ padding: ".75rem 1rem", textAlign: "left", fontSize: ".8rem", fontWeight: 600, color: "var(--n-500)", textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--n-100)", transition: "background .15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--n-50)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                      <td style={{ padding: ".875rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%", background: "var(--b-100)", display: "flex",
                            alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0
                          }}>
                            {u.avatarUrl
                              ? <img src={u.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : <i className="fa-solid fa-user" style={{ color: "var(--b-500)", fontSize: ".85rem" }} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--b-900)", fontSize: ".9rem" }}>{u.displayName ?? u.username}</div>
                            <div style={{ fontSize: ".78rem", color: "var(--n-400)" }}>@{u.username}</div>
                          </div>
                          {u.id === adminId && (
                            <span style={{ fontSize: ".7rem", background: "var(--b-100)", color: "var(--b-600)", padding: "1px 8px", borderRadius: 99, fontWeight: 600 }}>Kamu</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)" }}>
                        <div>{u.email}</div>
                        {!u.emailVerified && (
                          <div style={{ fontSize: ".75rem", color: "#F59E0B", marginTop: ".2rem" }}>
                            <i className="fa-solid fa-circle-exclamation" /> Belum verifikasi
                          </div>
                        )}
                      </td>
                      <td style={{ padding: ".875rem 1rem" }}>
                        <span style={{
                          fontSize: ".75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                          background: u.role === "ADMIN" ? "#7C3AED20" : "var(--b-100)",
                          color: u.role === "ADMIN" ? "#7C3AED" : "var(--b-600)",
                        }}>
                          {u.role === "ADMIN" ? "ADMIN" : "USER"}
                        </span>
                      </td>
                      <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)", textAlign: "center" }}>
                        {Number(u.pageCount)}
                      </td>
                      <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-400)" }}>
                        {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: ".875rem 1rem" }}>
                        {u.id !== adminId ? (
                          <div style={{ display: "flex", gap: ".5rem" }}>
                            <button
                              onClick={() => toggleRole(u.id, u.role)}
                              disabled={actionUser === u.id}
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: ".75rem", padding: "4px 10px" }}
                              title={u.role === "ADMIN" ? "Jadikan User" : "Jadikan Admin"}
                            >
                              <i className={`fa-solid ${u.role === "ADMIN" ? "fa-user-minus" : "fa-user-shield"}`} />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id, u.username)}
                              disabled={actionUser === u.id}
                              className="btn btn-sm"
                              style={{ fontSize: ".75rem", padding: "4px 10px", background: "#FEE2E2", color: "#DC2626", border: "none" }}
                            >
                              {actionUser === u.id
                                ? <i className="fa-solid fa-spinner fa-spin" />
                                : <i className="fa-solid fa-trash" />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: ".8rem", color: "var(--n-300)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ marginTop: "2rem", border: "1.5px solid #FCA5A5", padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "#DC2626", fontSize: "1rem", marginBottom: ".5rem" }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: ".5rem" }} />
            Danger Zone
          </div>
          <p style={{ fontSize: ".875rem", color: "var(--n-600)", marginBottom: "1rem" }}>
            Hapus <strong>semua pengguna biasa</strong> beserta seluruh data mereka (halaman, blok, analytics). Akun admin tetap aman. Aksi ini tidak dapat dibatalkan.
          </p>
          <button
            onClick={() => setNukeOpen(true)}
            className="btn btn-sm"
            style={{ background: "#DC2626", color: "#fff", border: "none", fontWeight: 700 }}
          >
            <i className="fa-solid fa-bomb" /> Bersihkan Semua Data User
          </button>
        </div>
      </div>

      {/* Nuke Confirm Modal */}
      {nukeOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div className="card" style={{ maxWidth: 420, width: "100%", padding: "2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>💣</div>
              <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#DC2626" }}>Konfirmasi Reset Database</div>
              <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".5rem" }}>
                Semua data user biasa akan dihapus permanen. Aksi ini <strong>tidak bisa dibatalkan</strong>.
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--n-700)", display: "block", marginBottom: ".4rem" }}>
                Ketik <code style={{ background: "var(--n-100)", padding: "1px 6px", borderRadius: 4 }}>HAPUS SEMUA</code> untuk konfirmasi:
              </label>
              <input
                type="text"
                className="input"
                value={nukeConfirm}
                onChange={(e) => setNukeConfirm(e.target.value)}
                placeholder="HAPUS SEMUA"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button
                onClick={() => { setNukeOpen(false); setNukeConfirm(""); }}
                className="btn btn-ghost btn-lg"
                style={{ flex: 1 }}
                disabled={nuking}
              >
                Batal
              </button>
              <button
                onClick={nukeAll}
                className="btn btn-lg"
                style={{ flex: 1, background: "#DC2626", color: "#fff", border: "none", fontWeight: 700, opacity: nukeConfirm === "HAPUS SEMUA" ? 1 : 0.4 }}
                disabled={nukeConfirm !== "HAPUS SEMUA" || nuking}
              >
                {nuking ? <><i className="fa-solid fa-spinner fa-spin" /> Menghapus...</> : "Hapus Semua"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
