export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { AdminShell } from "./AdminShell";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  let user;
  try {
    user = await assertSessionUser();
  } catch {
    redirect("/login");
  }

  if (user.role !== "ADMIN") redirect("/dashboard");

  const displayName = user.profile?.displayName ?? user.username;

  return (
    <AdminShell displayName={displayName} email={user.email}>
      {children}
    </AdminShell>
  );
}
