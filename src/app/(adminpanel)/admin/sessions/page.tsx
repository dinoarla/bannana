export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { SessionsTable } from "./SessionsTable";
import type { SessionRow } from "./SessionsTable";

export default async function AdminSessionsPage() {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  let sessions: SessionRow[] = [];
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.createdAt, s.expiresAt,
             u.id as userId, u.email, u.username, u.role,
             COALESCE(p.displayName, u.username) as displayName,
             p.avatarUrl
      FROM Session s
      JOIN User u ON u.id = s.userId
      LEFT JOIN Profile p ON p.userId = s.userId
      WHERE s.expiresAt > NOW()
      ORDER BY s.createdAt DESC
      LIMIT 200
    `);
    sessions = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      createdAt: (r.createdAt as Date).toISOString(),
      expiresAt: (r.expiresAt as Date).toISOString(),
      userId: r.userId as string,
      email: r.email as string,
      username: r.username as string,
      role: r.role as string,
      displayName: r.displayName as string,
      avatarUrl: r.avatarUrl as string | null,
    }));
  } catch {
    sessions = [];
  }

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-mobile-screen" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            Sesi Aktif
          </span>
        </div>
        <div style={{ marginLeft: "auto", fontSize: ".875rem", color: "var(--n-400)" }}>
          {sessions.length} sesi aktif
        </div>
      </div>

      <div className="page-content">
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)" }}>
            Sesi Aktif
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            {sessions.length} sesi login aktif — pantau dan cabut sesi yang mencurigakan
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{
            padding: "1rem 1.5rem", borderBottom: "1px solid var(--n-200)",
            display: "flex", alignItems: "center", gap: ".75rem"
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "#FFFBEB",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B"
            }}>
              <i className="fa-solid fa-mobile-screen" />
            </div>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)" }}>
              Daftar Sesi ({sessions.length})
            </span>
          </div>
          <SessionsTable sessions={sessions} />
        </div>
      </div>
    </>
  );
}
