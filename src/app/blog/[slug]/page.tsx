import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { Footer } from "@/components/shared/Footer";
import { CopyLinkButton } from "../CopyLinkButton";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  tags: string[];
  type: string;
  publishedAt: string | null;
};

async function getPost(slug: string): Promise<Post | null> {
  try {
    const [rows] = await db.query(
      `SELECT id, title, slug, excerpt, content, coverUrl, tags, type, publishedAt
       FROM Post WHERE slug = ? AND status = 'published' LIMIT 1`,
      [slug]
    );
    const r = (rows as Record<string, unknown>[])[0];
    if (!r) return null;

    return {
      id: r.id as string,
      title: r.title as string,
      slug: r.slug as string,
      excerpt: r.excerpt as string | null,
      content: r.content as string,
      coverUrl: r.coverUrl as string | null,
      tags: typeof r.tags === "string" ? JSON.parse(r.tags) : (r.tags ?? []),
      type: r.type as string,
      publishedAt: r.publishedAt ? new Date(r.publishedAt as string | Date).toISOString() : null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${post.title} — bannana.id`,
    description: post.excerpt ?? `Baca artikel "${post.title}" di bannana.id`,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? `Baca artikel "${post.title}" di bannana.id`,
      ...(post.coverUrl ? { images: [{ url: post.coverUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const pageUrl = `https://bannana.id/blog/${post.slug}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`;

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <span className="bana">🍌</span> bannana
        </Link>
        <div className="navbar-actions">
          <Link href="/blog" className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-arrow-left" style={{ marginRight: ".3rem" }} />
            Blog
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">Daftar Gratis</Link>
        </div>
      </nav>

      <main style={{ background: "var(--b-50)", minHeight: "100vh", paddingBottom: "4rem" }}>
        {/* Cover */}
        {post.coverUrl && (
          <div style={{ width: "100%", maxHeight: 440, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt={post.title}
              style={{ width: "100%", height: "440px", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* Article */}
        <article style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 2rem 0" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: ".8rem", color: "var(--n-400)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: ".4rem", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--n-400)", textDecoration: "none" }}>Beranda</Link>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: ".6rem" }} />
            <Link href="/blog" style={{ color: "var(--n-400)", textDecoration: "none" }}>Blog</Link>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: ".6rem" }} />
            <span style={{ color: "var(--b-600)" }}>{post.type === "cerita" ? "Cerita Sukses" : "Artikel"}</span>
          </div>

          {/* Type badge */}
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 99,
            fontSize: ".78rem",
            fontWeight: 700,
            marginBottom: ".875rem",
            background: post.type === "blog" ? "#DBEAFE" : "#D1FAE5",
            color: post.type === "blog" ? "#1D4ED8" : "#065F46",
          }}>
            {post.type === "blog" ? "Blog Post" : "Cerita Sukses"}
          </span>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--fd)",
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--b-900)",
            lineHeight: 1.25,
            marginBottom: "1rem",
          }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "2px solid var(--b-100)" }}>
            {post.publishedAt && (
              <span style={{ fontSize: ".82rem", color: "var(--n-500)", display: "flex", alignItems: "center", gap: ".35rem" }}>
                <i className="fa-regular fa-calendar" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.tags.length > 0 && (
              <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: "var(--b-100)",
                    color: "var(--b-700)",
                    fontSize: ".72rem",
                    fontWeight: 600,
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p style={{
              fontSize: "1.1rem",
              color: "var(--n-600)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
              fontStyle: "italic",
              borderLeft: "4px solid var(--b-300)",
              paddingLeft: "1rem",
            }}>
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          {/*
            Content is rendered with white-space: pre-wrap to preserve markdown source readably.
            This can be upgraded to a proper markdown parser (e.g. react-markdown) in the future.
          */}
          <div style={{
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "var(--n-700)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "inherit",
          }}>
            {post.content}
          </div>

          {/* Share */}
          <div style={{
            marginTop: "3rem",
            padding: "1.5rem 2rem",
            background: "var(--n-0)",
            borderRadius: 20,
            border: "2px solid var(--b-100)",
          }}>
            <div style={{ fontWeight: 700, color: "var(--b-900)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <i className="fa-solid fa-share-nodes" style={{ color: "var(--b-500)" }} />
              Bagikan Artikel Ini
            </div>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}
              >
                <i className="fa-brands fa-x-twitter" />
                Share di X
              </a>
              <CopyLinkButton url={pageUrl} />
            </div>
          </div>

          {/* Back to blog */}
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/blog" className="btn btn-ghost btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
              <i className="fa-solid fa-arrow-left" />
              Lihat Semua Artikel
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
