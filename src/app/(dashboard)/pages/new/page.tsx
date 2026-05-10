export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { PageRepository } from "@/lib/db/repositories/PageRepository";

const FREE_PAGE_LIMIT = 1;

export default async function NewPage() {
  const user = await assertSessionUser();

  if (user.role === "USER") {
    const count = await new PageRepository().countByUser(user.id);
    if (count >= FREE_PAGE_LIMIT) redirect("/pricing?limit=pages");
  }

  const page = await new PageService().create(user.id, { title: `Halaman ${Date.now()}` });
  redirect(`/pages/${page.id}`);
}
