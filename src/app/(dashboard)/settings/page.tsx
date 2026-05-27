export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { assertSessionUser } from "@/lib/auth/session";
import { CSRF_COOKIE } from "@/lib/auth/session";
import { SettingsForm } from "./SettingsForm";
import { db } from "@/lib/db/client";

type SearchParams = Promise<{ tab?: string }>;

export default async function SettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const user = await assertSessionUser();
  const jar = await cookies();
  const csrfToken = jar.get(CSRF_COOKIE)?.value ?? "";

  let isPro = false;
  try {
    const [subRows] = await db.query(
      "SELECT plan, status FROM Subscription WHERE userId = ? AND status = 'active' LIMIT 1",
      [user.id]
    );
    const sub = (subRows as Record<string, unknown>[])[0];
    isPro = sub?.plan === "pro";
  } catch { /* Subscription table may not exist yet */ }

  return (
    <>
      <div className="topbar">
        <div style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, color: "var(--b-900)" }}>
          <i className="fa-solid fa-gear" style={{ color: "var(--b-500)", marginRight: 8 }} /> Pengaturan Akun
        </div>
      </div>
      <div className="page-content">
        <SettingsForm
          csrfToken={csrfToken}
          username={user.username}
          email={user.email}
          displayName={user.profile?.displayName ?? ""}
          bio={user.profile?.bio ?? ""}
          avatarUrl={user.profile?.avatarUrl ?? ""}
          website={user.profile?.website ?? ""}
          socialLinks={user.profile?.socialLinks ?? []}
          initialTab={sp.tab}
          isPro={isPro}
          isGoogleConnected={!!user.googleId}
        />
      </div>
    </>
  );
}
