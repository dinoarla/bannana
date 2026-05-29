import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { db } from "@/lib/db/client";
import { ok } from "@/lib/utils/response";

export async function GET(request: Request) {
  try {
    await assertSessionUser();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug")?.trim() ?? "";
    const pageId = searchParams.get("pageId") ?? "";

    if (slug.length < 3) return ok({ available: false, reason: "min3" });

    const [rows] = await db.query(
      "SELECT id FROM Page WHERE slug = ? AND id != ? LIMIT 1",
      [slug, pageId]
    );
    const taken = (rows as unknown[]).length > 0;
    return ok({ available: !taken });
  } catch (error) {
    return handleApiError(error);
  }
}
