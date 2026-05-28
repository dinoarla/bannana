"use client";
import type { CSSProperties } from "react";
import type { PublicBlock } from "@/types";
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
