"use client";

import { useState } from "react";

const THEMES = [
  { id: "classic",    name: "Bannana Classic",  mood: "Light · Playful",  tags: ["Default", "Kuning"],   icon: "fa-sun",              bg: "bg-classic",    btnColor: "#F59E0B", avColor: "#F59E0B", dark: false },
  { id: "night",      name: "Bannana Night",     mood: "Dark · Warm",      tags: ["Dark", "Hangat"],      icon: "fa-moon",             bg: "bg-night",      btnColor: "#FBBF24", avColor: "#FBBF24", dark: true  },
  { id: "vanilla",    name: "Vanilla Cream",     mood: "Light · Soft",     tags: ["Lembut", "Krem"],      icon: "fa-ice-cream",        bg: "bg-vanilla",    btnColor: "#FDE68A", avColor: "#F59E0B", dark: false },
  { id: "peach",      name: "Peach Blossom",     mood: "Light · Sweet",    tags: ["Manis", "Peach"],      icon: "fa-heart",            bg: "bg-peach",      btnColor: "#FB923C", avColor: "#FB923C", dark: false },
  { id: "matcha",     name: "Matcha Latte",      mood: "Light · Natural",  tags: ["Hijau", "Natural"],    icon: "fa-leaf",             bg: "bg-matcha",     btnColor: "#4ADE80", avColor: "#4ADE80", dark: false },
  { id: "blueberry",  name: "Blueberry",         mood: "Dark · Bold",      tags: ["Dark", "Navy"],        icon: "fa-circle",           bg: "bg-blueberry",  btnColor: "#FACC15", avColor: "#6366F1", dark: true  },
  { id: "strawberry", name: "Strawberry",        mood: "Light · Vibrant",  tags: ["Merah", "Vibrant"],    icon: "fa-fire",             bg: "bg-strawberry", btnColor: "#E11D48", avColor: "#E11D48", dark: false },
  { id: "licorice",   name: "Licorice",          mood: "Dark · Minimal",   tags: ["Dark", "Minimal"],     icon: "fa-star",             bg: "bg-licorice",   btnColor: "#A3E635", avColor: "#A3E635", dark: true  },
  { id: "rainbow",    name: "Rainbow Sherbet",   mood: "Light · Fun",      tags: ["Colorful", "Fun"],     icon: "fa-wand-sparkles",    bg: "bg-rainbow",    btnColor: "white",   avColor: "#FCA5A5", dark: false },
  { id: "cloud",      name: "Cloud Nine",        mood: "Light · Clean",    tags: ["Bersih", "Putih"],     icon: "fa-cloud",            bg: "bg-cloud",      btnColor: "#CBD5E1", avColor: "#CBD5E1", dark: false },
  { id: "pumpkin",    name: "Pumpkin Spice",     mood: "Light · Cozy",     tags: ["Oranye", "Cozy"],      icon: "fa-fire-flame-curved",bg: "bg-pumpkin",    btnColor: "#EA580C", avColor: "#EA580C", dark: false },
  { id: "glitter",    name: "Glitter Honey",     mood: "Dark · Glamour",   tags: ["Dark", "Mewah"],       icon: "fa-gem",              bg: "bg-glitter",    btnColor: "#F59E0B", avColor: "#F59E0B", dark: true  },
];

type Filter = "all" | "light" | "dark" | "playful" | "minimal";
const PLAYFUL = ["classic", "rainbow", "strawberry", "peach"];
const MINIMAL = ["cloud", "licorice", "vanilla"];

