import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LoginClient } from "./LoginClient";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
  return <LoginClient />;
}
