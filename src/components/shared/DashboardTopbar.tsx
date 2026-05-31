"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Page = { id: string; title: string; isPublished: boolean };

type Props = {
  pages: Page[];
  username: string;
  avatarUrl: string | null;
  csrfToken: string;
  canCreatePage: boolean;
};

type NotifItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

const QUICK_NAV = [
  { href: "/dashboard", icon: "fa-solid fa-gauge-high", label: "Dashboard" },
  { href: "/pages", icon: "fa-solid fa-table-columns", label: "Halaman Saya" },
  { href: "/analytics", icon: "fa-solid fa-chart-line", label: "Analytics" },
  { href: "/themes", icon: "fa-solid fa-palette", label: "Tema" },
  { href: "/settings", icon: "fa-solid fa-gear", label: "Pengaturan" },
  { href: "/langganan", icon: "fa-solid fa-crown", label: "Langganan" },
];

const SETTINGS_SHORTCUTS = [
  { href: "/settings?tab=profil", label: "Profil" },
  { href: "/settings?tab=akun", label: "Keamanan" },
  { href: "/settings?tab=notif", label: "Notifikasi" },
];

function notifTypeIcon(type: string) {
  switch (type) {
    case "welcome": return "🍌";
    case "click_spike": return "⚡";
    case "tip": return "💡";
    case "product_update": return "🚀";
    case "weekly_summary": return "📊";
    default: return "🔔";
  }
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}h lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function DashboardTopbar({ pages, username, avatarUrl, csrfToken, canCreatePage }: Props) {
  const router = useRouter();

  // --- Search ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
    }
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    if (searchOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function navigateTo(href: string) {
    setSearchOpen(false);
    router.push(href);
  }

  // --- Notifications ---
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifPos, setNotifPos] = useState<{ top: number; right: number }>({ top: 70, right: 16 });
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setNotifications(j.data.notifications);
          setUnreadCount(j.data.unreadCount);
        }
      })
      .catch(() => {});
  }, []);

  const markRead = useCallback(() => {
    if (unreadCount === 0) return;
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "X-CSRF-Token": csrfToken },
    }).catch(() => {});
  }, [unreadCount, csrfToken]);

  function openNotif() {
    if (notifRef.current) {
      const rect = notifRef.current.getBoundingClientRect();
      setNotifPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
    }
    setNotifOpen(true);
    markRead();
  }

  // Click outside to close notif dropdown
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  return (
    <>
      <div className="topbar">
        {/* Search bar — desktop only */}
        <div
          className="tb-search"
          onClick={() => setSearchOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <i className="fa-solid fa-search" />
          <input
            type="text"
            placeholder="Cari halaman, blok, pengaturan..."
            readOnly
            style={{ cursor: "pointer" }}
          />
        </div>
        {/* Search icon — mobile only */}
        <button className="tb-icon-btn tb-search-btn" onClick={() => setSearchOpen(true)} aria-label="Cari">
          <i className="fa-solid fa-search" />
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: ".75rem", alignItems: "center" }}>
          {/* Notification bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <div
              className="tb-icon-btn"
              onClick={notifOpen ? () => setNotifOpen(false) : openNotif}
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-bell" />
              {unreadCount > 0 && <div className="notif-dot" />}
            </div>

            {notifOpen && (
              <div className="notif-dropdown" style={{
                position: "fixed", top: notifPos.top, right: notifPos.right, width: 340, maxWidth: "calc(100vw - 2rem)", zIndex: 1000,
                background: "var(--n-0)", border: "1.5px solid var(--n-200)", borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,.12)", overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem .875rem", borderBottom: "1px solid var(--n-100)" }}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-900)" }}>Notifikasi</div>
                  <button
                    onClick={markRead}
                    style={{ fontSize: ".72rem", color: "var(--b-700)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}
                  >
                    Tandai dibaca
                  </button>
                </div>

                {/* List */}
                <div style={{ maxHeight: 360, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "var(--n-400)", fontSize: ".84rem" }}>
                      Tidak ada notifikasi.
                    </div>
                  ) : notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => { if (n.href) { setNotifOpen(false); router.push(n.href); } }}
                      style={{
                        display: "flex", gap: 10, padding: ".875rem 1.25rem",
                        borderBottom: "1px solid var(--n-50)",
                        cursor: n.href ? "pointer" : "default",
                        background: n.readAt ? "var(--n-0)" : "var(--b-50)",
                        transition: "background .1s",
                      }}
                    >
                      <div style={{ fontSize: "1.1rem", lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
                        {notifTypeIcon(n.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: ".84rem", fontWeight: 700, color: "var(--b-900)", lineHeight: 1.3 }}>{n.title}</div>
                        {n.body && <div style={{ fontSize: ".75rem", color: "var(--n-500)", marginTop: 2, lineHeight: 1.45 }}>{n.body}</div>}
                        <div style={{ fontSize: ".68rem", color: "var(--n-400)", marginTop: 4 }}>{relativeTime(n.createdAt)}</div>
                      </div>
                      {!n.readAt && (
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--b-500)", flexShrink: 0, marginTop: 6 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Create page / Upgrade button */}
          {canCreatePage ? (
            <Link href="/pages/new" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-plus" /><span className="hide-mobile"> Halaman Baru</span>
            </Link>
          ) : (
            <Link href="/langganan" className="btn btn-primary btn-sm" title="Upgrade ke Pro untuk halaman tak terbatas">
              <i className="fa-solid fa-crown" /><span className="hide-mobile"> Upgrade Pro</span>
            </Link>
          )}

          {/* Eye icon — public page */}
          <Link href={`/${username}`} target="_blank" className="tb-icon-btn" title="Lihat halaman publik">
            <i className="fa-solid fa-eye" />
          </Link>

          {/* Avatar */}
          <Link
            href="/settings"
            className="sb-avatar"
            style={{ cursor: "pointer", textDecoration: "none", overflow: "hidden", padding: avatarUrl ? 0 : undefined }}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : <i className="fa-solid fa-user" />}
          </Link>
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: "5vh",
          }}
        >
          <div style={{
            width: "100%", maxWidth: 600, margin: "0 1rem",
            background: "var(--n-0)", borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,.2)",
            overflow: "hidden", display: "flex", flexDirection: "column",
            maxHeight: "88vh",
          }}>
            {/* Search input */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: ".875rem 1.25rem", borderBottom: "1.5px solid var(--n-100)" }}>
              <i className="fa-solid fa-search" style={{ color: "var(--n-400)", fontSize: ".9rem", flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari halaman, blok, pengaturan..."
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: ".95rem", color: "var(--b-900)", fontFamily: "var(--fs)",
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: "var(--n-100)", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: ".72rem", color: "var(--n-500)", cursor: "pointer", fontWeight: 600, flexShrink: 0 }}
              >
                ESC
              </button>
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {/* Quick nav */}
              {!searchTerm && (
                <div style={{ padding: "1rem 1.25rem .5rem" }}>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".625rem" }}>
                    Navigasi Cepat
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                    {QUICK_NAV.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => navigateTo(item.href)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: ".625rem .875rem", borderRadius: 10,
                          background: "var(--n-50)", border: "1.5px solid var(--n-100)",
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--b-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-600)", fontSize: ".75rem", flexShrink: 0 }}>
                          <i className={item.icon} />
                        </div>
                        <span style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--b-900)" }}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pages section */}
              {(searchTerm ? filteredPages : pages).length > 0 && (
                <div style={{ padding: "1rem 1.25rem .5rem" }}>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".625rem" }}>
                    Halaman Saya
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
                    {(searchTerm ? filteredPages : pages).map((page) => (
                      <button
                        key={page.id}
                        onClick={() => navigateTo(`/pages/${page.id}`)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: ".625rem .875rem", borderRadius: 10,
                          background: "var(--n-50)", border: "1.5px solid var(--n-100)",
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: page.isPublished ? "var(--b-100)" : "var(--n-100)", display: "flex", alignItems: "center", justifyContent: "center", color: page.isPublished ? "var(--b-600)" : "var(--n-500)", fontSize: ".68rem", flexShrink: 0 }}>
                          <i className={`fa-solid ${page.isPublished ? "fa-globe" : "fa-file"}`} />
                        </div>
                        <span style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--b-900)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.title}</span>
                        <span style={{ fontSize: ".68rem", color: page.isPublished ? "var(--success-600)" : "var(--n-400)", fontWeight: 600, flexShrink: 0 }}>{page.isPublished ? "Live" : "Draft"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchTerm && filteredPages.length === 0 && (
                <div style={{ padding: "1.5rem 1.25rem", textAlign: "center", color: "var(--n-400)", fontSize: ".84rem" }}>
                  Tidak ada hasil untuk &ldquo;{searchTerm}&rdquo;
                </div>
              )}

              {/* Settings shortcuts */}
              {!searchTerm && (
                <div style={{ padding: ".5rem 1.25rem 1rem" }}>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".625rem" }}>
                    Pengaturan
                  </div>
                  <div style={{ display: "flex", gap: ".5rem" }}>
                    {SETTINGS_SHORTCUTS.map((s) => (
                      <button
                        key={s.href}
                        onClick={() => navigateTo(s.href)}
                        style={{
                          padding: ".5rem .875rem", borderRadius: 8,
                          background: "var(--n-50)", border: "1.5px solid var(--n-100)",
                          fontSize: ".8rem", fontWeight: 600, color: "var(--n-700)", cursor: "pointer",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
