"use client";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import type { PublicBlock, FaqItem, ContactPlatform } from "@/types";
import { getEmbedInfo } from "@/lib/utils/embed";

type Props = { block: PublicBlock; style?: CSSProperties };

function trackClick(pageId: string, blockId: string) {
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageId, blockId, event: "click" }),
  }).catch(() => {});
}

export function HeaderBlock({ block, style }: Props) {
  return (
    <div className="block-item" style={style}>
      <div style={{ textAlign: block.config.align ?? "center", padding: ".5rem 0" }}>
        <div className="section-title">{block.title}</div>
        <div className="link-sub">{block.config.subtitle}</div>
      </div>
    </div>
  );
}

export function LinkBlock({ block, style }: Props) {
  return (
    <div className="block-item" style={style}>
      <a
        className="link-card"
        href={block.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => block.url && trackClick(block.pageId, block.id)}
      >
        <span className="link-icon" style={{ background: block.config.bg ?? "var(--b-100)", color: block.config.color ?? "var(--b-700)" }}>
          {block.config.icon ?? "↗"}
        </span>
        <span style={{ flex: 1 }}>
          <span className="link-title">{block.title}</span>
          <span className="link-sub" style={{ display: "block" }}>{block.config.subtitle}</span>
        </span>
        <span aria-hidden>›</span>
      </a>
    </div>
  );
}

