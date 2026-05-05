import type { CSSProperties } from "react";
import type { PublicBlock } from "@/types";

type Props = { block: PublicBlock; style?: CSSProperties };

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
      <a className="link-card" href={block.url ?? "#"} data-block-id={block.id}>
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
  return <LinkBlock block={{ ...block, title: block.title ?? "Embed" }} style={style} />;
}

export function ImageBlock({ block, style }: Props) {
  return (
    <div className="block-item" style={style}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.config.imageUrl ?? "/og-default.svg"} alt={block.title ?? "Gambar"} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
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
          <a key={item.url} className="badge badge-muted" href={item.url} style={{ color: item.color }}>
            {item.icon} {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
