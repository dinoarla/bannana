export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { AdminSidebar } from "./AdminSidebar";

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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--n-50)" }}>
      <AdminSidebar displayName={displayName} email={user.email} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", marginLeft: "256px" }}>
        {children}
      </div>
    </div>
  );
}
