import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { assertSessionUser, CSRF_COOKIE } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { BlockEditor } from "@/components/editor/BlockEditor";
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
          slug: page.slug,
          isPublished: page.isPublished,
          blocks: (page.blocks ?? []) as unknown as PublicBlock[],
        }}
        csrfToken={csrfToken}
        username={user.username}
        bio={user.profile?.bio ?? ""}
      />
    </div>
  );
}
