"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  displayName: string;
  email: string;
}

export function AdminSidebar({ displayName, email }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function logout() {
    const csrfToken = decodeURIComponent(
      document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
    );
    await fetch("/api/auth/logout", {
      method: "DELETE",
      headers: { "X-CSRF-Token": csrfToken },
    });
    location.href = "/login";
  }

  const navItems = [
    { href: "/admin", label: "Overview", icon: "fa-chart-pie", exact: true },
    { href: "/admin/users", label: "Pengguna", icon: "fa-users" },
    { href: "/admin/transactions", label: "Transaksi", icon: "fa-credit-card" },
    { href: "/admin/sessions", label: "Sesi", icon: "fa-mobile-screen" },
    { href: "/admin/seo", label: "SEO", icon: "fa-magnifying-glass-chart" },
  ];

  return (
    <aside className="sidebar" style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
      {/* Logo */}
      <div className="sb-logo" style={{ borderBottom: "1px solid rgba(251,191,36,.1)" }}>
        <span style={{ fontSize: "1.4rem" }}>🍌</span>
        <span>bannana</span>
        <span style={{
          fontSize: ".6rem", fontWeight: 800, background: "#7C3AED", color: "#fff",
          padding: "2px 7px", borderRadius: 99, letterSpacing: ".05em", marginLeft: "auto"
        }}>ADMIN</span>
      </div>

      {/* User info */}
      <div className="sb-user">
        <div className="sb-avatar" style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}>
          <i className="fa-solid fa-user-shield" style={{ color: "#fff", fontSize: ".85rem" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-uname" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {displayName}
          </div>
          <div className="sb-handle" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </div>
        </div>
        <span style={{
          fontSize: ".6rem", fontWeight: 800, background: "rgba(124,58,237,.2)", color: "#A78BFA",
          padding: "2px 7px", borderRadius: 99, flexShrink: 0
        }}>ADMIN</span>
      </div>

      {/* Navigation */}
      <nav className="sb-nav">
        <div className="sb-section">Admin Panel</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sb-item${isActive(item.href, item.exact) ? " active" : ""}`}
          >
            <i className={`fa-solid ${item.icon}`} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="sb-bottom" style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <Link
          href="/dashboard"
          className="sb-item"
          style={{ color: "var(--b-500)" }}
        >
          <i className="fa-solid fa-arrow-left" />
          Kembali ke Dashboard
        </Link>
        <button
          onClick={logout}
          className="sb-item"
          style={{
            width: "100%", background: "none", border: "none",
            cursor: "pointer", color: "#FCA5A5", textAlign: "left"
          }}
        >
          <i className="fa-solid fa-right-from-bracket" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