export function ThemeSelector({ pageId, currentTheme, csrfToken }: { pageId: string; currentTheme: string; csrfToken: string }) {
  const [selected, setSelected] = useState(currentTheme);
  const [filter, setFilter] = useState<Filter>("all");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [cssBytes, setCssBytes] = useState(0);
  const [pendingName, setPendingName] = useState("");

  const visible = THEMES.filter((t) => {
    if (filter === "light") return !t.dark;
    if (filter === "dark") return t.dark;
    if (filter === "playful") return PLAYFUL.includes(t.id);
    if (filter === "minimal") return MINIMAL.includes(t.id);
    return true;
  });

  async function applyTheme(id: string) {
    setSelected(id);
    const name = THEMES.find((t) => t.id === id)?.name ?? id;
    setPendingName(name);
  }

  async function saveTheme() {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify({ theme: selected }),
      });
      const json = await res.json();
      if (!json.success) { alert(json.error?.message ?? "Gagal menyimpan tema."); setSelected(currentTheme); return; }
      setMsg(`Tema "${THEMES.find((t) => t.id === selected)?.name}" diterapkan!`);
      setTimeout(() => setMsg(""), 3000);
    } finally { setSaving(false); }
  }

  return (
    <>
      {/* Apply button — shown in topbar context via portal would be complex; render here */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem", gap: ".75rem", alignItems: "center" }}>
        {msg && <span style={{ fontSize: ".84rem", color: "var(--success-600)", fontWeight: 600 }}><i className="fa-solid fa-check" /> {msg}</span>}
        <button className="btn btn-primary btn-sm" onClick={saveTheme} disabled={saving}>
          {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Menyimpan…</> : <><i className="fa-solid fa-check" /> {pendingName ? `Terapkan "${pendingName}"` : "Terapkan Tema"}</>}
        </button>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        {([
          { id: "all" as Filter, label: `Semua (${THEMES.length})` },
          { id: "light" as Filter, label: "Light (8)", icon: "fa-sun" },
          { id: "dark" as Filter, label: "Dark (4)", icon: "fa-moon" },
          { id: "playful" as Filter, label: "Playful", icon: "fa-star" },
          { id: "minimal" as Filter, label: "Minimal", icon: "fa-minus" },
        ] as Array<{ id: Filter; label: string; icon?: string }>).map((f) => (
          <button key={f.id} className={`filter-btn${filter === f.id ? " act" : ""}`} onClick={() => setFilter(f.id)}>
            {f.icon && <i className={`fa-solid ${f.icon}`} style={{ marginRight: 5 }} />}{f.label}
          </button>
        ))}
      </div>

      {/* THEMES GRID */}
      <div className="themes-grid">
        {visible.map((t) => (
          <button key={t.id} className={`theme-card tc-${t.id}${selected === t.id ? " active" : ""}`} onClick={() => applyTheme(t.id)}>
            {selected === t.id && <div className="active-badge"><i className="fa-solid fa-check" /> Aktif</div>}
            <div className={`theme-preview ${t.bg}`}>
              <div className="tp-phone" style={{ background: `rgba(255,255,255,${t.dark ? ".12" : ".9"})` }}>
                <div className="tp-av" style={{ background: t.avColor }} />
                <div className="tp-bar" style={{ background: t.btnColor, width: "85%" }} />
                <div className="tp-bar" style={{ background: t.btnColor, opacity: .6, width: "70%" }} />
                <div className="tp-bar" style={{ background: t.btnColor, opacity: .4, width: "60%" }} />
              </div>
            </div>
            <div className="theme-info" style={{ background: t.dark ? "#1C1917" : "white" }}>
              <div className="theme-name" style={{ color: t.dark ? "#FEF3C7" : undefined }}>
                <span><i className={`fa-solid ${t.icon}`} style={{ color: t.btnColor, marginRight: 5 }} />{t.name}</span>
              </div>
              <div className="theme-mood" style={{ color: t.dark ? "#78716C" : undefined }}>{t.mood}</div>
              <div className="theme-tags">{t.tags.map((tg) => <span key={tg} className="theme-tag">{tg}</span>)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* CUSTOM CSS */}
      <div className="custom-panel">
        <div className="custom-title">
          <i className="fa-solid fa-code" /> Custom CSS
          <span className="badge badge-sunny" style={{ fontSize: ".65rem", marginLeft: 4 }}>PRO</span>
        </div>
        <textarea
          className="css-editor"
          placeholder={"/* Tulis CSS kustom kamu di sini — hingga 5KB */\n/* Contoh: */\n.link-card {\n  border-radius: 24px;\n}\n\n.avatar {\n  border: 3px solid #F59E0B;\n}"}
          onChange={(e) => setCssBytes(new TextEncoder().encode(e.target.value).length)}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ".75rem" }}>
          <div style={{ fontSize: ".72rem", color: "var(--n-400)" }}>
            <i className="fa-solid fa-circle-info" style={{ color: "var(--b-400)" }} /> {cssBytes} / 5120 bytes digunakan
          </div>
          <button className="btn btn-secondary btn-sm"><i className="fa-solid fa-play" /> Terapkan CSS</button>
        </div>
      </div>

      {/* COLOR TOKENS */}
      <div style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 18, padding: "1.5rem" }}>
        <div style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 700, color: "var(--b-900)", display: "flex", alignItems: "center", gap: 7, marginBottom: "1.25rem" }}>
          <i className="fa-solid fa-droplet" style={{ color: "var(--b-500)" }} /> Kustomisasi Warna
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--n-700)", marginBottom: ".5rem" }}>Warna Tombol</div>
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
              {["#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6", "#10B981"].map((c, i) => (
                <div key={c} style={{ width: 28, height: 28, borderRadius: 8, cursor: "pointer", border: `2.5px solid ${i === 0 ? "var(--b-500)" : "transparent"}`, background: c, transform: i === 0 ? "scale(1.1)" : undefined }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--n-700)", marginBottom: ".5rem" }}>Background</div>
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
              {["#FFFBEB", "#1A1409", "#F0FDF4", "#EFF6FF"].map((c, i) => (
                <div key={c} style={{ width: 28, height: 28, borderRadius: 8, cursor: "pointer", border: `2.5px solid ${i === 0 ? "var(--b-500)" : "transparent"}`, background: c, transform: i === 0 ? "scale(1.1)" : undefined }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--n-700)", marginBottom: ".5rem" }}>Font Heading</div>
            <select style={{ width: "100%", height: 36, border: "1.5px solid var(--n-200)", borderRadius: 9, padding: "0 10px", fontSize: ".8rem", fontFamily: "var(--fb)", color: "var(--n-700)", cursor: "pointer", outline: "none", background: "var(--n-0)" }}>
              <option>Fredoka (Default)</option>
              <option>Plus Jakarta Sans</option>
              <option>DM Sans</option>
              <option>Poppins</option>
              <option>Space Grotesk</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
