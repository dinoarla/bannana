export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AdminClient } from "./AdminClient";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  return <AdminClient adminId={user.id} />;
}
