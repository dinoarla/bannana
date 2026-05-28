export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { PageRepository } from "@/lib/db/repositories/PageRepository";
import { db } from "@/lib/db/client";

const FREE_PAGE_LIMIT = 1;

export default async function NewPage() {
  const user = await assertSessionUser();

  if (user.role === "USER") {
    const [rows] = await db.query(
      "SELECT plan, status FROM Subscription WHERE userId = ? LIMIT 1",
      [user.id]
    );
    const sub = (rows as Record<string, unknown>[])[0];
    const isPro = sub?.plan === "pro" && sub?.status === "active";

    if (!isPro) {
      const count = await new PageRepository().countByUser(user.id);
      if (count >= FREE_PAGE_LIMIT) redirect("/pricing?limit=pages");
    }
  }

  const page = await new PageService().create(user.id, { title: `Halaman ${Date.now()}` });
  redirect(`/pages/${page.id}`);
}
