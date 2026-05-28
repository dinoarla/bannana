"use client";

import { useState } from "react";

interface ArticleIdea {
  title: string;
  slug: string;
  type: "blog" | "cerita";
  format: "listicle" | "comparison" | "howto" | "story";
}

const FORMAT_META: Record<ArticleIdea["format"], { label: string; icon: string; color: string; bg: string; desc: string }> = {
  listicle: { label: "Listicle", icon: "fa-list-ol", color: "#065F46", bg: "#D1FAE5", desc: "Artikel daftar — mudah dibaca, sering viral" },
  comparison: { label: "Comparison", icon: "fa-scale-balanced", color: "#92400E", bg: "#FEF3C7", desc: "Artikel perbandingan — tinggi search intent" },
  howto: { label: "How-to", icon: "fa-book-open", color: "#1E3A5F", bg: "#DBEAFE", desc: "Panduan langkah demi langkah — SEO jangka panjang" },
  story: { label: "Story", icon: "fa-star", color: "#4C1D95", bg: "#EDE9FE", desc: "Cerita nyata — membangun kepercayaan & sosial proof" },
};

const COMPETITORS = ["Linktree", "Beacons", "Carrd", "Bento", "Koji"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function generateIdeas(keyword: string, niche: string): ArticleIdea[] {
  const k = keyword.trim().toLowerCase();
  const kUp = k.charAt(0).toUpperCase() + k.slice(1);
  const target = niche.trim() || "konten kreator";
  const year = new Date().getFullYear();
  const comp = COMPETITORS[Math.floor(Math.random() * COMPETITORS.length)];

  const raw: Array<{ title: string; format: ArticleIdea["format"]; type: ArticleIdea["type"] }> = [
    // Listicle
    { format: "listicle", type: "blog", title: `7 cara ${target} pakai ${k} biar makin laris ${year}` },
    { format: "listicle", type: "blog", title: `${kUp} gratis terbaik ${year} untuk ${target} Indonesia` },
    { format: "listicle", type: "blog", title: `5 tips optimasi ${k} agar dapat lebih banyak klik` },
    { format: "listicle", type: "blog", title: `10 kesalahan ${target} saat pakai ${k} (dan cara benerin)` },
    // Comparison
    { format: "comparison", type: "blog", title: `${comp} vs bannana.id — mana lebih baik untuk Indonesia?` },
    { format: "comparison", type: "blog", title: `${kUp} gratis vs berbayar: worth it atau tidak?` },
    { format: "comparison", type: "blog", title: `bannana.id vs ${comp}: perbandingan fitur lengkap ${year}` },
    // How-to
    { format: "howto", type: "blog", title: `cara buat ${k} untuk ${target} dalam 5 menit` },
    { format: "howto", type: "blog", title: `cara jualan online dari 1 ${k} saja — panduan lengkap` },
    { format: "howto", type: "blog", title: `cara optimasi ${k} untuk ${target} agar omzet naik` },
    { format: "howto", type: "blog", title: `panduan ${k} untuk UMKM: dari setup sampai dapat pelanggan` },
    // Story
    { format: "story", type: "cerita", title: `dari 0 ke 100 pelanggan — cerita ${target} pakai ${k}` },
    { format: "story", type: "cerita", title: `saya coba ${k} selama 30 hari — ini hasilnya` },
    { format: "story", type: "cerita", title: `bagaimana ${k} bantu ${target} ini dapat 10.000 pengunjung` },
    { format: "story", type: "cerita", title: `pengalaman jujur pakai ${k}: worth it atau tidak?` },
  ];

  return raw.map((r) => ({ ...r, slug: slugify(r.title) }));
}

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((row) => row.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

export function ClusterGenerator() {
  const [keyword, setKeyword] = useState("");
  const [niche, setNiche] = useState("");
  const [ideas, setIdeas] = useState<ArticleIdea[] | null>(null);
  const [creating, setCreating] = useState<string | null>(null);
  const [created, setCreated] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setIdeas(generateIdeas(keyword, niche));
    setCreated(new Set());
    setError(null);
  }

  async function createDraft(idea: ArticleIdea) {
    setCreating(idea.slug);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "X-CSRF-Token": getCsrf(), "Content-Type": "application/json" },
        body: JSON.stringify({ title: idea.title, slug: idea.slug, excerpt: "", content: "", type: idea.type, status: "draft", tags: [] }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error?.message ?? "Gagal membuat draft."); }
      else { setCreated((prev) => new Set([...prev, idea.slug])); }
    } catch { setError("Koneksi gagal. Coba lagi."); }
    finally { setCreating(null); }
  }

  async function createAll() {
    if (!ideas) return;
    const pending = ideas.filter((i) => !created.has(i.slug));
    for (const idea of pending) {
      await createDraft(idea);
    }
  }

  const byFormat = (fmt: ArticleIdea["format"]) => ideas?.filter((i) => i.format === fmt) ?? [];
  const totalCreated = created.size;
  const total = ideas?.length ?? 0;

  return (
    <div>
      {/* Explanation banner */}
      <div style={{ padding: "14px 18px", background: "var(--b-50)", border: "1.5px solid var(--b-100)", borderRadius: "var(--r-xl)", marginBottom: "1.5rem", fontSize: ".85rem", color: "var(--b-800)", lineHeight: 1.6 }}>
        <i className="fa-solid fa-circle-info" style={{ marginRight: ".5rem", color: "var(--b-400)" }} />
        Masukkan satu kata kunci utama → sistem generate <strong>15 ide artikel turunan</strong> yang saling interlink. Google melihat ini sebagai tanda kamu <em>authority</em> di topik tersebut.
      </div>

      {/* Input form */}
      <form onSubmit={generate} style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: "2rem", alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 220px" }}>
          <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: "var(--n-600)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".4rem" }}>
            Kata Kunci Utama <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            className="input"
            placeholder='Contoh: "link in bio", "jualan online", "creator economy"'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
            style={{ fontSize: ".9rem" }}
          />
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: "var(--n-600)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".4rem" }}>
            Target Audiens <span style={{ color: "var(--n-400)", fontWeight: 400, textTransform: "none", fontSize: ".72rem" }}>(opsional)</span>
          </label>
          <input
            className="input"
            placeholder="Contoh: UMKM, freelancer, beauty creator"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            style={{ fontSize: ".9rem" }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: ".875rem", flexShrink: 0 }}>
          <i className="fa-solid fa-wand-magic-sparkles" /> Generate {ideas ? "Ulang" : "Topik"}
        </button>
      </form>

      {error && (
        <div style={{ marginBottom: "1rem", padding: "12px 16px", background: "#FEE2E2", borderRadius: 10, color: "#DC2626", fontSize: ".875rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </div>
      )}

      {/* Results */}
      {ideas && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: ".75rem" }}>
            <span style={{ fontSize: ".875rem", color: "var(--n-500)" }}>
              <strong style={{ color: "var(--n-800)" }}>{total} ide artikel</strong> untuk kata kunci{" "}
              <strong style={{ color: "var(--b-600)" }}>{keyword}</strong>
              {niche && <> · target: <strong style={{ color: "var(--n-700)" }}>{niche}</strong></>}
              {totalCreated > 0 && <span style={{ marginLeft: ".5rem", color: "#059669" }}>· {totalCreated} draft dibuat</span>}
            </span>
            {totalCreated < total && (
              <button
                type="button"
                onClick={createAll}
                disabled={!!creating}
                style={{ border: "1.5px solid var(--b-300)", borderRadius: 8, background: "var(--b-50)", color: "var(--b-700)", fontWeight: 700, fontSize: ".8rem", padding: "6px 14px", cursor: creating ? "wait" : "pointer" }}
              >
                <i className="fa-solid fa-layer-group" /> Buat Semua Draft
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {(["listicle", "comparison", "howto", "story"] as const).map((fmt) => {
              const meta = FORMAT_META[fmt];
              const items = byFormat(fmt);
              return (
                <div key={fmt}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".75rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: meta.bg, flexShrink: 0 }}>
                      <i className={`fa-solid ${meta.icon}`} style={{ color: meta.color, fontSize: ".75rem" }} />
                    </span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--n-800)" }}>{meta.label}</span>
                      <span style={{ fontSize: ".75rem", color: "var(--n-400)", marginLeft: ".5rem" }}>— {meta.desc}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
                    {items.map((idea) => {
                      const done = created.has(idea.slug);
                      const busy = creating === idea.slug;
                      return (
                        <div
                          key={idea.slug}
                          style={{
                            display: "flex", alignItems: "center", gap: ".75rem",
                            padding: "10px 14px", borderRadius: "var(--r-xl)",
                            border: `1.5px solid ${done ? "#6EE7B7" : "var(--n-200)"}`,
                            background: done ? "#F0FDF4" : "#fff",
                          }}
                        >
                          <span style={{
                            fontSize: ".63rem", fontWeight: 700, padding: "2px 7px", borderRadius: 5, flexShrink: 0,
                            background: idea.type === "blog" ? "var(--b-100)" : "#FDE68A",
                            color: idea.type === "blog" ? "var(--b-700)" : "#92400E",
                          }}>
                            {idea.type === "blog" ? "Blog" : "Cerita"}
                          </span>
                          <span style={{ flex: 1, fontSize: ".875rem", color: done ? "var(--n-400)" : "var(--n-800)", textDecoration: done ? "line-through" : "none", fontStyle: "italic" }}>
                            &ldquo;{idea.title}&rdquo;
                          </span>
                          {done ? (
                            <span style={{ fontSize: ".78rem", color: "#059669", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
                              <i className="fa-solid fa-check" /> Draft dibuat
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => createDraft(idea)}
                              disabled={busy || !!creating}
                              style={{
                                flexShrink: 0, border: "1.5px solid var(--b-300)", borderRadius: 8,
                                background: "var(--b-50)", color: "var(--b-700)", fontWeight: 700,
                                fontSize: ".75rem", padding: "4px 11px", cursor: busy ? "wait" : "pointer",
                                opacity: !!creating && !busy ? 0.5 : 1, whiteSpace: "nowrap",
                              }}
                            >
                              {busy ? <><i className="fa-solid fa-spinner fa-spin" /> Membuat…</> : "Buat Draft"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1.5rem", padding: "12px 16px", background: "var(--b-50)", borderRadius: 10, fontSize: ".8rem", color: "var(--b-700)", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <i className="fa-solid fa-circle-info" />
            Draft tersimpan di <strong>Blog &amp; Cerita</strong> dengan status Draft. Edit konten lalu publish kapan pun kamu siap.
          </div>
        </div>
      )}

      {!ideas && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--n-400)" }}>
          <i className="fa-solid fa-diagram-project" style={{ fontSize: "2.5rem", marginBottom: "1rem", display: "block", color: "var(--b-200)" }} />
          <div style={{ fontWeight: 700, marginBottom: ".5rem", color: "var(--n-600)", fontSize: "1rem" }}>Klaster Topik SEO</div>
          <div style={{ fontSize: ".875rem", maxWidth: 360, margin: "0 auto", lineHeight: 1.6 }}>
            Generate 15 ide artikel dalam 4 format — Listicle, Comparison, How-to, dan Story — dari satu kata kunci.
          </div>
          <div style={{ marginTop: "1.25rem", display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: ".4rem", background: "var(--n-50)", border: "1.5px solid var(--n-150)", borderRadius: 10, padding: "12px 16px", textAlign: "left", fontSize: ".8rem", color: "var(--n-600)" }}>
            <div><i className="fa-solid fa-quote-left" style={{ color: "var(--b-300)", marginRight: ".4rem" }} />link in bio gratis terbaik 2026 indonesia</div>
            <div><i className="fa-solid fa-quote-left" style={{ color: "var(--b-300)", marginRight: ".4rem" }} />cara buat link bio untuk UMKM</div>
            <div><i className="fa-solid fa-quote-left" style={{ color: "var(--b-300)", marginRight: ".4rem" }} />linktree vs bannana.id perbandingan</div>
            <div><i className="fa-solid fa-quote-left" style={{ color: "var(--b-300)", marginRight: ".4rem" }} />tips konten kreator dapat followers dari link bio</div>
            <div><i className="fa-solid fa-quote-left" style={{ color: "var(--b-300)", marginRight: ".4rem" }} />cara jualan online dari 1 link saja</div>
          </div>
        </div>
      )}
    </div>
  );
}
