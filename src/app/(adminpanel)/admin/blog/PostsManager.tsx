"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostRow } from "./page";

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Tab = "all" | "blog" | "cerita" | "draft" | "published";

interface PostsManagerProps {
  initialPosts: PostRow[];
}

export function PostsManager({ initialPosts }: PostsManagerProps) {
  const [posts, setPosts] = useState<PostRow[]>(initialPosts);
  const [tab, setTab] = useState<Tab>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    if (tab === "blog") return p.type === "blog";
    if (tab === "cerita") return p.type === "cerita";
    if (tab === "draft") return p.status === "draft";
    if (tab === "published") return p.status === "published";
    return true;
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": getCsrf() },
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message ?? "Gagal menghapus artikel.");
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "blog", label: "Blog" },
    { id: "cerita", label: "Cerita" },
    { id: "draft", label: "Draft" },
    { id: "published", label: "Published" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)" }}>
            Blog &amp; Cerita
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Kelola artikel blog dan cerita sukses bannana.id
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontSize: ".875rem" }}
        >
          <i className="fa-solid fa-plus" />
          Artikel Baru
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: ".25rem", marginBottom: "1.25rem", borderBottom: "2px solid var(--n-100)", paddingBottom: "0" }}>
        {tabs.map((t) => {
          const count =
            t.id === "all" ? posts.length
            : t.id === "blog" ? posts.filter((p) => p.type === "blog").length
            : t.id === "cerita" ? posts.filter((p) => p.type === "cerita").length
            : t.id === "draft" ? posts.filter((p) => p.status === "draft").length
            : posts.filter((p) => p.status === "published").length;

          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: ".5rem .875rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: ".875rem",
                fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? "var(--b-600)" : "var(--n-500)",
                borderBottom: tab === t.id ? "2px solid var(--b-500)" : "2px solid transparent",
                marginBottom: "-2px",
                borderRadius: "0",
                display: "inline-flex",
                alignItems: "center",
                gap: ".35rem",
                transition: "all .15s",
              }}
            >
              {t.label}
              <span style={{
                fontSize: ".7rem",
                fontWeight: 700,
                background: tab === t.id ? "var(--b-100)" : "var(--n-100)",
                color: tab === t.id ? "var(--b-700)" : "var(--n-500)",
                padding: "1px 6px",
                borderRadius: 99,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: "1rem", padding: "12px 16px", background: "#FEE2E2", borderRadius: 10, color: "#DC2626", fontSize: ".875rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem 2rem", textAlign: "center", color: "var(--n-400)" }}>
            <i className="fa-solid fa-newspaper" style={{ fontSize: "2rem", marginBottom: ".75rem", display: "block", opacity: 0.3 }} />
            <div style={{ fontWeight: 600, marginBottom: ".25rem" }}>Tidak ada artikel</div>
            <div style={{ fontSize: ".875rem" }}>
              {tab === "all"
                ? "Belum ada artikel. Mulai tulis sekarang!"
                : `Tidak ada artikel dengan filter "${tabs.find(t => t.id === tab)?.label}".`}
            </div>
            {tab === "all" && (
              <Link href="/admin/blog/new" className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", marginTop: "1rem" }}>
                <i className="fa-solid fa-plus" /> Tulis Artikel
              </Link>
            )}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--n-100)" }}>
                {["Judul", "Tipe", "Status", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} style={{
                    padding: ".75rem 1rem",
                    textAlign: "left",
                    fontSize: ".75rem",
                    fontWeight: 700,
                    color: "var(--n-500)",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    background: "var(--n-50)",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, i) => (
                <tr
                  key={post.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--n-100)" : "none",
                    transition: "background .1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--b-50)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  {/* Judul */}
                  <td style={{ padding: ".875rem 1rem", maxWidth: 320 }}>
                    <div style={{ fontWeight: 600, color: "var(--b-900)", fontSize: ".9rem", marginBottom: ".2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: ".75rem", color: "var(--n-400)", fontFamily: "monospace" }}>
                      /{post.slug}
                    </div>
                  </td>

                  {/* Tipe */}
                  <td style={{ padding: ".875rem 1rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 99,
                      fontSize: ".75rem",
                      fontWeight: 700,
                      background: post.type === "blog" ? "#DBEAFE" : "#D1FAE5",
                      color: post.type === "blog" ? "#1D4ED8" : "#065F46",
                    }}>
                      {post.type === "blog" ? "Blog" : "Cerita"}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: ".875rem 1rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 99,
                      fontSize: ".75rem",
                      fontWeight: 700,
                      background: post.status === "published" ? "#D1FAE5" : "var(--n-100)",
                      color: post.status === "published" ? "#065F46" : "var(--n-500)",
                    }}>
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Tanggal */}
                  <td style={{ padding: ".875rem 1rem", fontSize: ".82rem", color: "var(--n-500)", whiteSpace: "nowrap" }}>
                    {post.publishedAt
                      ? formatDate(post.publishedAt)
                      : formatDate(post.createdAt)}
                  </td>

                  {/* Aksi */}
                  <td style={{ padding: ".875rem 1rem" }}>
                    <div style={{ display: "flex", gap: ".5rem" }}>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", fontSize: ".8rem" }}
                      >
                        <i className="fa-solid fa-pen" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="btn btn-sm"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: ".35rem",
                          fontSize: ".8rem",
                          background: "none",
                          border: "1.5px solid #FCA5A5",
                          color: "#DC2626",
                          cursor: "pointer",
                          borderRadius: "var(--r-lg)",
                          padding: "4px 12px",
                        }}
                      >
                        {deletingId === post.id
                          ? <i className="fa-solid fa-spinner fa-spin" />
                          : <i className="fa-solid fa-trash" />}
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
