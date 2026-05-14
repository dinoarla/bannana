export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { assertSessionUser } from "@/lib/auth/session";
import { CSRF_COOKIE } from "@/lib/auth/session";
import { LanggananContent } from "./LanggananContent";

export default async function LanggananPage() {
  await assertSessionUser();
  const jar = await cookies();
  const csrfToken = jar.get(CSRF_COOKIE)?.value ?? "";
  return (
    <>
      <div className="topbar">
        <div style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, color: "var(--b-900)" }}>
          <i className="fa-solid fa-crown" style={{ color: "var(--b-500)", marginRight: 8 }} /> Paket Langganan
        </div>
      </div>
      <div className="page-content">
        <LanggananContent csrfToken={csrfToken} />
      </div>
    </>
  );
}
