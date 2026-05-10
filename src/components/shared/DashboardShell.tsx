"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserWithProfile } from "@/types/db.types";

export function DashboardShell({ user, children }: { user: UserWithProfile; children: React.ReactNode }) {
  const pathname = usePathname();
  const displayName = user.profile?.displayName ?? user.username;

  async function logout() {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bid_csrf="))
      ?.split("=")[1] ?? "";
    await fetch("/api/auth/logout", {
      method: "DELETE",
      headers: { "X-CSRF-Token": decodeURIComponent(csrfToken) },
    });
    location.href = "/login";
  }

  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="sb-logo">
          <span className="bana">🍌</span> bannana
        </Link>

        <div className="sb-user">
          <div className="sb-avatar"><i className="fa-solid fa-user" /></div>
          <div>
            <div className="sb-uname">{displayName}</div>
            <div className="sb-handle">@{user.username}</div>
          </div>
          <span className="sb-badge" style={{ background: "var(--b-500)", color: "var(--b-950)" }}>PRO</span>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Menu Utama</div>
          <Link href="/dashboard" className={`sb-item${isActive("/dashboard") ? " active" : ""}`}>
            <i className="fa-solid fa-house" /> Dashboard
          </Link>
          <Link href="/pages" className={`sb-item${isActive("/pages") ? " active" : ""}`}>
            <i className="fa-solid fa-table-columns" /> Halaman Saya
          </Link>
          <Link href="/analytics" className={`sb-item${isActive("/analytics") ? " active" : ""}`}>
            <i className="fa-solid fa-chart-line" /> Analytics
          </Link>

          <div className="sb-section">Kustomisasi</div>
          <Link href="/themes" className={`sb-item${isActive("/themes") ? " active" : ""}`}>
            <i className="fa-solid fa-palette" /> Tema
          </Link>

          <div className="sb-section">Akun</div>
          <Link href="/settings" className={`sb-item${isActive("/settings") ? " active" : ""}`}>
            <i className="fa-solid fa-gear" /> Pengaturan
          </Link>
          <Link href="/pricing" className="sb-item">
            <i className="fa-solid fa-crown" style={{ color: "var(--b-400)" }} /> Upgrade Pro
          </Link>
        </nav>

        <div className="sb-bottom">
          <button onClick={logout} className="sb-item" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#FCA5A5" }}>
            <i className="fa-solid fa-right-from-bracket" /> Keluar
          </button>
        </div>
      </aside>

      <div className="main-area">{children}</div>
    </div>
  );
}
