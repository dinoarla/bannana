export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { PostEditor } from "../PostEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  let post = null;
  try {
    const [rows] = await db.query(
      `SELECT id, title, slug, excerpt, content, coverUrl, tags, status, type, publishedAt
       FROM Post WHERE id = ? LIMIT 1`,
      [id]
    );
    const r = (rows as Record<string, unknown>[])[0];
    if (r) {
      post = {
        id: r.id as string,
        title: r.title as string,
        slug: r.slug as string,
        excerpt: r.excerpt as string | null,
        content: r.content as string,
        coverUrl: r.coverUrl as string | null,
        tags: typeof r.tags === "string" ? JSON.parse(r.tags) : (r.tags ?? []),
        status: r.status as string,
        type: r.type as string,
        publishedAt: r.publishedAt ? new Date(r.publishedAt as string | Date).toISOString() : null,
      };
    }
  } catch {
    // table not yet created
  }

  if (!post) notFound();

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-pen" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            Edit Artikel
          </span>
        </div>
      </div>

      <div className="page-content">
        <PostEditor initialData={post} />
      </div>
    </>
  );
}
