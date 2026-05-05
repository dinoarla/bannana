import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";

export default async function NewPage() {
  const user = await assertSessionUser();
  const page = await new PageService().create(user.id, { title: `Halaman ${Date.now()}` });
  redirect(`/pages/${page.id}`);
}
