import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";

function nowMysql() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

    const { id } = await params;
    const [rows] = await db.query(
      `SELECT id, title, slug, excerpt, content, coverUrl, tags, status, type, authorId, publishedAt, createdAt, updatedAt
       FROM Post WHERE id = ? LIMIT 1`,
      [id]
    );

    const post = (rows as Record<string, unknown>[])[0];
    if (!post) throw errors.notFound("Post tidak ditemukan.");

    return ok({
      id: post.id as string,
      title: post.title as string,
      slug: post.slug as string,
      excerpt: post.excerpt as string | null,
      content: post.content as string,
      coverUrl: post.coverUrl as string | null,
      tags: typeof post.tags === "string" ? JSON.parse(post.tags) : (post.tags ?? []),
      status: post.status as string,
      type: post.type as string,
      authorId: post.authorId as string,
      publishedAt: post.publishedAt ? new Date(post.publishedAt as string | Date).toISOString() : null,
      createdAt: new Date(post.createdAt as string | Date).toISOString(),
      updatedAt: new Date(post.updatedAt as string | Date).toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

    const { id } = await params;
    const body = await req.json() as {
      title: string;
      slug: string;
      excerpt?: string;
      content?: string;
      coverUrl?: string;
      tags?: string[];
      status?: string;
      type?: string;
    };

    if (!body.title?.trim()) throw errors.validation("Judul wajib diisi.");
    if (!body.slug?.trim()) throw errors.validation("Slug wajib diisi.");

    // Check if post exists and get current publishedAt
    const [existing] = await db.query(
      `SELECT id, publishedAt FROM Post WHERE id = ? LIMIT 1`,
      [id]
    );
    const existingPost = (existing as Record<string, unknown>[])[0];
    if (!existingPost) throw errors.notFound("Post tidak ditemukan.");

    const now = nowMysql();
    const status = body.status ?? "draft";
    const tags = JSON.stringify(body.tags ?? []);

    // Set publishedAt: if status becomes 'published' and no existing publishedAt, set to NOW
    let publishedAt: string | null = existingPost.publishedAt
      ? new Date(existingPost.publishedAt as string | Date).toISOString().slice(0, 19).replace("T", " ")
      : null;

    if (status === "published" && !publishedAt) {
      publishedAt = now;
    } else if (status !== "published") {
      publishedAt = null;
    }

    await db.query(
      `UPDATE Post SET title=?, slug=?, excerpt=?, content=?, coverUrl=?, tags=?, status=?, type=?, publishedAt=?, updatedAt=?
       WHERE id=?`,
      [
        body.title.trim(),
        body.slug.trim(),
        body.excerpt?.trim() ?? null,
        body.content ?? "",
        body.coverUrl?.trim() ?? null,
        tags,
        status,
        body.type ?? "blog",
        publishedAt,
        now,
        id,
      ]
    );

    return ok({ id, slug: body.slug.trim() });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

    const { id } = await params;
    await db.query(`DELETE FROM Post WHERE id = ?`, [id]);

    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
