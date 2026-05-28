"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  tags: string[];
  status: string;
  type: string;
  publishedAt: string | null;
}

interface PostEditorProps {
  initialData?: PostData;
}

type Caption = { platform: string; icon: string; text: string };

export function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl ?? "");
  const [tagInput, setTagInput] = useState((initialData?.tags ?? []).join(", "));
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [type, setType] = useState(initialData?.type ?? "blog");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [captions, setCaptions] = useState<Caption[]>([]);
  const [captionOpen, setCaptionOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const slugManuallyEdited = useRef(isEdit);

  // Auto-generate slug from title only when not editing and slug not manually changed
  useEffect(() => {
    if (!slugManuallyEdited.current) {
      setSlug(slugify(title));
    }
  }, [title]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function parseTags() {
    return tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { showToast("error", "Judul wajib diisi."); return; }
    if (!slug.trim()) { showToast("error", "Slug wajib diisi."); return; }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content,
        coverUrl: coverUrl.trim() || null,
        tags: parseTags(),
        status,
        type,
      };

      const url = isEdit ? `/api/admin/blog/${initialData!.id}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrf(),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        showToast("error", json.error?.message ?? "Gagal menyimpan artikel.");
        return;
      }

      showToast("success", isEdit ? "Artikel berhasil diperbarui." : "Artikel berhasil dibuat.");
      const savedId = json.data?.id ?? initialData?.id;
      if (savedId) {
        setTimeout(() => router.push(`/admin/blog/${savedId}`), 600);
      }
    } catch {
      showToast("error", "Koneksi gagal. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  function generateCaptions() {
    const tags = parseTags();
    const shortExcerpt = excerpt.trim() ? excerpt.trim().slice(0, 120) + (excerpt.trim().length > 120 ? "..." : "") : "";
    const url = `bannana.id/blog/${slug}`;

    const hashtagBase = tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ");
    const genericTags = "#bannana #UMKM #digitalmarketing #linkpage #bisnisdigital";

    const twitter: Caption = {
      platform: "Twitter / X",
      icon: "fa-brands fa-x-twitter",
      text: `${title}${shortExcerpt ? `\n\n${shortExcerpt}` : ""}\n\n🔗 ${url}`,
    };

    const instagram: Caption = {
      platform: "Instagram",
      icon: "fa-brands fa-instagram",
      text: `${title}\n\n${excerpt.trim() || "Baca artikel terbaru dari bannana.id!"}\n\nSelengkapnya di link bio 👉 ${url}\n\n${hashtagBase ? hashtagBase + " " : ""}${genericTags}`,
    };

    const tiktok: Caption = {
      platform: "TikTok",
      icon: "fa-brands fa-tiktok",
      text: `${title} 🔥\n\n${shortExcerpt ? shortExcerpt + "\n\n" : ""}Cek selengkapnya di ${url}\n\n${hashtagBase ? hashtagBase + " " : ""}#bannanaId #tipsUMKM #kontenkreatif`,
    };

    setCaptions([twitter, instagram, tiktok]);
    setCaptionOpen(true);
  }

  async function copyCaption(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: ".8rem",
    fontWeight: 700,
    color: "var(--n-600)",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    marginBottom: ".4rem",
  };

  return (
    <form onSubmit={handleSave}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          padding: "12px 20px",
          borderRadius: 12,
          fontWeight: 600,
          fontSize: ".875rem",
          display: "flex",
          alignItems: "center",
          gap: ".6rem",
          boxShadow: "0 4px 20px rgba(0,0,0,.15)",
          background: toast.type === "success" ? "#D1FAE5" : "#FEE2E2",
          color: toast.type === "success" ? "#065F46" : "#DC2626",
          border: `1.5px solid ${toast.type === "success" ? "#6EE7B7" : "#FCA5A5"}`,
          animation: "fadeIn .2s ease",
        }}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`} />
          {toast.message}
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT: Main editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            {/* Title */}
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                className="input"
                placeholder="Judul artikel..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ fontSize: "1.4rem", fontFamily: "var(--fd)", fontWeight: 700, border: "none", padding: "0", outline: "none", boxShadow: "none", width: "100%", color: "var(--b-900)", background: "transparent" }}
                required
              />
            </div>

            {/* Slug */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Slug URL</label>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{ fontSize: ".82rem", color: "var(--n-400)", whiteSpace: "nowrap" }}>bannana.id/blog/</span>
                <input
                  type="text"
                  className="input"
                  placeholder="url-artikel"
                  value={slug}
                  onChange={(e) => {
                    slugManuallyEdited.current = true;
                    setSlug(e.target.value);
                  }}
                  style={{ fontSize: ".85rem", fontFamily: "monospace", flex: 1 }}
                  required
                />
              </div>
            </div>

            {/* Excerpt */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Ringkasan (Excerpt)</label>
              <textarea
                className="input"
                placeholder="Ringkasan singkat artikel yang tampil di kartu dan SEO..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                style={{ resize: "vertical", fontSize: ".875rem", lineHeight: 1.6 }}
              />
            </div>

            {/* Content */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".4rem" }}>
                <label style={labelStyle}>Konten Artikel</label>
                <span style={{ fontSize: ".72rem", color: "var(--n-400)", display: "flex", alignItems: "center", gap: ".3rem" }}>
                  <i className="fa-brands fa-markdown" />
                  Supports Markdown
                </span>
              </div>
              <textarea
                className="input"
                placeholder={"# Judul Utama\n\nTulis konten artikel di sini...\n\n## Sub-judul\n\n**Teks tebal** dan *teks miring*.\n\n- Poin satu\n- Poin dua"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                style={{
                  resize: "vertical",
                  fontSize: ".875rem",
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                  minHeight: 400,
                }}
              />
            </div>
          </div>

          {/* Social Draft Generator */}
          <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: captionOpen ? "1rem" : "0" }}>
              <div style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--b-900)", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>✨</span>
                Generate Caption Sosial Media
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <button
                  type="button"
                  onClick={generateCaptions}
                  className="btn btn-primary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem" }}
                >
                  <i className="fa-solid fa-wand-magic-sparkles" />
                  Generate
                </button>
                {captions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCaptionOpen((o) => !o)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: ".82rem" }}
                  >
                    <i className={`fa-solid ${captionOpen ? "fa-chevron-up" : "fa-chevron-down"}`} />
                  </button>
                )}
              </div>
            </div>

            {captionOpen && captions.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
                {captions.map((cap, idx) => (
                  <div key={cap.platform} style={{ border: "1.5px solid var(--n-200)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: ".6rem 1rem",
                      background: "var(--n-50)",
                      borderBottom: "1.5px solid var(--n-100)",
                    }}>
                      <span style={{ fontWeight: 700, fontSize: ".82rem", color: "var(--n-600)", display: "flex", alignItems: "center", gap: ".4rem" }}>
                        <i className={cap.icon} />
                        {cap.platform}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyCaption(cap.text, idx)}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: ".78rem", display: "inline-flex", alignItems: "center", gap: ".3rem" }}
                      >
                        <i className={`fa-solid ${copiedIdx === idx ? "fa-check" : "fa-copy"}`} />
                        {copiedIdx === idx ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                    <pre style={{
                      margin: 0,
                      padding: ".875rem 1rem",
                      fontSize: ".82rem",
                      lineHeight: 1.65,
                      color: "var(--n-700)",
                      fontFamily: "inherit",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      background: "#fff",
                      maxHeight: 180,
                      overflowY: "auto",
                    }}>
                      {cap.text}
                    </pre>
                  </div>
                ))}
                <p style={{ fontSize: ".75rem", color: "var(--n-400)", margin: 0 }}>
                  Caption dibuat dari judul, excerpt, dan tags. Edit sebelum diposting.
                </p>
              </div>
            )}

            {!captionOpen && captions.length === 0 && (
              <p style={{ margin: "0.5rem 0 0", fontSize: ".82rem", color: "var(--n-400)" }}>
                Klik Generate untuk membuat draft caption Twitter, Instagram, dan TikTok dari konten artikel.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Settings panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", padding: "12px", fontSize: "1rem", fontWeight: 700 }}
          >
            {saving
              ? <><i className="fa-solid fa-spinner fa-spin" /> Menyimpan...</>
              : isEdit
                ? <><i className="fa-solid fa-floppy-disk" /> Simpan Perubahan</>
                : <><i className="fa-solid fa-paper-plane" /> Publish Artikel</>
            }
          </button>

          {/* Post Type */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <label style={labelStyle}>Tipe Konten</label>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {[
                { value: "blog", label: "Blog Post", icon: "fa-pen-nib", desc: "Artikel informatif, panduan, tips" },
                { value: "cerita", label: "Cerita Sukses", icon: "fa-star", desc: "Kisah nyata pengguna bannana.id" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  style={{
                    padding: ".75rem 1rem",
                    border: `2px solid ${type === opt.value ? "var(--b-400)" : "var(--n-200)"}`,
                    borderRadius: "var(--r-xl)",
                    background: type === opt.value ? "var(--b-50)" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all .15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                    <i className={`fa-solid ${opt.icon}`} style={{ color: type === opt.value ? "var(--b-500)" : "var(--n-400)", fontSize: ".85rem", width: 16 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: ".875rem", color: type === opt.value ? "var(--b-700)" : "var(--b-900)" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: ".75rem", color: "var(--n-400)", marginTop: "1px" }}>
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: ".5rem" }}>
              {[
                { value: "draft", label: "Draft", icon: "fa-file-pen" },
                { value: "published", label: "Published", icon: "fa-globe" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  style={{
                    flex: 1,
                    padding: ".6rem",
                    border: `2px solid ${status === opt.value ? "var(--b-400)" : "var(--n-200)"}`,
                    borderRadius: "var(--r-lg)",
                    background: status === opt.value ? "var(--b-50)" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: ".4rem",
                    fontSize: ".875rem",
                    fontWeight: 700,
                    color: status === opt.value ? "var(--b-600)" : "var(--n-500)",
                    transition: "all .15s",
                  }}
                >
                  <i className={`fa-solid ${opt.icon}`} style={{ fontSize: ".8rem" }} />
                  {opt.label}
                </button>
              ))}
            </div>
            {status === "published" && (
              <p style={{ margin: ".5rem 0 0", fontSize: ".75rem", color: "var(--n-400)", display: "flex", alignItems: "center", gap: ".3rem" }}>
                <i className="fa-solid fa-circle-info" />
                Artikel akan langsung terlihat di halaman publik
              </p>
            )}
          </div>

          {/* Cover Image */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <label style={labelStyle}>Cover Image URL</label>
            <input
              type="url"
              className="input"
              placeholder="https://..."
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              style={{ fontSize: ".875rem" }}
            />
            {coverUrl && (
              <div style={{ marginTop: ".75rem", borderRadius: 10, overflow: "hidden", border: "1.5px solid var(--n-200)", aspectRatio: "16/9", background: "var(--n-100)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <label style={labelStyle}>Tags</label>
            <input
              type="text"
              className="input"
              placeholder="UMKM, tips, digitalmarketing"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              style={{ fontSize: ".875rem" }}
            />
            <p style={{ margin: ".35rem 0 .5rem", fontSize: ".75rem", color: "var(--n-400)" }}>
              Pisahkan dengan koma
            </p>
            {parseTags().length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
                {parseTags().map((tag) => (
                  <span key={tag} style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".25rem",
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: "var(--b-100)",
                    color: "var(--b-700)",
                    fontSize: ".75rem",
                    fontWeight: 600,
                  }}>
                    <i className="fa-solid fa-hashtag" style={{ fontSize: ".65rem" }} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Back link */}
          <a
            href="/admin/blog"
            style={{ fontSize: ".82rem", color: "var(--n-400)", display: "flex", alignItems: "center", gap: ".35rem", textDecoration: "none", justifyContent: "center", marginTop: ".25rem" }}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: ".75rem" }} />
            Kembali ke daftar artikel
          </a>
        </div>
      </div>
    </form>
  );
}
