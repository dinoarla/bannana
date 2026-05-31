export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { assertSessionUser, CSRF_COOKIE } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { db } from "@/lib/db/client";
import type { PublicBlock } from "@/types";

type Props = { params: Promise<{ pageId: string }> };

export async function generateMetadata({ params }: Props) {
  const { pageId } = await params;
  try {
    const page = await new PageService().get(pageId);
    return { title: `${page.title} — Editor bannana.id` };
  } catch {
    return { title: "Editor — bannana.id" };
  }
}

export default async function EditorPage({ params }: Props) {
  const { pageId } = await params;
  const user = await assertSessionUser();
  const jar = await cookies();
  const csrfToken = jar.get(CSRF_COOKIE)?.value ?? "";

  let page;
  try {
    page = await new PageService().get(pageId);
  } catch {
    notFound();
  }

  if (page.userId !== user.id) notFound();

  let isPro = false;
  try {
    const [subRows] = await db.query(
      "SELECT plan, status FROM Subscription WHERE userId = ? AND status = 'active' LIMIT 1",
      [user.id]
    );
    const sub = (subRows as Record<string, unknown>[])[0];
    isPro = sub?.plan === "pro";
  } catch { /* Subscription table may not exist yet */ }

  const allPages = (await new PageService().list(user.id)).map((p) => ({ id: p.id, title: p.title }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        background: "white",
        overflow: "hidden",
      }}
    >
      <BlockEditor
        initialPage={{
          id: page.id,
          title: page.title,
          bio: page.bio ?? null,
          slug: page.slug,
          theme: page.theme ?? "classic",
          avatarUrl: page.avatarUrl ?? null,
          isPublished: page.isPublished,
          displayName: page.displayName ?? null,
          website: page.website ?? null,
          socialLinks: page.socialLinks ?? null,
          blocks: (page.blocks ?? []) as unknown as PublicBlock[],
        }}
        csrfToken={csrfToken}
        username={user.username}
        bio={user.profile?.bio ?? ""}
        profileAvatarUrl={user.profile?.avatarUrl ?? null}
        isPro={isPro}
        allPages={allPages}
      />
    </div>
  );
}
