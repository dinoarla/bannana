import { cookies } from "next/headers";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { Topbar } from "@/components/shared/Topbar";
import { assertSessionUser } from "@/lib/auth/session";
import { CSRF_COOKIE } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import type { PublicBlock } from "@/types";

type Props = { params: Promise<{ pageId: string }> };

export default async function EditorPage({ params }: Props) {
  const user = await assertSessionUser();
  const { pageId } = await params;
  const page = await new PageService().get(pageId);
  const jar = await cookies();
  return (
    <>
      <Topbar title={`Editor: ${page.title}`} publicHref={`/${user.username}`} />
      <BlockEditor
        csrfToken={jar.get(CSRF_COOKIE)?.value}
        initialPage={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          isPublished: page.isPublished,
          blocks: page.blocks as unknown as PublicBlock[]
        }}
      />
    </>
  );
}
