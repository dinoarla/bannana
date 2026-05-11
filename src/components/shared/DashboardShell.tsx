"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { UserWithProfile } from "@/types/db.types";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export function DashboardShell({ user, children }: { user: UserWithProfile; children: React.ReactNode }) {
  const pathname = usePathname();
  const displayName = user.profile?.displayName ?? user.username;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const closeNav = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      {/* Mobile sidebar overlay */}
      <div className={`sb-overlay${sidebarOpen ? " open" : ""}`} onClick={closeNav} />

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <Link href="/" className="sb-logo" onClick={closeNav}>
          <span className="bana">🍌</span> bannana
        </Link>

        <div className="sb-user">
          <div className="sb-avatar" style={{ overflow: "hidden", padding: user.profile?.avatarUrl ? 0 : undefined }}>
            {user.profile?.avatarUrl
              ? <img src={user.profile.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : <i className="fa-solid fa-user" />}
          </div>
          <div>
            <div className="sb-uname">{displayName}</div>
            <div className="sb-handle">@{user.username}</div>
          </div>
          {user.role === "ADMIN"
            ? <span className="sb-badge" style={{ background: "#7C3AED", color: "#fff" }}>ADMIN</span>
            : <span className="sb-badge" style={{ background: "var(--n-200)", color: "var(--n-600)" }}>Gratis</span>
          }
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Menu Utama</div>
          <Link href="/dashboard" className={`sb-item${isActive("/dashboard") ? " active" : ""}`} onClick={closeNav}>
            <i className="fa-solid fa-house" /> Dashboard
          </Link>
          <Link href="/pages" className={`sb-item${isActive("/pages") ? " active" : ""}`} onClick={closeNav}>
            <i className="fa-solid fa-table-columns" /> Halaman Saya
          </Link>
          <Link href="/analytics" className={`sb-item${isActive("/analytics") ? " active" : ""}`} onClick={closeNav}>
            <i className="fa-solid fa-chart-line" /> Analytics
          </Link>

          <div className="sb-section">Kustomisasi</div>
          <Link href="/themes" className={`sb-item${isActive("/themes") ? " active" : ""}`} onClick={closeNav}>
            <i className="fa-solid fa-palette" /> Tema
          </Link>

          <div className="sb-section">Akun</div>
          <Link href="/settings" className={`sb-item${isActive("/settings") ? " active" : ""}`} onClick={closeNav}>
            <i className="fa-solid fa-gear" /> Pengaturan
          </Link>
          <Link href="/settings?tab=langganan" className="sb-item" onClick={closeNav}>
            <i className="fa-solid fa-crown" style={{ color: "var(--b-400)" }} /> Upgrade Pro
          </Link>
          {user.role === "ADMIN" && (
            <>
              <div className="sb-section">Admin</div>
              <Link href="/admin" className={`sb-item${isActive("/admin") ? " active" : ""}`} style={{ color: "#7C3AED" }} onClick={closeNav}>
                <i className="fa-solid fa-shield-halved" /> Admin Panel
              </Link>
            </>
          )}
        </nav>

        <div className="sb-bottom">
          <button onClick={logout} className="sb-item" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#FCA5A5" }}>
            <i className="fa-solid fa-right-from-bracket" /> Keluar
          </button>
        </div>
      </aside>

      <div className="main-area">
        {/* Mobile top bar — only visible on small screens */}
        <div className="sb-mob-bar">
          <Link href="/dashboard" className="sb-mob-logo" onClick={closeNav}>
            <span className="bana">🍌</span> bannana
          </Link>
          <button className="mob-hamburger" aria-label="Buka menu" onClick={() => setSidebarOpen((v) => !v)}>
            <i className={`fa-solid ${sidebarOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
        {children}
      </div>

      <OnboardingModal userId={user.id} username={user.username} />
    </div>
  );
}
