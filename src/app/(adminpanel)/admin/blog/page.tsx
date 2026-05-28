export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { PostsManager } from "./PostsManager";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
};

export default async function AdminBlogPage() {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  let posts: PostRow[] = [];
  try {
    const [rows] = await db.query(`
      SELECT id, title, slug, type, status, publishedAt, createdAt
      FROM Post
      ORDER BY createdAt DESC
    `);
    posts = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      slug: r.slug as string,
      type: r.type as string,
      status: r.status as string,
      publishedAt: r.publishedAt ? new Date(r.publishedAt as string | Date).toISOString() : null,
      createdAt: new Date(r.createdAt as string | Date).toISOString(),
    }));
  } catch {
    posts = [];
  }

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-newspaper" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            Blog &amp; Cerita
          </span>
        </div>
        <div style={{ marginLeft: "auto", fontSize: ".875rem", color: "var(--n-400)" }}>
          {posts.length} artikel
        </div>
      </div>

      <div className="page-content">
        <PostsManager initialPosts={posts} />
      </div>
    </>
  );
}
