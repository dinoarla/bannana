"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmbedInfo } from "@/lib/utils/embed";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PublicBlock } from "@/types";

type PageState = {
  id: string;
  title: string;
  slug: string;
  theme: string;
  avatarUrl: string | null;
  isPublished: boolean;
  blocks: PublicBlock[];
};

const FREE_BLOCK_LIMIT = 10;
const FREE_THEMES = ["classic", "night", "vanilla"];

const EDITOR_THEMES = [
  { id: "classic",    label: "Classic",       bg: "linear-gradient(160deg,#FFFBEB,#FEF3C7)", bar1: "#F59E0B", bar2: "#FDE68A" },
  { id: "night",      label: "Night",         bg: "linear-gradient(160deg,#1A1409,#2E2210)", bar1: "#FBBF24", bar2: "#78350F" },
  { id: "vanilla",    label: "Vanilla",       bg: "linear-gradient(160deg,#FEFCE8,#FFF7ED)", bar1: "#FDE68A", bar2: "#FCD34D" },
  { id: "peach",      label: "Peach",         bg: "linear-gradient(160deg,#FFF7ED,#FEE2D5)", bar1: "#FB923C", bar2: "#FDBA74" },
  { id: "matcha",     label: "Matcha",        bg: "linear-gradient(160deg,#F0FDF4,#DCFCE7)", bar1: "#4ADE80", bar2: "#86EFAC" },
  { id: "blueberry",  label: "Blueberry",     bg: "linear-gradient(160deg,#1E1B4B,#312E81)", bar1: "#FACC15", bar2: "#6366F1" },
  { id: "strawberry", label: "Strawberry",    bg: "linear-gradient(160deg,#FFF1F2,#FFE4E6)", bar1: "#E11D48", bar2: "#FDA4AF" },
  { id: "licorice",   label: "Licorice",      bg: "linear-gradient(160deg,#0A0A0A,#1C1917)", bar1: "#A3E635", bar2: "#4ADE80" },
  { id: "rainbow",    label: "Rainbow",       bg: "linear-gradient(135deg,#FDE68A,#FCA5A5,#C4B5FD)", bar1: "#fff", bar2: "#FCA5A5" },
  { id: "cloud",      label: "Cloud Nine",    bg: "linear-gradient(160deg,#F8FAFC,#F1F5F9)", bar1: "#CBD5E1", bar2: "#94A3B8" },
  { id: "pumpkin",    label: "Pumpkin",       bg: "linear-gradient(160deg,#FFF7ED,#FFEDD5)", bar1: "#EA580C", bar2: "#FB923C" },
  { id: "glitter",    label: "Glitter Honey", bg: "linear-gradient(160deg,#0F0A00,#1C1409)", bar1: "#F59E0B", bar2: "#FBBF24" },
];

type Props = {
  initialPage: PageState;
  csrfToken: string;
  username: string;
  bio: string;
  profileAvatarUrl: string | null;
  isPro: boolean;
  allPages: { id: string; title: string }[];
};

const BLOCK_TYPES: { type: PublicBlock["type"]; label: string; icon: string; desc: string; section: string; badge?: string }[] = [
  { type: "LINK",      label: "Link",        icon: "fa-solid fa-link",            desc: "URL + ikon & deskripsi",           section: "Dasar" },
  { type: "HEADER",    label: "Header",      icon: "fa-solid fa-heading",         desc: "Judul atau teks besar",            section: "Dasar" },
  { type: "TEXT",      label: "Teks",        icon: "fa-solid fa-paragraph",       desc: "Paragraf teks bebas",              section: "Dasar" },
  { type: "DIVIDER",   label: "Divider",     icon: "fa-solid fa-minus",           desc: "Garis pemisah visual",             section: "Dasar" },
  { type: "BANNER",    label: "Banner",      icon: "fa-solid fa-rectangle-ad",    desc: "Strip pengumuman berwarna",        section: "Dasar" },
  { type: "IMAGE",     label: "Gambar",      icon: "fa-solid fa-image",           desc: "Upload foto / banner",             section: "Media" },
  { type: "EMBED",     label: "Embed",       icon: "fa-solid fa-circle-play",     desc: "YouTube, Spotify, SoundCloud",     section: "Media" },
  { type: "MAP",       label: "Peta",        icon: "fa-solid fa-map-location-dot",desc: "Embed Google Maps",                section: "Media" },
  { type: "CONTACT",   label: "Kontak",      icon: "fa-solid fa-address-card",    desc: "Tombol WA / Telegram / LINE",      section: "Interaksi" },
  { type: "FORM",      label: "Formulir",    icon: "fa-solid fa-clipboard-list",  desc: "Link ke Google Form / Typeform",   section: "Interaksi" },
  { type: "PRODUCT",   label: "Produk",      icon: "fa-solid fa-bag-shopping",    desc: "Gambar + harga + tombol beli",     section: "Interaksi" },
  { type: "FAQ",       label: "FAQ",         icon: "fa-solid fa-circle-question", desc: "Pertanyaan yang sering ditanyakan",section: "Interaksi" },
  { type: "COUNTDOWN", label: "Hitung Mundur",icon: "fa-solid fa-hourglass-half", desc: "Timer mundur ke tanggal tertentu", section: "Interaksi" },
];

const BLOCK_ICONS: Record<PublicBlock["type"], string> = {
  LINK:      "fa-solid fa-link",
  HEADER:    "fa-solid fa-heading",
  DIVIDER:   "fa-solid fa-minus",
  IMAGE:     "fa-solid fa-image",
  EMBED:     "fa-solid fa-circle-play",
  SOCIAL:    "fa-solid fa-share-nodes",
  TEXT:      "fa-solid fa-paragraph",
  BANNER:    "fa-solid fa-rectangle-ad",
  CONTACT:   "fa-solid fa-address-card",
  PRODUCT:   "fa-solid fa-bag-shopping",
  FAQ:       "fa-solid fa-circle-question",
  COUNTDOWN: "fa-solid fa-hourglass-half",
  MAP:       "fa-solid fa-map-location-dot",
  FORM:      "fa-solid fa-clipboard-list",
};

const BLOCK_LABELS: Record<PublicBlock["type"], string> = {
  LINK:      "Link",
  HEADER:    "Header",
  DIVIDER:   "Divider",
  IMAGE:     "Gambar",
  EMBED:     "Embed",
  SOCIAL:    "Sosial Media",
  TEXT:      "Teks",
  BANNER:    "Banner",
  CONTACT:   "Kontak",
  PRODUCT:   "Produk",
  FAQ:       "FAQ",
  COUNTDOWN: "Hitung Mundur",
  MAP:       "Peta",
  FORM:      "Formulir",
};

const SECTIONS = ["Dasar", "Media", "Interaksi"] as const;

