"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminShellProps {
  displayName: string;
  email: string;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: "fa-chart-pie", exact: true },
  { href: "/admin/users", label: "Pengguna", icon: "fa-users" },
  { href: "/admin/transactions", label: "Transaksi", icon: "fa-credit-card" },
  { href: "/admin/sessions", label: "Sesi", icon: "fa-mobile-screen" },
  { href: "/admin/seo", label: "SEO", icon: "fa-magnifying-glass-chart" },
];

export function AdminShell({ displayName, email, children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function logout() {
    const csrfToken = decodeURIComponent(
      document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
    );
    await fetch("/api/auth/logout", { method: "DELETE", headers: { "X-CSRF-Token": csrfToken } });
    location.href = "/login";
  }

  const closeNav = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <div className={`sb-overlay${sidebarOpen ? " open" : ""}`} onClick={closeNav} />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sb-logo" style={{ borderBottom: "1px solid rgba(251,191,36,.1)" }}>
          <span style={{ fontSize: "1.4rem" }}>🍌</span>
          <span>bannana</span>
          <span style={{ fontSize: ".6rem", fontWeight: 800, background: "#7C3AED", color: "#fff", padding: "2px 7px", borderRadius: 99, letterSpacing: ".05em", marginLeft: "auto" }}>
            ADMIN
          </span>
        </div>

        <div className="sb-user">
          <div className="sb-avatar" style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", flexShrink: 0 }}>
            <i className="fa-solid fa-user-shield" style={{ color: "#fff", fontSize: ".85rem" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-uname" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
            <div className="sb-handle" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
          </div>
          <span style={{ fontSize: ".6rem", fontWeight: 800, background: "rgba(124,58,237,.2)", color: "#A78BFA", padding: "2px 7px", borderRadius: 99, flexShrink: 0 }}>
            ADMIN
          </span>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Admin Panel</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sb-item${isActive(item.href, item.exact) ? " active" : ""}`}
              onClick={closeNav}
            >
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sb-bottom" style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
          <button
            onClick={logout}
            className="sb-item"
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#FCA5A5", textAlign: "left" }}
          >
            <i className="fa-solid fa-right-from-bracket" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Mobile top bar */}
        <div className="sb-mob-bar">
          <a href="/admin" className="sb-mob-logo">
            <span className="bana">🍌</span> bannana
            <span style={{ fontSize: ".6rem", fontWeight: 800, background: "#7C3AED", color: "#fff", padding: "1px 7px", borderRadius: 99, marginLeft: 6 }}>ADMIN</span>
          </a>
          <button className="mob-hamburger" aria-label="Buka menu" onClick={() => setSidebarOpen((v) => !v)}>
            <i className={`fa-solid ${sidebarOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