export function EmbedBlock({ block, style }: Props) {
  const url = block.url ?? "";
  const embed = getEmbedInfo(url);

  if (embed.type === "youtube") {
    return (
      <div className="block-item" style={style}>
        <div style={{ position: "relative", paddingBottom: embed.aspectRatio ?? "56.25%", borderRadius: 14, overflow: "hidden", background: "#000" }}>
          <iframe
            src={embed.embedUrl}
            title={block.title ?? "YouTube"}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (embed.type === "spotify") {
    return (
      <div className="block-item" style={style}>
        <iframe
          src={embed.embedUrl}
          title={block.title ?? "Spotify"}
          height="152"
          style={{ width: "100%", borderRadius: 14, border: "none" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>
    );
  }

  if (embed.type === "soundcloud") {
    return (
      <div className="block-item" style={style}>
        <iframe
          src={embed.embedUrl}
          title={block.title ?? "SoundCloud"}
          height="120"
          style={{ width: "100%", borderRadius: 14, border: "none" }}
          allow="autoplay"
        />
      </div>
    );
  }

  return <LinkBlock block={{ ...block, title: block.title ?? "Embed" }} style={style} />;
}

export function ImageBlock({ block, style }: Props) {
  const src = block.config.imageUrl as string | undefined;
  if (!src) return null;
  return (
    <div className="block-item" style={style}>
      <div style={{ borderRadius: 14, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={block.title ?? "Gambar"}
          style={{ width: "100%", display: "block", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

export function DividerBlock({ style }: { style?: CSSProperties }) {
  return (
    <div className="block-item" style={style}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".25rem 0" }}>
        <div style={{ flex: 1, height: 2, background: "var(--n-200)", borderRadius: 2 }} />
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--b-300)" }} />
        <div style={{ flex: 1, height: 2, background: "var(--n-200)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

export function SocialBlock({ block, style }: Props) {
  const socials = block.config.socials ?? [];
  return (
    <div className="block-item" style={style}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", justifyContent: "center" }}>
        {socials.map((item) => (
          <a key={item.url} className="badge badge-muted" href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: item.color }}
            onClick={() => trackClick(block.pageId, block.id)}>
            {item.icon} {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function TextBlock({ block, style }: Props) {
  const content = (block.config.content as string | undefined) ?? block.title ?? "";
  const align = block.config.align ?? "left";
  return (
    <div className="block-item" style={style}>
      <div style={{ textAlign: align, padding: ".25rem 0", fontSize: ".95rem", lineHeight: 1.65, color: "var(--n-700)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {content}
      </div>
    </div>
  );
}

export function BannerBlock({ block, style }: Props) {
  const bg = (block.config.bg as string | undefined) ?? "#FEF3C7";
  const color = (block.config.color as string | undefined) ?? "#92400E";
  const icon = (block.config.icon as string | undefined) ?? "📢";
  const text = block.title ?? "";
  return (
    <div className="block-item" style={style}>
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".75rem 1rem", borderRadius: 12, background: bg, color }}>
        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: ".9rem", flex: 1 }}>{text}</span>
      </div>
    </div>
  );
}

export function ContactBlock({ block, style }: Props) {
  const platform = (block.config.platform as ContactPlatform | undefined) ?? "whatsapp";
  const handle = (block.config.handle as string | undefined) ?? "";
  const message = (block.config.message as string | undefined) ?? "";

  const platformMeta: Record<ContactPlatform, { icon: string; label: string; color: string; bg: string; buildUrl: (h: string, m: string) => string }> = {
    whatsapp: {
      icon: "fa-brands fa-whatsapp", label: "WhatsApp", color: "#fff", bg: "#25D366",
      buildUrl: (h, m) => `https://wa.me/${h.replace(/\D/g, "")}${m ? `?text=${encodeURIComponent(m)}` : ""}`,
    },
    telegram: {
      icon: "fa-brands fa-telegram", label: "Telegram", color: "#fff", bg: "#0088cc",
      buildUrl: (h) => `https://t.me/${h.replace(/^@/, "")}`,
    },
    line: {
      icon: "fa-brands fa-line", label: "LINE", color: "#fff", bg: "#00B900",
      buildUrl: (h) => `https://line.me/ti/p/~${h.replace(/^@/, "")}`,
    },
    email: {
      icon: "fa-solid fa-envelope", label: "Email", color: "#fff", bg: "var(--b-600)",
      buildUrl: (h, m) => `mailto:${h}${m ? `?subject=${encodeURIComponent(m)}` : ""}`,
    },
  };

  const meta = platformMeta[platform];
  const href = meta.buildUrl(handle, message);

  return (
    <div className="block-item" style={style}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handle && trackClick(block.pageId, block.id)}
        style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".8rem 1rem", borderRadius: 12, background: meta.bg, color: meta.color, textDecoration: "none", fontWeight: 700, fontSize: ".95rem" }}
      >
        <i className={meta.icon} style={{ fontSize: "1.25rem" }} />
        <span style={{ flex: 1 }}>{block.title || meta.label}</span>
        <span aria-hidden style={{ opacity: .7 }}>›</span>
      </a>
    </div>
  );
}

export function ProductBlock({ block, style }: Props) {
  const imageUrl = (block.config.imageUrl as string | undefined);
  const price = (block.config.price as string | undefined) ?? "";
  const buttonText = (block.config.buttonText as string | undefined) ?? "Beli Sekarang";
  return (
    <div className="block-item" style={style}>
      <div style={{ borderRadius: 14, overflow: "hidden", border: "1.5px solid var(--n-200)", background: "var(--surface)" }}>
        {imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageUrl} alt={block.title ?? "Produk"} style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
        )}
        <div style={{ padding: ".75rem 1rem" }}>
          <div style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--n-900)", marginBottom: ".2rem" }}>{block.title ?? "Produk"}</div>
          {price && <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--b-600)", marginBottom: ".6rem" }}>{price}</div>}
          {block.url && (
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(block.pageId, block.id)}
              style={{ display: "inline-block", padding: ".45rem 1.1rem", background: "var(--b-500)", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: ".85rem", textDecoration: "none" }}
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function FaqBlock({ block, style }: Props) {
  const items = (block.config.items as FaqItem[] | undefined) ?? [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="block-item" style={style}>
      {block.title && <div className="section-title" style={{ marginBottom: ".5rem" }}>{block.title}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{ borderRadius: 10, border: "1.5px solid var(--n-200)", overflow: "hidden", background: "var(--surface)" }}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".7rem .9rem", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: ".9rem", color: "var(--n-800)", textAlign: "left", gap: ".5rem" }}
            >
              <span style={{ flex: 1 }}>{item.q}</span>
              <i className={`fa-solid fa-chevron-${openIdx === i ? "up" : "down"}`} style={{ fontSize: ".75rem", color: "var(--n-400)", flexShrink: 0 }} />
            </button>
            {openIdx === i && (
              <div style={{ padding: ".1rem .9rem .75rem", fontSize: ".875rem", color: "var(--n-600)", lineHeight: 1.6, borderTop: "1px solid var(--n-100)" }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <div style={{ color: "var(--n-400)", fontSize: ".85rem", textAlign: "center", padding: ".5rem" }}>Belum ada pertanyaan.</div>}
      </div>
    </div>
  );
}

export function CountdownBlock({ block, style }: Props) {
  const targetDate = (block.config.targetDate as string | undefined) ?? "";
  const label = block.title ?? "Hitung Mundur";

  const calc = () => {
    if (!targetDate) return null;
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return (
    <div className="block-item" style={style}>
      <div style={{ textAlign: "center", padding: ".5rem 0" }}>
        <div style={{ fontWeight: 700, fontSize: ".85rem", color: "var(--n-500)", marginBottom: ".6rem" }}>{label}</div>
        {time ? (
          <div style={{ display: "flex", justifyContent: "center", gap: ".5rem" }}>
            {[{ v: time.d, l: "Hari" }, { v: time.h, l: "Jam" }, { v: time.m, l: "Menit" }, { v: time.s, l: "Detik" }].map(({ v, l }) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 52, background: "var(--b-100)", borderRadius: 10, padding: ".4rem .3rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--b-700)", lineHeight: 1 }}>{String(v).padStart(2, "0")}</span>
                <span style={{ fontSize: ".62rem", fontWeight: 600, color: "var(--n-500)", marginTop: 2 }}>{l}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "var(--n-400)", fontSize: ".85rem" }}>{targetDate ? "Waktu sudah habis!" : "Atur tanggal target"}</div>
        )}
      </div>
    </div>
  );
}

export function MapBlock({ block, style }: Props) {
  const raw = (block.config.embedUrl as string | undefined) ?? "";
  const srcMatch = raw.match(/src=["']([^"']+)["']/);
  const embedUrl = srcMatch ? srcMatch[1] : raw.trim();
  const height = Number(block.config.height ?? 300);
  if (!embedUrl) return null;
  return (
    <div className="block-item" style={style}>
      {block.title && <div style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--n-600)", marginBottom: ".4rem" }}>{block.title}</div>}
      <div style={{ borderRadius: 14, overflow: "hidden" }}>
        <iframe
          src={embedUrl}
          title={block.title ?? "Peta"}
          width="100%"
          height={height}
          style={{ border: "none", display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export function FormBlock({ block, style }: Props) {
  const buttonText = (block.config.buttonText as string | undefined) ?? "Isi Formulir";
  const formUrl = block.url ?? "";
  return (
    <div className="block-item" style={style}>
      <div style={{ borderRadius: 14, border: "1.5px solid var(--n-200)", padding: "1rem", textAlign: "center", background: "var(--surface)" }}>
        {block.title && <div style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".3rem", color: "var(--n-800)" }}>{block.title}</div>}
        {block.config.subtitle && <div style={{ fontSize: ".82rem", color: "var(--n-500)", marginBottom: ".75rem" }}>{String(block.config.subtitle)}</div>}
        {formUrl ? (
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(block.pageId, block.id)}
            style={{ display: "inline-block", padding: ".5rem 1.25rem", background: "var(--b-500)", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: ".85rem", textDecoration: "none" }}
          >
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: ".4rem" }} />{buttonText}
          </a>
        ) : (
          <div style={{ color: "var(--n-400)", fontSize: ".82rem" }}>URL formulir belum diatur</div>
        )}
      </div>
    </div>
  );
}
