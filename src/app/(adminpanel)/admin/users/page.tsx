export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { UsersTable } from "./UsersTable";
import type { UserRow } from "./UsersTable";

export default async function AdminUsersPage() {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  let users: UserRow[] = [];
  try {
    const [rows] = await db.query(`
      SELECT
        u.id, u.email, u.username, u.role,
        u.emailVerified, u.createdAt,
        COALESCE(p.displayName, u.username) as displayName,
        p.avatarUrl,
        COUNT(DISTINCT pg.id) AS pageCount,
        MAX(CASE WHEN sub.status = 'active' THEN sub.plan ELSE NULL END) as plan
      FROM User u
      LEFT JOIN Profile p ON p.userId = u.id
      LEFT JOIN Page pg ON pg.userId = u.id
      LEFT JOIN Subscription sub ON sub.userId = u.id AND sub.status = 'active'
      GROUP BY u.id, p.displayName, p.avatarUrl
      ORDER BY u.createdAt DESC
    `);
    users = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      email: r.email as string,
      username: r.username as string,
      role: r.role as "USER" | "ADMIN",
      emailVerified: r.emailVerified as string | null,
      createdAt: (r.createdAt as Date).toISOString(),
      displayName: (r.displayName as string) ?? (r.username as string),
      avatarUrl: r.avatarUrl as string | null,
      pageCount: Number(r.pageCount ?? 0),
      plan: r.plan as string | null,
    }));
  } catch {
    // Subscription table may not exist — try without it
    try {
      const [rows] = await db.query(`
        SELECT
          u.id, u.email, u.username, u.role,
          u.emailVerified, u.createdAt,
          COALESCE(p.displayName, u.username) as displayName,
          p.avatarUrl,
          COUNT(DISTINCT pg.id) AS pageCount
        FROM User u
        LEFT JOIN Profile p ON p.userId = u.id
        LEFT JOIN Page pg ON pg.userId = u.id
        GROUP BY u.id, p.displayName, p.avatarUrl
        ORDER BY u.createdAt DESC
      `);
      users = (rows as Record<string, unknown>[]).map((r) => ({
        id: r.id as string,
        email: r.email as string,
        username: r.username as string,
        role: r.role as "USER" | "ADMIN",
        emailVerified: r.emailVerified as string | null,
        createdAt: (r.createdAt as Date).toISOString(),
        displayName: (r.displayName as string) ?? (r.username as string),
        avatarUrl: r.avatarUrl as string | null,
        pageCount: Number(r.pageCount ?? 0),
        plan: null,
      }));
    } catch {
      users = [];
    }
  }

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-users" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            Manajemen Pengguna
          </span>
        </div>
        <div style={{ marginLeft: "auto", fontSize: ".875rem", color: "var(--n-400)" }}>
          {users.length} pengguna terdaftar
        </div>
      </div>

      <div className="page-content">
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)" }}>
            Pengguna
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Kelola semua akun pengguna bannana.id
          </div>
        </div>

        <UsersTable users={users} adminId={admin.id} />
      </div>
    </>
  );
}
