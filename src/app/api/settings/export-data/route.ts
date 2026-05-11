import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { db } from "@/lib/db/client";

export async function GET() {
  try {
    const user = await assertSessionUser();

    const [pageRows] = await db.query(
      "SELECT id, title, slug, theme, isPublished, viewCount, uniqueVisitors, createdAt FROM Page WHERE userId = ?",
      [user.id]
    );
    const pages = pageRows as Record<string, unknown>[];

    const pageIds = pages.map((p) => p.id as string);
    let blocks: Record<string, unknown>[] = [];
    if (pageIds.length > 0) {
      const placeholders = pageIds.map(() => "?").join(",");
      const [blockRows] = await db.query(
        `SELECT id, pageId, type, title, url, position, isEnabled, clickCount, createdAt FROM Block WHERE pageId IN (${placeholders})`,
        pageIds
      );
      blocks = blockRows as Record<string, unknown>[];
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        profile: user.profile
          ? {
              displayName: user.profile.displayName,
              bio: user.profile.bio,
              website: user.profile.website,
              socialLinks: user.profile.socialLinks,
              tags: user.profile.tags,
            }
          : null,
      },
      pages: pages.map((page) => ({
        ...page,
        blocks: blocks.filter((b) => b.pageId === page.id),
      })),
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="bannana-data-${user.username}.json"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