export function BlockEditor({ initialPage, csrfToken, username, bio, profileAvatarUrl, isPro, allPages }: Props) {
  const router = useRouter();
  const [page, setPage] = useState<PageState>(initialPage);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialPage.blocks[0]?.id);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"blok" | "hal" | "tema">("blok");
  const [pvMode, setPvMode] = useState<"mob" | "desk">("mob");
  const [search, setSearch] = useState("");
  const [mobilePanel, setMobilePanel] = useState<"blocks" | "canvas" | "settings">("canvas");
  const [faqItems, setFaqItems] = useState<Array<{ q: string; a: string }>>([]);
  const [uploadError, setUploadError] = useState<string>("");
  // Halaman tab state
  const [slugVal, setSlugVal] = useState(initialPage.slug);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialPage.avatarUrl);
  // Tema tab state
  const [themeApplying, setThemeApplying] = useState(false);
  // Page switcher
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);

  const selected = useMemo(() => page.blocks.find((b) => b.id === selectedId), [page.blocks, selectedId]);

  useEffect(() => {
    setUploadError("");
    if (selected?.type === "FAQ") {
      setFaqItems((selected.config.items ?? []) as Array<{ q: string; a: string }>);
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const showSave = useCallback((msg = "Tersimpan otomatis") => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 2500);
  }, []);

  async function mutate<T>(url: string, init: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken, ...(init.headers ?? {}) },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message ?? "Error");
    return json.data as T;
  }

  async function addBlock(type: PublicBlock["type"]) {
    if (!isPro && page.blocks.length >= FREE_BLOCK_LIMIT) {
      showSave(`⚠ Limit ${FREE_BLOCK_LIMIT} blok — upgrade ke Pro`);
      return;
    }
    setSaving(true);
    try {
      const block = await mutate<PublicBlock>(`/api/pages/${page.id}/blocks`, {
        method: "POST",
        body: JSON.stringify({ type, config: defaultConfig(type) }),
      });
      setPage((p) => ({ ...p, blocks: [...p.blocks, block] }));
      setSelectedId(block.id);
      setActiveTab("blok");
      setMobilePanel("canvas");
      showSave("Blok ditambahkan ✓");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlock(blockId: string) {
    if (!confirm("Hapus blok ini?")) return;
    setSaving(true);
    try {
      await mutate(`/api/pages/${page.id}/blocks/${blockId}`, { method: "DELETE" });
      setPage((p) => ({ ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }));
      if (selectedId === blockId) setSelectedId(page.blocks.find((b) => b.id !== blockId)?.id);
      showSave("Blok dihapus");
    } finally {
      setSaving(false);
    }
  }

  async function toggleBlock(blockId: string, isEnabled: boolean) {
    setSaving(true);
    try {
      const updated = await mutate<PublicBlock>(`/api/pages/${page.id}/blocks/${blockId}`, {
        method: "PUT",
        body: JSON.stringify({ isEnabled }),
      });
      setPage((p) => ({ ...p, blocks: p.blocks.map((b) => (b.id === updated.id ? updated : b)) }));
    } finally {
      setSaving(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = page.blocks.findIndex((b) => b.id === active.id);
    const newIndex = page.blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(page.blocks, oldIndex, newIndex).map((b: PublicBlock, i: number) => ({ ...b, position: i + 1 }));

    setPage((p) => ({ ...p, blocks: reordered }));
    setSaving(true);
    try {
      await mutate(`/api/pages/${page.id}/blocks/reorder`, {
        method: "PUT",
        body: JSON.stringify(reordered.map((b: PublicBlock & { position: number }) => ({ id: b.id, position: b.position }))),
      });
      showSave("Urutan disimpan ✓");
    } finally {
      setSaving(false);
    }
  }

  async function saveBlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const title = String(fd.get("title") ?? "");
      const url = String(fd.get("url") ?? "");
      const subtitle = String(fd.get("subtitle") ?? "");
      const config: Record<string, unknown> = { ...selected.config };

      if (subtitle && ["LINK", "HEADER", "FORM"].includes(selected.type)) config.subtitle = subtitle;

      if (selected.type === "IMAGE" || selected.type === "PRODUCT") {
        const pending = imageData[selected.id];
        if (pending !== undefined) config.imageUrl = pending;
      }
      if (selected.type === "HEADER") config.align = String(fd.get("align") ?? "center");
      if (selected.type === "TEXT") {
        config.content = String(fd.get("content") ?? "");
        config.align = String(fd.get("align") ?? "left");
      }
      if (selected.type === "COUNTDOWN") config.targetDate = String(fd.get("targetDate") ?? "");
      if (selected.type === "CONTACT") {
        config.platform = String(fd.get("platform") ?? "whatsapp");
        config.handle = String(fd.get("handle") ?? "");
        config.message = String(fd.get("message") ?? "");
      }
      if (selected.type === "PRODUCT") {
        config.price = String(fd.get("price") ?? "");
        config.buttonText = String(fd.get("buttonText") ?? "Beli Sekarang");
      }
      if (selected.type === "BANNER") {
        config.bg = String(fd.get("bannerBg") ?? config.bg ?? "#FEF3C7");
        config.color = String(fd.get("bannerColor") ?? config.color ?? "#92400E");
        config.icon = String(fd.get("icon") ?? "📢");
      }
      if (selected.type === "MAP") {
        const rawEmbed = String(fd.get("embedUrl") ?? "");
        const srcMatch = rawEmbed.match(/src=["']([^"']+)["']/);
        config.embedUrl = srcMatch ? srcMatch[1] : rawEmbed.trim();
        config.height = Number(fd.get("height") ?? 300);
      }
      if (selected.type === "FORM") config.buttonText = String(fd.get("buttonText") ?? "Isi Formulir");
      if (selected.type === "FAQ") config.items = faqItems;

      const updated = await mutate<PublicBlock>(`/api/pages/${page.id}/blocks/${selected.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          url: ["LINK", "EMBED", "FORM", "PRODUCT"].includes(selected.type) ? url : selected.url,
          config,
        }),
      });
      setPage((p) => ({ ...p, blocks: p.blocks.map((b) => (b.id === updated.id ? updated : b)) }));
      if (selected.type === "IMAGE" || selected.type === "PRODUCT") {
        setImageData((prev) => { const n = { ...prev }; delete n[selected.id]; return n; });
      }
      showSave();
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (slugVal === page.slug) { setSlugStatus("idle"); return; }
    if (slugVal.length < 3) { setSlugStatus("idle"); return; }
    setSlugStatus("checking");
    if (slugTimer.current) clearTimeout(slugTimer.current);
    slugTimer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/pages/check-slug?slug=${encodeURIComponent(slugVal)}&pageId=${page.id}`);
        const j = await r.json();
        setSlugStatus(j.data?.available ? "ok" : "taken");
      } catch { setSlugStatus("idle"); }
    }, 500);
  }, [slugVal]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300_000) { showSave("⚠ Foto maks 300KB"); return; }
    const reader = new FileReader();
    reader.onload = () => { setAvatarPreview(reader.result as string); showSave("Foto dipilih ✓ — klik Simpan Halaman"); };
    reader.readAsDataURL(file);
  }

  async function savePage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (slugStatus === "taken") { showSave("⚠ Slug sudah dipakai, pilih yang lain"); return; }
    setSaving(true);
    try {
      const title = String(fd.get("pageTitle") ?? "");
      const updated = await mutate<PageState>(`/api/pages/${page.id}`, {
        method: "PUT",
        body: JSON.stringify({ title, slug: slugVal, avatarUrl: avatarPreview }),
      });
      setPage((p) => ({ ...p, title: updated.title, slug: updated.slug, avatarUrl: updated.avatarUrl }));
      setSlugStatus("idle");
      showSave("Halaman disimpan ✓");
    } catch (err) {
      showSave(`⚠ Gagal menyimpan: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setSaving(false);
    }
  }

  async function applyTheme(themeId: string) {
    if (themeApplying) return;
    setThemeApplying(true);
    try {
      await mutate<PageState>(`/api/pages/${page.id}`, {
        method: "PUT",
        body: JSON.stringify({ theme: themeId }),
      });
      setPage((p) => ({ ...p, theme: themeId }));
      showSave(`Tema "${EDITOR_THEMES.find(t => t.id === themeId)?.label}" diterapkan ✓`);
    } finally {
      setThemeApplying(false);
    }
  }

  async function togglePublish() {
    setSaving(true);
    try {
      const updated = await mutate<PageState>(`/api/pages/${page.id}/publish`, {
        method: "POST",
        body: JSON.stringify({ publish: !page.isPublished }),
      });
      setPage((p) => ({ ...p, isPublished: updated.isPublished }));
      showSave(updated.isPublished ? "Dipublikasikan! 🎉" : "Disembunyikan");
    } finally {
      setSaving(false);
    }
  }

  const filteredTypes = search
    ? BLOCK_TYPES.filter(
        (t) =>
          t.label.toLowerCase().includes(search.toLowerCase()) ||
          t.desc.toLowerCase().includes(search.toLowerCase())
      )
    : BLOCK_TYPES;

  return (
    <>
      {/* TOPBAR */}
      <div className="editor-top">
        <Link href="/pages" className="et-back">
          <i className="fa-solid fa-arrow-left" /> Dashboard
        </Link>
        <div className="et-divider" />
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="et-pagename"
            style={{ background: "none", border: "none", cursor: allPages.length > 1 ? "pointer" : "default", display: "flex", alignItems: "center", gap: ".35rem" }}
            onClick={() => allPages.length > 1 && setPageDropdownOpen((v) => !v)}
          >
            <i className="fa-solid fa-file-pen" style={{ color: "var(--b-500)", fontSize: ".82rem" }} />
            <span>{page.title}</span>
            {allPages.length > 1 && <i className={`fa-solid fa-chevron-${pageDropdownOpen ? "up" : "down"}`} style={{ fontSize: ".6rem", color: "var(--n-400)" }} />}
          </button>
          {pageDropdownOpen && allPages.length > 1 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", border: "1.5px solid var(--n-200)", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.1)", zIndex: 300, minWidth: 180, overflow: "hidden" }}>
              {allPages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setPageDropdownOpen(false); if (p.id !== page.id) router.push(`/pages/${p.id}`); }}
                  style={{ display: "flex", alignItems: "center", gap: ".5rem", width: "100%", padding: "9px 14px", background: p.id === page.id ? "var(--b-50)" : "#fff", border: "none", cursor: "pointer", fontSize: ".82rem", color: p.id === page.id ? "var(--b-700)" : "var(--n-700)", fontWeight: p.id === page.id ? 700 : 400, textAlign: "left" }}
                >
                  {p.id === page.id && <i className="fa-solid fa-check" style={{ fontSize: ".65rem", color: "var(--b-500)" }} />}
                  {p.id !== page.id && <i className="fa-solid fa-file-pen" style={{ fontSize: ".65rem", color: "var(--n-400)" }} />}
                  {p.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="et-saved" style={{ color: saveMsg ? "var(--b-600)" : "var(--n-400)", transition: "color .25s" }}>
          <i className={`fa-solid ${saveMsg ? "fa-circle-check" : "fa-circle-dot"}`} style={{ fontSize: ".65rem" }} />
          {" "}{saveMsg ?? "Siap"}
        </div>
        <div className="et-actions">
          <div className="pv-toggle">
            <button
              className={`pv-btn${pvMode === "mob" ? " act" : ""}`}
              onClick={() => setPvMode("mob")}
              title="Mobile"
            >
              <i className="fa-solid fa-mobile-screen" />
            </button>
            <button
              className={`pv-btn${pvMode === "desk" ? " act" : ""}`}
              onClick={() => setPvMode("desk")}
              title="Desktop"
            >
              <i className="fa-solid fa-desktop" />
            </button>
          </div>
          <Link href={`/${page.slug}`} target="_blank" className="et-btn et-ghost">
            <i className="fa-solid fa-eye" /> Preview
          </Link>
          <button
            className={`et-btn ${page.isPublished ? "et-ghost" : "et-primary"}`}
            onClick={togglePublish}
            disabled={saving}
          >
            <i className={`fa-solid ${page.isPublished ? "fa-eye-slash" : "fa-upload"}`} />
            {page.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="editor-body">
        {/* Backdrop for mobile slide-up panels */}
        {mobilePanel !== "canvas" && (
          <div className="mob-panel-overlay" onClick={() => setMobilePanel("canvas")} />
        )}

        {/* LEFT PANEL */}
        <div className={`panel-left${mobilePanel === "blocks" ? " mob-open" : ""}`}>
          <div className="pl-head">
            <div className="pl-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span><i className="fa-solid fa-plus-circle" /> Tambah Blok</span>
              {!isPro && (
                <span style={{
                  fontSize: ".68rem", fontWeight: 700,
                  color: page.blocks.length >= FREE_BLOCK_LIMIT ? "#DC2626" : "var(--n-500)",
                  background: page.blocks.length >= FREE_BLOCK_LIMIT ? "#FEE2E2" : "var(--n-100)",
                  padding: "2px 7px", borderRadius: 99,
                }}>
                  {page.blocks.length}/{FREE_BLOCK_LIMIT}
                </span>
              )}
            </div>
            <div className="pl-search-wrap">
              <i className="pl-search-ico fa-solid fa-search" />
              <input
                className="pl-search"
                type="text"
                placeholder="Cari blok..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {SECTIONS.map((sec) => {
            const items = filteredTypes.filter((t) => t.section === sec);
            if (items.length === 0) return null;
            return (
              <div key={sec}>
                <div className="pl-sec">{sec}</div>
                <div className="pl-blocks">
                  {items.map((t) => (
                    <div
                      key={t.type}
                      className="blib-item"
                      onClick={() => !saving && addBlock(t.type)}
                    >
                      <div className="blib-ico">
                        <i className={t.icon} />
                      </div>
                      <div>
                        <div className="blib-name">{t.label}</div>
                        <div className="blib-desc">{t.desc}</div>
                      </div>
                      {t.badge && <span className="new-badge">{t.badge}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {!isPro && page.blocks.length >= FREE_BLOCK_LIMIT && (
            <div style={{
              margin: "1rem .75rem .25rem", padding: ".75rem 1rem",
              background: "#FEF3C7", border: "1.5px solid #FDE68A", borderRadius: 12,
              fontSize: ".78rem", color: "#92400E",
            }}>
              <div style={{ fontWeight: 700, marginBottom: ".25rem" }}>
                <i className="fa-solid fa-lock" style={{ marginRight: 5 }} />Batas 10 blok tercapai
              </div>
              <div style={{ marginBottom: ".5rem" }}>Upgrade ke Pro untuk blok tak terbatas.</div>
              <a href="/langganan" style={{
                display: "inline-block", background: "#F59E0B", color: "#1C1409",
                fontWeight: 700, fontSize: ".75rem", padding: "4px 12px",
                borderRadius: 8, textDecoration: "none",
              }}>
                <i className="fa-solid fa-crown" /> Upgrade Pro
              </a>
            </div>
          )}
        </div>

        {/* CANVAS */}
        <div className="canvas-wrap">
          <div className="canvas" style={pvMode === "mob" ? { maxWidth: 420, margin: "0 auto" } : undefined}>
            <div className="canvas-meta">
              <div className="canvas-meta-txt">
                <i className="fa-solid fa-grip-vertical" /> {page.blocks.length} blok aktif
              </div>
              <div style={{ fontSize: ".72rem", color: "var(--n-400)" }}>Drag untuk ubah urutan</div>
            </div>
            <div className="canvas-blocks">
              {page.blocks.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "var(--n-400)",
                    fontSize: ".88rem",
                  }}
                >
                  Belum ada blok. Tambah dari panel kiri!
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={page.blocks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {page.blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        selected={block.id === selectedId}
                        onSelect={() => {
                          setSelectedId(block.id);
                          setActiveTab("blok");
                          if (typeof window !== "undefined" && window.innerWidth <= 768) {
                            setMobilePanel("settings");
                          }
                        }}
                        onDelete={() => deleteBlock(block.id)}
                        onToggle={(v) => toggleBlock(block.id, v)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
              <button
                className="add-block"
                onClick={() => {
                  setMobilePanel("blocks");
                  setTimeout(() => document.querySelector<HTMLInputElement>(".pl-search")?.focus(), 50);
                }}
              >
                <i className="fa-solid fa-plus" /> Tambah Blok Baru
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={`panel-right${mobilePanel === "settings" ? " mob-open" : ""}`}>
          <div className="pr-head">
            <div className="pr-tabs">
              <button
                className={`pr-tab${activeTab === "blok" ? " act" : ""}`}
                onClick={() => setActiveTab("blok")}
              >
                <i className="fa-solid fa-cube" /> Blok
              </button>
              <button
                className={`pr-tab${activeTab === "hal" ? " act" : ""}`}
                onClick={() => setActiveTab("hal")}
              >
                <i className="fa-solid fa-file" /> Halaman
              </button>
              <button
                className={`pr-tab${activeTab === "tema" ? " act" : ""}`}
                onClick={() => setActiveTab("tema")}
              >
                <i className="fa-solid fa-palette" /> Tema
              </button>
            </div>
          </div>

          {activeTab === "blok" && (
            <div className="pr-body">
              {selected ? (
                <>
                  <div>
                    <div className="pr-sec-title">
                      Pengaturan Blok: {BLOCK_LABELS[selected.type]}
                    </div>
                    <form
                      id="blok-form"
                      onSubmit={saveBlock}
                      style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
                    >
                      <div>
                        <div className="form-lbl" style={{ marginBottom: ".3rem" }}>
                          Judul
                        </div>
                        <input
                          key={`title-${selected.id}`}
                          name="title"
                          className="form-inp"
                          type="text"
                          defaultValue={selected.title ?? ""}
                        />
                      </div>

                      {selected.type === "LINK" && (
                        <div>
                          <div className="form-lbl" style={{ marginBottom: ".3rem" }}>URL</div>
                          <input key={`url-${selected.id}`} name="url" className="form-inp" type="text" defaultValue={selected.url ?? ""} placeholder="https://…" />
                        </div>
                      )}

                      {selected.type === "EMBED" && (
                        <EmbedSettings key={selected.id} block={selected} />
                      )}

                      {selected.type === "HEADER" && (
                        <>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Subjudul</div>
                            <input key={`sub-${selected.id}`} name="subtitle" className="form-inp" type="text" defaultValue={String(selected.config.subtitle ?? "")} />
                          </div>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Posisi Teks</div>
                            <div className="align-row">
                              {(["left", "center", "right"] as const).map((a) => (
                                <button key={a} type="button" className={`align-btn${(selected.config.align ?? "center") === a ? " act" : ""}`}>
                                  <i className={`fa-solid fa-align-${a}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {selected.type === "TEXT" && (
                        <>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Konten Teks</div>
                            <textarea key={`content-${selected.id}`} name="content" className="form-inp form-ta" style={{ minHeight: 100 }} defaultValue={String(selected.config.content ?? "")} placeholder="Tulis teks di sini..." />
                          </div>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Rata Teks</div>
                            <div className="align-row">
                              {(["left", "center", "right"] as const).map((a) => (
                                <button key={a} type="button" className={`align-btn${(selected.config.align ?? "left") === a ? " act" : ""}`}>
                                  <i className={`fa-solid fa-align-${a}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {selected.type === "BANNER" && (
                        <BannerSettings key={selected.id} block={selected} />
                      )}

                      {selected.type === "IMAGE" && (() => {
                        const preview = imageData[selected.id] !== undefined
                          ? imageData[selected.id]
                          : String(selected.config.imageUrl ?? "");
                        return (
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".5rem" }}>Gambar</div>
                            {preview ? (
                              <div style={{ position: "relative", marginBottom: ".75rem" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt="" style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 200 }} />
                                <button type="button" onClick={() => setImageData((p) => ({ ...p, [selected.id]: "" }))} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,.55)", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: ".72rem", cursor: "pointer", fontWeight: 700 }}>Ganti</button>
                              </div>
                            ) : (
                              <label htmlFor={`img-file-${selected.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".4rem", padding: "1.5rem 1rem", border: "2px dashed var(--b-300)", borderRadius: 10, cursor: "pointer", background: "var(--b-50)", textAlign: "center", marginBottom: ".75rem" }}>
                                <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "1.5rem", color: "var(--b-400)" }} />
                                <span style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--b-700)" }}>Klik untuk upload gambar</span>
                                <span style={{ fontSize: ".72rem", color: "var(--n-400)" }}>JPG, PNG, GIF, WebP · Maks 1 MB</span>
                              </label>
                            )}
                            <input id={`img-file-${selected.id}`} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 1_000_000) { setUploadError("File terlalu besar. Maks 1 MB — coba kompres dulu."); return; }
                                setUploadError("");
                                const reader = new FileReader();
                                reader.onload = (ev) => { setImageData((p) => ({ ...p, [selected.id]: ev.target?.result as string })); };
                                reader.readAsDataURL(file);
                              }}
                            />
                            {uploadError && (
                              <div style={{ marginTop: ".4rem", padding: ".45rem .75rem", background: "#FEE2E2", borderRadius: 8, fontSize: ".75rem", color: "#991b1b", display: "flex", alignItems: "center", gap: ".4rem" }}>
                                <i className="fa-solid fa-triangle-exclamation" />{uploadError}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {selected.type === "PRODUCT" && (() => {
                        const preview = imageData[selected.id] !== undefined
                          ? imageData[selected.id]
                          : String(selected.config.imageUrl ?? "");
                        return (
                          <>
                            <div>
                              <div className="form-lbl" style={{ marginBottom: ".3rem" }}>URL Produk (link beli)</div>
                              <input key={`url-${selected.id}`} name="url" className="form-inp" type="text" defaultValue={selected.url ?? ""} placeholder="https://tokopedia.com/..." />
                            </div>
                            <div>
                              <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Harga</div>
                              <input key={`price-${selected.id}`} name="price" className="form-inp" type="text" defaultValue={String(selected.config.price ?? "")} placeholder="Rp 50.000" />
                            </div>
                            <div>
                              <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Teks Tombol</div>
                              <input key={`btn-${selected.id}`} name="buttonText" className="form-inp" type="text" defaultValue={String(selected.config.buttonText ?? "Beli Sekarang")} />
                            </div>
                            <div>
                              <div className="form-lbl" style={{ marginBottom: ".5rem" }}>Foto Produk</div>
                              {preview ? (
                                <div style={{ position: "relative", marginBottom: ".75rem" }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={preview} alt="" style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 160 }} />
                                  <button type="button" onClick={() => setImageData((p) => ({ ...p, [selected.id]: "" }))} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,.55)", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: ".72rem", cursor: "pointer", fontWeight: 700 }}>Ganti</button>
                                </div>
                              ) : (
                                <label htmlFor={`prod-file-${selected.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".4rem", padding: "1rem", border: "2px dashed var(--b-300)", borderRadius: 10, cursor: "pointer", background: "var(--b-50)", textAlign: "center", marginBottom: ".5rem" }}>
                                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "1.3rem", color: "var(--b-400)" }} />
                                  <span style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--b-700)" }}>Upload foto produk</span>
                                </label>
                              )}
                              <input id={`prod-file-${selected.id}`} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  if (file.size > 1_000_000) { setUploadError("File terlalu besar. Maks 1 MB — coba kompres dulu."); return; }
                                  setUploadError("");
                                  const reader = new FileReader();
                                  reader.onload = (ev) => { setImageData((p) => ({ ...p, [selected.id]: ev.target?.result as string })); };
                                  reader.readAsDataURL(file);
                                }}
                              />
                              {uploadError && (
                                <div style={{ marginTop: ".4rem", padding: ".45rem .75rem", background: "#FEE2E2", borderRadius: 8, fontSize: ".75rem", color: "#991b1b", display: "flex", alignItems: "center", gap: ".4rem" }}>
                                  <i className="fa-solid fa-triangle-exclamation" />{uploadError}
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}

                      {selected.type === "CONTACT" && (
                        <>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Platform</div>
                            <select key={`plat-${selected.id}`} name="platform" className="form-inp" defaultValue={String(selected.config.platform ?? "whatsapp")}>
                              <option value="whatsapp">WhatsApp</option>
                              <option value="telegram">Telegram</option>
                              <option value="line">LINE</option>
                              <option value="email">Email</option>
                            </select>
                          </div>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Nomor / Username / Email</div>
                            <input key={`handle-${selected.id}`} name="handle" className="form-inp" type="text" defaultValue={String(selected.config.handle ?? "")} placeholder="628123456789 / @username / email@..." />
                          </div>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Pesan Pre-filled (opsional)</div>
                            <textarea key={`msg-${selected.id}`} name="message" className="form-inp form-ta" defaultValue={String(selected.config.message ?? "")} placeholder="Halo, saya tertarik dengan..." />
                          </div>
                        </>
                      )}

                      {selected.type === "COUNTDOWN" && (
                        <div>
                          <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Target Tanggal & Waktu</div>
                          <input key={`cd-${selected.id}`} name="targetDate" className="form-inp" type="datetime-local" defaultValue={selected.config.targetDate ? new Date(String(selected.config.targetDate)).toISOString().slice(0,16) : ""} />
                        </div>
                      )}

                      {selected.type === "MAP" && (
                        <>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>URL Embed Google Maps</div>
                            <textarea key={`map-${selected.id}`} name="embedUrl" className="form-inp form-ta" defaultValue={String(selected.config.embedUrl ?? "")} placeholder={'Paste kode <iframe> dari Google Maps\natau langsung URL https://www.google.com/maps/embed?...'} style={{ fontSize: ".72rem", minHeight: 80 }} />
                            <div style={{ fontSize: ".68rem", color: "var(--n-400)", marginTop: 3 }}>
                              <i className="fa-solid fa-circle-info" style={{ color: "var(--b-400)" }} /> Google Maps → Share → Embed a map → salin seluruh kode iframe atau hanya URL dari src=""
                            </div>
                          </div>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Tinggi Peta (px)</div>
                            <input key={`mh-${selected.id}`} name="height" className="form-inp" type="number" min={150} max={600} defaultValue={Number(selected.config.height ?? 300)} />
                          </div>
                        </>
                      )}

                      {selected.type === "FORM" && (
                        <>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>URL Formulir</div>
                            <input key={`furl-${selected.id}`} name="url" className="form-inp" type="text" defaultValue={selected.url ?? ""} placeholder="https://forms.google.com/..." />
                          </div>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Deskripsi (opsional)</div>
                            <input key={`fdesc-${selected.id}`} name="subtitle" className="form-inp" type="text" defaultValue={String(selected.config.subtitle ?? "")} placeholder="Isi formulir kami..." />
                          </div>
                          <div>
                            <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Teks Tombol</div>
                            <input key={`fbtn-${selected.id}`} name="buttonText" className="form-inp" type="text" defaultValue={String(selected.config.buttonText ?? "Isi Formulir")} />
                          </div>
                        </>
                      )}

                      {selected.type === "FAQ" && (
                        <FaqEditor items={faqItems} onChange={setFaqItems} />
                      )}

                      {selected.type === "LINK" && (
                        <div>
                          <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Deskripsi</div>
                          <textarea key={`desc-${selected.id}`} name="subtitle" className="form-inp form-ta" defaultValue={String(selected.config.subtitle ?? "")} />
                        </div>
                      )}

                    </form>
                  </div>

                  <div>
                    <div className="pr-sec-title">Visibilitas</div>
                    <div className="toggle-row">
                      <span className="toggle-row-lbl">
                        <i className="fa-solid fa-eye" /> Tampilkan blok
                      </span>
                      <div
                        className={`toggle${selected.isEnabled ? "" : " off"}`}
                        onClick={() => toggleBlock(selected.id, !selected.isEnabled)}
                      />
                    </div>
                    <div className="toggle-row">
                      <span className="toggle-row-lbl">
                        <i className="fa-solid fa-mobile-screen" /> Tampil di mobile
                      </span>
                      <div className="toggle" />
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem 1rem",
                    color: "var(--n-400)",
                    fontSize: ".82rem",
                  }}
                >
                  Pilih blok di canvas untuk mengeditnya.
                </div>
              )}
            </div>
          )}

          {activeTab === "hal" && (
            <div className="pr-body">
              <div>
                <div className="pr-sec-title">Profil Halaman</div>
                <form
                  id="hal-form"
                  onSubmit={savePage}
                  style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
                >
                  <div>
                    <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Nama Tampilan</div>
                    <input name="pageTitle" className="form-inp" type="text" defaultValue={page.title} />
                  </div>
                  <div>
                    <div className="form-lbl" style={{ marginBottom: ".3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>Slug URL</span>
                      {slugStatus === "checking" && <span style={{ fontSize: ".65rem", color: "var(--n-400)" }}><i className="fa-solid fa-spinner fa-spin" /> memeriksa…</span>}
                      {slugStatus === "ok" && <span style={{ fontSize: ".65rem", color: "#059669", fontWeight: 700 }}><i className="fa-solid fa-check" /> tersedia</span>}
                      {slugStatus === "taken" && <span style={{ fontSize: ".65rem", color: "#DC2626", fontWeight: 700 }}><i className="fa-solid fa-xmark" /> sudah dipakai</span>}
                    </div>
                    <input
                      className="form-inp"
                      type="text"
                      value={slugVal}
                      onChange={(e) => setSlugVal(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      style={{ borderColor: slugStatus === "taken" ? "#DC2626" : slugStatus === "ok" ? "#059669" : undefined }}
                    />
                    <div style={{ fontSize: ".65rem", color: "var(--n-400)", marginTop: ".25rem" }}>
                      bannana.id/{slugVal || username}
                    </div>
                  </div>
                  <div>
                    <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Foto Profil Halaman</div>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <div
                        style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,var(--b-400),var(--b-600))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-950)", flexShrink: 0, overflow: "hidden", padding: (avatarPreview ?? profileAvatarUrl) ? 0 : undefined }}
                      >
                        {(avatarPreview ?? profileAvatarUrl)
                          ? <img src={avatarPreview ?? profileAvatarUrl!} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <i className="fa-solid fa-user" />}
                      </div>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        style={{ flex: 1, height: 32, borderRadius: 8, border: "1.5px solid var(--b-300)", background: "var(--b-50)", color: "var(--b-700)", fontSize: ".75rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-upload" /> Upload Foto
                      </button>
                      {avatarPreview && avatarPreview !== profileAvatarUrl && (
                        <button type="button" onClick={() => setAvatarPreview(null)} style={{ border: "none", background: "none", color: "var(--n-400)", cursor: "pointer", fontSize: ".8rem", flexShrink: 0 }} title="Hapus foto halaman">
                          <i className="fa-solid fa-xmark" />
                        </button>
                      )}
                    </div>
                    <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarPick} />
                    <div style={{ fontSize: ".62rem", color: "var(--n-400)", marginTop: ".25rem" }}>Maks 300KB. Default dari foto profil di Pengaturan.</div>
                  </div>
                </form>
              </div>
              <div>
                <div className="pr-sec-title">Preview Mobile</div>
                <div className="mini-phone">
                  <div className="mp-inner">
                    <div className="mp-screen">
                      <div className="mp-av" style={{ overflow: "hidden", padding: (avatarPreview ?? profileAvatarUrl) ? 0 : undefined }}>
                        {(avatarPreview ?? profileAvatarUrl)
                          ? <img src={avatarPreview ?? profileAvatarUrl!} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                          : <i className="fa-solid fa-user" />}
                      </div>
                      <div className="mp-name">@{username}</div>
                      <div className="mp-bio">{bio || "Bio kamu tampil di sini"}</div>
                      {page.blocks.filter((b) => b.isEnabled && b.type === "LINK").slice(0, 3).map((b) => (
                        <div key={b.id} className="mp-link">
                          <div className="mp-link-ico" style={{ background: "var(--b-100)", color: "var(--b-700)" }}><i className="fa-solid fa-link" /></div>
                          <span className="mp-link-t">{b.title ?? "Link"}</span>
                          <div className="mp-link-arr"><i className="fa-solid fa-chevron-right" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tema" && (
            <div className="pr-body">
              <div>
                <div className="pr-sec-title">Pilih Tema</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".4rem", marginBottom: "1rem" }}>
                  {EDITOR_THEMES.map((t) => {
                    const isFree = FREE_THEMES.includes(t.id);
                    const isActive = page.theme === t.id;
                    const locked = !isPro && !isFree;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={themeApplying}
                        onClick={() => !locked && applyTheme(t.id)}
                        title={locked ? "Fitur Pro" : t.label}
                        style={{ borderRadius: 10, overflow: "hidden", border: `2px solid ${isActive ? "var(--b-500)" : "var(--n-200)"}`, cursor: locked ? "not-allowed" : "pointer", background: "none", padding: 0, position: "relative", opacity: locked ? 0.55 : 1 }}
                      >
                        <div style={{ height: 38, background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: 5 }}>
                          <div style={{ height: 5, background: t.bar1, borderRadius: 3, width: "75%" }} />
                          <div style={{ height: 5, background: t.bar2, borderRadius: 3, width: "60%" }} />
                        </div>
                        <div style={{ padding: "3px 5px", background: "white", fontSize: ".58rem", fontWeight: isActive ? 800 : 600, color: isActive ? "var(--b-900)" : "var(--n-600)", display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
                          {isActive && <i className="fa-solid fa-check" style={{ color: "var(--b-500)" }} />}
                          {locked && <i className="fa-solid fa-lock" style={{ color: "var(--n-400)", fontSize: ".5rem" }} />}
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 48 }}>{t.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!isPro && (
                  <div style={{ fontSize: ".7rem", color: "var(--n-400)", marginBottom: ".75rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                    <i className="fa-solid fa-lock" style={{ color: "var(--b-400)", fontSize: ".65rem" }} />
                    9 tema premium tersedia dengan <Link href="/langganan" style={{ color: "var(--b-600)", fontWeight: 700 }}>bannana.id Pro</Link>
                  </div>
                )}
              </div>
              <div>
                <div className="pr-sec-title">Kustomisasi Warna</div>
                <div style={{ marginBottom: ".75rem" }}>
                  <div className="form-lbl" style={{ marginBottom: ".3rem" }}>
                    Warna Tombol
                  </div>
                  <div className="color-row">
                    {["#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6", "#10B981", "#EC4899", "#1C1917"].map(
                      (c) => (
                        <div
                          key={c}
                          className={`color-sw${c === "#F59E0B" ? " act" : ""}`}
                          style={{
                            background: c,
                            ...(c === "#1C1917" ? { border: "1.5px solid var(--n-200)" } : {}),
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
                <div>
                  <div className="form-lbl" style={{ marginBottom: ".3rem" }}>
                    Font Heading
                  </div>
                  <select className="form-inp" style={{ cursor: "pointer" }}>
                    <option>Fredoka (Default)</option>
                    <option>Plus Jakarta Sans</option>
                    <option>DM Sans</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="pr-sec-title">Custom CSS</div>
                <textarea
                  className="form-inp form-ta"
                  style={{ height: 90, fontFamily: "var(--fm)", fontSize: ".7rem" }}
                  placeholder={"/* Custom CSS hingga 5KB */\n.link-card { border-radius: 20px; }"}
                />
                <div style={{ fontSize: ".68rem", color: "var(--n-400)", marginTop: 3 }}>
                  <i className="fa-solid fa-circle-info" style={{ color: "var(--b-400)" }} /> Fitur
                  Pro · 0 / 5120 byte
                </div>
              </div>
            </div>
          )}

          {activeTab !== "tema" && (
            <button
              type="submit"
              form={activeTab === "blok" ? "blok-form" : "hal-form"}
              className="save-bottom"
              disabled={saving}
            >
              <i className="fa-solid fa-check" /> {activeTab === "hal" ? "Simpan Halaman" : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM TAB BAR — switches between Add / Canvas / Settings panels */}
      <div className="mob-editor-tabs">
        <button
          className={`mob-editor-tab${mobilePanel === "blocks" ? " act" : ""}`}
          onClick={() => setMobilePanel(mobilePanel === "blocks" ? "canvas" : "blocks")}
        >
          <i className="fa-solid fa-plus-circle" />
          <span>Tambah</span>
        </button>
        <button
          className={`mob-editor-tab${mobilePanel === "canvas" ? " act" : ""}`}
          onClick={() => setMobilePanel("canvas")}
        >
          <i className="fa-solid fa-table-columns" />
          <span>Canvas</span>
        </button>
        <button
          className={`mob-editor-tab${mobilePanel === "settings" ? " act" : ""}`}
          onClick={() => setMobilePanel(mobilePanel === "settings" ? "canvas" : "settings")}
        >
          <i className="fa-solid fa-sliders" />
          <span>Pengaturan</span>
        </button>
      </div>
    </>
  );
}

function SortableBlock({
  block,
  selected,
  onSelect,
  onDelete,
  onToggle,
}: {
  block: PublicBlock;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`cblock${selected ? " sel" : ""}${!block.isEnabled ? " disabled" : ""}`}
        onClick={onSelect}
      >
        <div className="cblock-bar">
          <i
            {...attributes}
            {...listeners}
            className="drag-handle fa-solid fa-grip-vertical"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="btype">
            <i className={BLOCK_ICONS[block.type]} /> {BLOCK_LABELS[block.type]}
          </span>
          <div className="bactions">
            <div
              className={`toggle${block.isEnabled ? "" : " off"}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(!block.isEnabled);
              }}
            />
            <button
              className="bact-btn del"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <i className="fa-solid fa-trash" />
            </button>
          </div>
        </div>
        <div className="cblock-body">
          <BlockPreview block={block} />
        </div>
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: PublicBlock }) {
  if (block.type === "LINK") {
    return (
      <div className="link-prev">
        <div className="lp-ico" style={{ background: "var(--b-100)", color: "var(--b-700)" }}>
          <i className="fa-solid fa-link" />
        </div>
        <div>
          <div className="lp-title">{block.title || "Judul Link"}</div>
          <div className="lp-url">{block.url || "https://example.com"}</div>
        </div>
        <div className="lp-arr">
          <i className="fa-solid fa-chevron-right" />
        </div>
      </div>
    );
  }
  if (block.type === "HEADER") {
    return (
      <div className="header-prev">
        <div className="hp-t">{block.title || "Heading"}</div>
        {block.config.subtitle && <div className="hp-s">{String(block.config.subtitle)}</div>}
      </div>
    );
  }
  if (block.type === "DIVIDER") {
    return (
      <div className="div-prev">
        <div className="div-l" />
        <div className="div-d" />
        <div className="div-l" />
      </div>
    );
  }
  if (block.type === "SOCIAL") {
    return (
      <div className="soc-prev">
        {[
          { label: "Instagram", icon: "fa-brands fa-instagram", color: "#E1306C" },
          { label: "Twitter", icon: "fa-brands fa-x-twitter", color: "#1DA1F2" },
          { label: "LinkedIn", icon: "fa-brands fa-linkedin", color: "#0A66C2" },
        ].map((s) => (
          <div key={s.label} className="sp-chip" style={{ color: s.color }}>
            <i className={s.icon} /> {s.label}
          </div>
        ))}
      </div>
    );
  }
  if (block.type === "EMBED") {
    const embed = block.url ? getEmbedInfo(block.url) : null;
    const platformIcons: Record<string, string> = {
      youtube: "fa-brands fa-youtube",
      spotify: "fa-brands fa-spotify",
      soundcloud: "fa-brands fa-soundcloud",
    };
    const icon = embed && embed.type !== "unknown" ? (platformIcons[embed.type] ?? "fa-solid fa-circle-play") : "fa-solid fa-circle-play";
    return (
      <div className="embed-prev">
        <i className={icon} />
        <span>{block.url || "Paste URL YouTube / Spotify / SoundCloud"}</span>
      </div>
    );
  }
  if (block.type === "IMAGE") {
    const imgSrc = block.config.imageUrl as string | undefined;
    if (imgSrc) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt="" style={{ width: "100%", maxHeight: 90, objectFit: "cover", borderRadius: 8, display: "block" }} />
      );
    }
    return (
      <div className="img-prev">
        <i className="fa-solid fa-cloud-arrow-up" />
        <span>Klik untuk upload gambar</span>
      </div>
    );
  }
  if (block.type === "TEXT") {
    return (
      <div className="text-prev">
        <span>{String(block.config.content ?? block.title ?? "Teks kosong").slice(0, 80)}</span>
      </div>
    );
  }
  if (block.type === "BANNER") {
    return (
      <div className="banner-prev" style={{ background: String(block.config.bg ?? "#FEF3C7"), color: String(block.config.color ?? "#92400E") }}>
        <span>{String(block.config.icon ?? "📢")}</span>
        <span>{block.title || "Teks banner"}</span>
      </div>
    );
  }
  if (block.type === "CONTACT") {
    const platformIcons: Record<string, string> = { whatsapp: "fa-brands fa-whatsapp", telegram: "fa-brands fa-telegram", line: "fa-brands fa-line", email: "fa-solid fa-envelope" };
    const icon = platformIcons[String(block.config.platform ?? "whatsapp")] ?? "fa-solid fa-phone";
    return (
      <div className="embed-prev">
        <i className={icon} />
        <span>{block.title || String(block.config.handle || "Kontak")}</span>
      </div>
    );
  }
  if (block.type === "PRODUCT") {
    return (
      <div className="link-prev">
        <div className="lp-ico" style={{ background: "var(--b-100)", color: "var(--b-700)" }}>
          <i className="fa-solid fa-bag-shopping" />
        </div>
        <div>
          <div className="lp-title">{block.title || "Nama Produk"}</div>
          <div className="lp-url">{String(block.config.price || "Harga belum diatur")}</div>
        </div>
      </div>
    );
  }
  if (block.type === "FAQ") {
    const count = (block.config.items as unknown[] | undefined)?.length ?? 0;
    return (
      <div className="embed-prev">
        <i className="fa-solid fa-circle-question" />
        <span>{block.title || "FAQ"} · {count} pertanyaan</span>
      </div>
    );
  }
  if (block.type === "COUNTDOWN") {
    return (
      <div className="embed-prev">
        <i className="fa-solid fa-hourglass-half" />
        <span>{block.config.targetDate ? new Date(String(block.config.targetDate)).toLocaleDateString("id-ID") : "Atur tanggal target"}</span>
      </div>
    );
  }
  if (block.type === "MAP") {
    return (
      <div className="embed-prev">
        <i className="fa-solid fa-map-location-dot" />
        <span>{block.title || (block.config.embedUrl ? "Peta terpasang" : "Tempel URL embed peta")}</span>
      </div>
    );
  }
  if (block.type === "FORM") {
    return (
      <div className="embed-prev">
        <i className="fa-solid fa-clipboard-list" />
        <span>{block.title || (block.url ? "Formulir terpasang" : "Tempel URL formulir")}</span>
      </div>
    );
  }
  return null;
}

const EMBED_PLATFORMS: Record<string, { icon: string; label: string; color: string }> = {
  youtube: { icon: "fa-brands fa-youtube", label: "YouTube", color: "#FF0000" },
  spotify: { icon: "fa-brands fa-spotify", label: "Spotify", color: "#1DB954" },
  soundcloud: { icon: "fa-brands fa-soundcloud", label: "SoundCloud", color: "#FF7700" },
};

function EmbedSettings({ block }: { block: PublicBlock }) {
  const [url, setUrl] = useState(block.url ?? "");
  const embed = url.trim() ? getEmbedInfo(url.trim()) : null;
  const platform = embed && embed.type !== "unknown" ? EMBED_PLATFORMS[embed.type] : null;

  return (
    <div>
      <div className="form-lbl" style={{ marginBottom: ".3rem" }}>URL Embed</div>
      <input
        name="url"
        className="form-inp"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="YouTube, Spotify, atau SoundCloud..."
      />
      {platform ? (
        <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginTop: ".4rem", fontSize: ".75rem", color: platform.color }}>
          <i className={platform.icon} />
          <span>{platform.label} terdeteksi ✓</span>
        </div>
      ) : url.trim() ? (
        <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginTop: ".4rem", fontSize: ".75rem", color: "var(--n-400)" }}>
          <i className="fa-solid fa-circle-info" />
          <span>Tempel URL YouTube, Spotify, atau SoundCloud</span>
        </div>
      ) : null}
    </div>
  );
}

