import Link from "next/link";
import { db } from "@/lib/db/client";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Blog bannana.id",
  description: "Baca artikel terbaru bannana.id — tips digital marketing, kisah sukses UMKM, panduan link page, dan inspirasi untuk kreator & affiliator.",
  openGraph: {
    title: "Blog bannana.id",
    description: "Tips digital marketing, kisah sukses UMKM, dan inspirasi untuk kreator Indonesia.",
  },
};

type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
  type: string;
  status: string;
  publishedAt: string | null;
};

async function getPosts(): Promise<PublicPost[]> {
  try {
    const [rows] = await db.query(`
      SELECT id, title, slug, excerpt, coverUrl, type, status, publishedAt
      FROM Post
      WHERE status = 'published'
      ORDER BY publishedAt DESC
    `);
    return (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      slug: r.slug as string,
      excerpt: r.excerpt as string | null,
      coverUrl: r.coverUrl as string | null,
      type: r.type as string,
      status: r.status as string,
      publishedAt: r.publishedAt ? new Date(r.publishedAt as string | Date).toISOString() : null,
    }));
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function GradientCover({ type }: { type: string }) {
  const gradient = type === "cerita"
    ? "linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)"
    : "linear-gradient(135deg, #FEF9C3 0%, #FDE68A 100%)";
  const icon = type === "cerita" ? "fa-star" : "fa-pen-nib";
  const color = type === "cerita" ? "#065F46" : "#92400E";

  return (
    <div style={{ width: "100%", aspectRatio: "16/9", background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <i className={`fa-solid ${icon}`} style={{ fontSize: "2rem", color, opacity: 0.5 }} />
    </div>
  );
}

function PostCard({ post }: { post: PublicPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div style={{
        background: "var(--n-0)",
        border: "2px solid var(--b-100)",
        borderRadius: 20,
        overflow: "hidden",
        transition: "all .2s",
        cursor: "pointer",
      }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--b-300)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--b-100)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        }}
      >
        {/* Cover */}
        <div style={{ overflow: "hidden" }}>
          {post.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverUrl}
              alt={post.title}
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
            />
          ) : (
            <GradientCover type={post.type} />
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem" }}>
          {/* Badge */}
          <span style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 99,
            fontSize: ".72rem",
            fontWeight: 700,
            marginBottom: ".6rem",
            background: post.type === "blog" ? "#DBEAFE" : "#D1FAE5",
            color: post.type === "blog" ? "#1D4ED8" : "#065F46",
          }}>
            {post.type === "blog" ? "Blog" : "Cerita Sukses"}
          </span>

          <h3 style={{
            fontFamily: "var(--fd)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--b-900)",
            margin: "0 0 .5rem",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.title}
          </h3>

          {post.excerpt && (
            <p style={{
              fontSize: ".875rem",
              color: "var(--n-500)",
              lineHeight: 1.6,
              margin: "0 0 .75rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {post.excerpt}
            </p>
          )}

          {post.publishedAt && (
            <div style={{ fontSize: ".75rem", color: "var(--n-400)", display: "flex", alignItems: "center", gap: ".35rem" }}>
              <i className="fa-regular fa-calendar" />
              {formatDate(post.publishedAt)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getPosts();
  const blogPosts = posts.filter((p) => p.type === "blog");
  const ceritaPosts = posts.filter((p) => p.type === "cerita");

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <span className="bana">🍌</span> bannana
        </Link>
        <div className="navbar-actions">
          <Link href="/login" className="btn btn-ghost btn-sm">Masuk</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Daftar Gratis</Link>
        </div>
      </nav>

      <main style={{ background: "var(--b-50)", minHeight: "100vh" }}>
        {/* Hero */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 0" }}>
          <div className="eyebrow" style={{ marginBottom: ".75rem" }}>
            <i className="fa-solid fa-newspaper" /> Blog
          </div>
          <h1 className="sec-title" style={{ marginBottom: ".75rem" }}>
            Blog &amp; Cerita bannana.id
          </h1>
          <p className="muted" style={{ maxWidth: 520, marginBottom: "3rem" }}>
            Tips digital marketing, panduan link page, dan kisah sukses dari pengguna bannana.id di seluruh Indonesia.
          </p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 6rem" }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--n-0)", borderRadius: 20, border: "2px solid var(--b-100)" }}>
              <i className="fa-solid fa-newspaper" style={{ fontSize: "2.5rem", color: "var(--b-300)", marginBottom: "1rem", display: "block" }} />
              <h2 style={{ fontFamily: "var(--fd)", color: "var(--b-800)", marginBottom: ".5rem" }}>
                Konten segera hadir
              </h2>
              <p style={{ color: "var(--n-500)", marginBottom: "1.5rem" }}>
                Kami sedang mempersiapkan artikel dan cerita inspiratif untuk kamu.
              </p>
              <Link href="/" className="btn btn-primary btn-sm">
                Kembali ke Beranda
              </Link>
            </div>
          ) : blogPosts.length > 0 && ceritaPosts.length > 0 ? (
            // Two sections
            <>
              {/* Blog section */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 14px",
                    borderRadius: 99,
                    fontSize: ".8rem",
                    fontWeight: 700,
                    background: "#DBEAFE",
                    color: "#1D4ED8",
                  }}>
                    <i className="fa-solid fa-pen-nib" style={{ marginRight: ".3rem" }} />
                    Artikel Blog
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                  {blogPosts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              </div>

              {/* Cerita section */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 14px",
                    borderRadius: 99,
                    fontSize: ".8rem",
                    fontWeight: 700,
                    background: "#D1FAE5",
                    color: "#065F46",
                  }}>
                    <i className="fa-solid fa-star" style={{ marginRight: ".3rem" }} />
                    Cerita Sukses
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                  {ceritaPosts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              </div>
            </>
          ) : (
            // Single unified list
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
