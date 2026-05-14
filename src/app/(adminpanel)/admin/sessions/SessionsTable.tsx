"use client";

import { useState } from "react";

export type SessionRow = {
  id: string;
  createdAt: string;
  expiresAt: string;
  userId: string;
  email: string;
  username: string;
  role: string;
  displayName: string;
  avatarUrl: string | null;
};

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function timeUntilExpiry(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}h ${hours}j lagi`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}j ${minutes}m lagi`;
  return `${minutes}m lagi`;
}

interface SessionsTableProps {
  sessions: SessionRow[];
}

export function SessionsTable({ sessions: initialSessions }: SessionsTableProps) {
  const [sessions, setSessions] = useState<SessionRow[]>(initialSessions);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function revokeSession(sessionId: string) {
    if (!confirm("Cabut sesi ini? Pengguna akan keluar dari perangkat tersebut.")) return;
    setRevoking(sessionId);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": getCsrf(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } finally {
      setRevoking(null);
    }
  }

  if (sessions.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--n-400)" }}>
        <i className="fa-solid fa-inbox" style={{ display: "block", fontSize: "2rem", marginBottom: ".75rem" }} />
        Tidak ada sesi aktif
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--n-50)", borderBottom: "1px solid var(--n-200)" }}>
            {["Pengguna", "Email", "Role", "Dimulai", "Kadaluarsa", "Aksi"].map((h) => (
              <th key={h} style={{
                padding: ".75rem 1rem", textAlign: "left", fontSize: ".75rem",
                fontWeight: 700, color: "var(--n-500)", textTransform: "uppercase", letterSpacing: ".06em",
                whiteSpace: "nowrap"
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} style={{ borderBottom: "1px solid var(--n-100)", transition: "background .15s" }}
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
                    {s.avatarUrl
                      ? <img src={s.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <i className="fa-solid fa-user" style={{ color: "var(--b-500)", fontSize: ".8rem" }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--b-900)", fontSize: ".875rem" }}>{s.displayName}</div>
                    <div style={{ fontSize: ".75rem", color: "var(--n-400)" }}>@{s.username}</div>
                  </div>
                </div>
              </td>

              <td style={{ padding: ".875rem 1rem", fontSize: ".875rem", color: "var(--n-600)" }}>
                {s.email}
              </td>

              <td style={{ padding: ".875rem 1rem" }}>
                <span style={{
                  borderRadius: 9999, padding: "3px 10px", fontSize: ".75rem", fontWeight: 700,
                  background: s.role === "ADMIN" ? "rgba(124,58,237,.12)" : "var(--n-100)",
                  color: s.role === "ADMIN" ? "#7C3AED" : "var(--n-600)"
                }}>
                  {s.role}
                </span>
              </td>

              <td style={{ padding: ".875rem 1rem", fontSize: ".8rem", color: "var(--n-500)", whiteSpace: "nowrap" }}>
                {formatDate(s.createdAt)}
              </td>

              <td style={{ padding: ".875rem 1rem" }}>
                <div style={{ fontSize: ".8rem", color: "var(--n-500)", whiteSpace: "nowrap" }}>
                  {formatDate(s.expiresAt)}
                </div>
                <div style={{ fontSize: ".72rem", color: "#10B981", marginTop: ".15rem" }}>
                  <i className="fa-solid fa-clock" style={{ marginRight: ".25rem" }} />
                  {timeUntilExpiry(s.expiresAt)}
                </div>
              </td>

              <td style={{ padding: ".875rem 1rem" }}>
                <button
                  onClick={() => revokeSession(s.id)}
                  disabled={revoking === s.id}
                  className="btn btn-sm"
                  style={{ fontSize: ".75rem", padding: "4px 12px", background: "#FEE2E2", color: "#DC2626", border: "none" }}
                >
                  {revoking === s.id
                    ? <><i className="fa-solid fa-spinner fa-spin" /> Mencabut...</>
                    : <><i className="fa-solid fa-ban" /> Cabut</>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