function FaqEditor({ items, onChange }: { items: Array<{ q: string; a: string }>; onChange: (items: Array<{ q: string; a: string }>) => void }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem" }}>
        <div className="form-lbl">Pertanyaan & Jawaban</div>
        <button
          type="button"
          onClick={() => onChange([...items, { q: "", a: "" }])}
          style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--b-600)", background: "var(--b-50)", border: "1px solid var(--b-200)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}
        >
          <i className="fa-solid fa-plus" /> Tambah
        </button>
      </div>
      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: ".75rem", color: "var(--n-400)", fontSize: ".8rem", border: "1.5px dashed var(--n-200)", borderRadius: 8 }}>
          Belum ada pertanyaan. Klik Tambah.
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{ border: "1.5px solid var(--n-200)", borderRadius: 8, padding: ".6rem .75rem", marginBottom: ".4rem", display: "flex", flexDirection: "column", gap: ".35rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--n-400)" }}>#{i + 1}</span>
            <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ fontSize: ".68rem", color: "#DC2626", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
              <i className="fa-solid fa-trash" />
            </button>
          </div>
          <input
            className="form-inp"
            style={{ fontSize: ".8rem" }}
            value={item.q}
            onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, q: e.target.value } : it))}
            placeholder="Pertanyaan..."
          />
          <textarea
            className="form-inp form-ta"
            style={{ fontSize: ".8rem", minHeight: 56 }}
            value={item.a}
            onChange={(e) => onChange(items.map((it, idx) => idx === i ? { ...it, a: e.target.value } : it))}
            placeholder="Jawaban..."
          />
        </div>
      ))}
    </div>
  );
}

