export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  let isPro = false;
  try {
    const [rows] = await db.query(
      "SELECT plan, status FROM Subscription WHERE userId = ? LIMIT 1",
      [user.id]
    );
    const sub = (rows as Record<string, unknown>[])[0];
    isPro = sub?.plan === "pro" && sub?.status === "active";
  } catch { /* table may not exist */ }

  return <DashboardShell user={user} isPro={isPro}>{children}</DashboardShell>;
}
