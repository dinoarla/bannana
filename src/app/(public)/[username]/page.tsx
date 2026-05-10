export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { BlockFactory } from "@/components/blocks/BlockFactory";
import { PublicPageService } from "@/lib/services/PublicPageService";
import type { PublicBlock } from "@/types";
import { ShareFab } from "./ShareFab";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  try {
    const page = await new PublicPageService().getByUsername(username);
    const name = page.user.profile?.displayName ?? page.user.username;
    return {
      title: `${name} — bannana.id`,
      description: page.user.profile?.bio ?? `Link-in-bio ${name} di bannana.id`,
      openGraph: { title: `${name} — bannana.id`, description: page.user.profile?.bio ?? "" },
    };
  } catch {
    return { title: "Halaman tidak ditemukan — bannana.id" };
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  try {
    const page = await new PublicPageService().getByUsername(username);
    const profile = page.user.profile;
    const name = profile?.displayName ?? page.user.username;

    return (
      <div className={`pub-page t-${page.theme}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="pub-wrap">
          {/* Profile Header */}
          <div className="prof-header">
            <div className="prof-avatar">
              {profile?.avatarUrl
                ? <img src={profile.avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                : <i className="fa-solid fa-user" />}
            </div>
            <div className="prof-name">{name}</div>
            <div className="prof-handle">@{page.user.username} · bannana.id/{page.user.username}</div>
            {profile?.bio && <div className="prof-bio">{profile.bio}</div>}
            <div className="social-row">
              {[
                { icon: "fa-brands fa-instagram", color: "#E1306C", title: "Instagram" },
                { icon: "fa-brands fa-x-twitter", color: "#1DA1F2", title: "Twitter" },
                { icon: "fa-brands fa-youtube", color: "#FF0000", title: "YouTube" },
                { icon: "fa-brands fa-linkedin", color: "#0A66C2", title: "LinkedIn" },
              ].map((s) => (
                <a key={s.title} href="#" className="soc-btn" style={{ color: s.color }} title={s.title}>
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Blocks */}
          <div className="blocks">
            {page.blocks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--n-400)", fontSize: ".9rem" }}>
                Halaman ini belum memiliki konten.
              </div>
            ) : (
              page.blocks.map((block, index) => (
                <div key={block.id} className="block-item" style={{ animationDelay: `${0.1 + index * 0.07}s` }}>
                  <BlockFactory block={block as unknown as PublicBlock} index={index} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pub-footer">
          <a href="/" className="made-with">
            <span style={{ animation: "bannana-wiggle 3s ease-in-out infinite", display: "inline-block" }}>🍌</span>
            {" "}Dibuat dengan bannana.id — gratis!
          </a>
        </div>

        {/* Share FAB */}
        <ShareFab name={name} />
      </div>
    );
  } catch {
    notFound();
  }
}
