export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { BlockFactory } from "@/components/blocks/BlockFactory";
import { PublicPageService } from "@/lib/services/PublicPageService";
import type { PublicBlock } from "@/types";
import { ShareFab } from "./ShareFab";
import { Tracker } from "./Tracker";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bannana.id";
  try {
    const page = await new PublicPageService().getByUsername(username);
    const name = page.displayName ?? page.user.profile?.displayName ?? page.user.username;
    const description = page.bio ?? page.user.profile?.bio ?? `Lihat semua link ${name} di bannana.id`;
    const ogImage = `${baseUrl}/api/og/${username}`;
    return {
      title: `${name} — bannana.id`,
      description,
      openGraph: {
        title: `${name} — bannana.id`,
        description,
        url: `${baseUrl}/${username}`,
        siteName: "bannana.id",
        type: "profile",
        images: [{ url: ogImage, width: 1200, height: 630, alt: name }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} — bannana.id`,
        description,
        images: [ogImage],
      },
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
    const name = page.displayName ?? profile?.displayName ?? page.user.username;
    const effectiveWebsite = page.website ?? profile?.website ?? null;
    const effectiveSocialLinks = page.socialLinks ?? profile?.socialLinks ?? null;

    return (
      <div className={`pub-page t-${page.theme}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="pub-wrap">
          {/* Profile Header */}
          <div className="prof-header">
            <div className="prof-avatar">
              {(page.avatarUrl ?? profile?.avatarUrl)
                ? <img src={page.avatarUrl ?? profile!.avatarUrl!} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                : <i className="fa-solid fa-user" />}
            </div>
            <div className="prof-name">{name}</div>
            <div className="prof-handle">@{page.slug} · bannana.id/{page.slug}</div>
            {(page.bio ?? profile?.bio) && <div className="prof-bio">{page.bio ?? profile?.bio}</div>}
            {effectiveWebsite && (
              <a href={effectiveWebsite} target="_blank" rel="noopener noreferrer" className="prof-website">
                <i className="fa-solid fa-globe" /> {effectiveWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
            {effectiveSocialLinks && effectiveSocialLinks.length > 0 && (
              <div className="social-row">
                {effectiveSocialLinks.map((s) => {
                  const iconMap: Record<string, { fa: string; color: string }> = {
                    Instagram: { fa: "fa-brands fa-instagram", color: "#E1306C" },
                    Twitter:   { fa: "fa-brands fa-x-twitter",  color: "#000000" },
                    Youtube:   { fa: "fa-brands fa-youtube",    color: "#FF0000" },
                    LinkedIn:  { fa: "fa-brands fa-linkedin",   color: "#0A66C2" },
                    TikTok:    { fa: "fa-brands fa-tiktok",     color: "#000000" },
                    Facebook:  { fa: "fa-brands fa-facebook",   color: "#1877F2" },
                    GitHub:    { fa: "fa-brands fa-github",     color: "#333333" },
                  };
                  const ico = iconMap[s.icon] ?? { fa: "fa-solid fa-globe", color: "var(--n-500)" };
                  return (
                    <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" className="soc-btn" style={{ color: ico.color }} title={s.label}>
                      <i className={ico.fa} />
                    </a>
                  );
                })}
              </div>
            )}
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
        <Tracker pageId={page.id} />
      </div>
    );
  } catch {
    notFound();
  }
}
