import { randomUUID } from "crypto";
import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { db } from "@/lib/db/client";
import { ok, created } from "@/lib/utils/response";

function nowMysql() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export async function GET() {
  try {
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

    const [rows] = await db.query(`
      SELECT id, title, slug, type, status, publishedAt, createdAt
      FROM Post
      ORDER BY createdAt DESC
    `);

    const posts = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      slug: r.slug as string,
      type: r.type as string,
      status: r.status as string,
      publishedAt: r.publishedAt ? new Date(r.publishedAt as string | Date).toISOString() : null,
      createdAt: new Date(r.createdAt as string | Date).toISOString(),
    }));

    return ok(posts);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    await verifyCsrf();
    const admin = await assertSessionUser();
    if (admin.role !== "ADMIN") throw errors.forbidden();

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

    const id = randomUUID();
    const now = nowMysql();
    const status = body.status ?? "draft";
    const type = body.type ?? "blog";
    const tags = JSON.stringify(body.tags ?? []);
    const publishedAt = status === "published" ? now : null;

    await db.query(
      `INSERT INTO Post (id, title, slug, excerpt, content, coverUrl, tags, status, type, authorId, publishedAt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.title.trim(),
        body.slug.trim(),
        body.excerpt?.trim() ?? null,
        body.content ?? "",
        body.coverUrl?.trim() ?? null,
        tags,
        status,
        type,
        admin.id,
        publishedAt,
        now,
        now,
      ]
    );

    return created({ id, slug: body.slug.trim() });
  } catch (error) {
    return handleApiError(error);
  }
}