const BANNER_PRESETS = [
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#DCFCE7", color: "#166534" },
  { bg: "#DBEAFE", color: "#1e3a8a" },
  { bg: "#FCE7F3", color: "#9d174d" },
  { bg: "#FEE2E2", color: "#991b1b" },
  { bg: "#1C1409", color: "#FBBF24" },
];

function BannerSettings({ block }: { block: PublicBlock }) {
  const [bg, setBg] = useState(String(block.config.bg ?? "#FEF3C7"));
  const [color, setColor] = useState(String(block.config.color ?? "#92400E"));
  return (
    <>
      <div>
        <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Ikon (emoji)</div>
        <input name="icon" className="form-inp" type="text" defaultValue={String(block.config.icon ?? "📢")} placeholder="📢" maxLength={4} />
      </div>
      <div>
        <div className="form-lbl" style={{ marginBottom: ".3rem" }}>Warna Latar</div>
        <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: ".4rem" }}>
          {BANNER_PRESETS.map((opt) => (
            <button key={opt.bg} type="button"
              onClick={() => { setBg(opt.bg); setColor(opt.color); }}
              style={{ width: 32, height: 32, borderRadius: 8, background: opt.bg,
                border: `2.5px solid ${bg === opt.bg ? "var(--b-500)" : "transparent"}`,
                cursor: "pointer", flexShrink: 0 }}
            />
          ))}
        </div>
        <input type="hidden" name="bannerBg" value={bg} onChange={() => {}} />
        <input type="hidden" name="bannerColor" value={color} onChange={() => {}} />
      </div>
    </>
  );
}

function defaultConfig(type: PublicBlock["type"]): Record<string, unknown> {
  if (type === "LINK")      return { subtitle: "", icon: "↗", bg: "var(--b-100)", color: "var(--b-700)" };
  if (type === "HEADER")    return { subtitle: "", align: "center" };
  if (type === "EMBED")     return {};
  if (type === "IMAGE")     return { imageUrl: "" };
  if (type === "SOCIAL")    return { socials: [] };
  if (type === "TEXT")      return { content: "", align: "left" };
  if (type === "BANNER")    return { icon: "📢", bg: "#FEF3C7", color: "#92400E" };
  if (type === "CONTACT")   return { platform: "whatsapp", handle: "", message: "" };
  if (type === "PRODUCT")   return { imageUrl: "", price: "", buttonText: "Beli Sekarang" };
  if (type === "FAQ")       return { items: [] };
  if (type === "COUNTDOWN") return { targetDate: "" };
  if (type === "MAP")       return { embedUrl: "", height: 300 };
  if (type === "FORM")      return { buttonText: "Isi Formulir", subtitle: "" };
  return {};
}
