export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import Link from "next/link";
import { assertSessionUser } from "@/lib/auth/session";
import { CSRF_COOKIE } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { ThemeSelector } from "./ThemeSelector";
import { db } from "@/lib/db/client";

export default async function ThemesPage() {
  const user = await assertSessionUser();
  const pages = await new PageService().list(user.id);
  const page = pages[0];
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
          <i className="fa-solid fa-palette" style={{ color: "var(--b-500)", marginRight: 8 }} /> Pilih Tema
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: ".75rem", alignItems: "center" }}>
          <Link href={`/${user.username}`} target="_blank" className="btn btn-ghost btn-sm"><i className="fa-solid fa-eye" /> Preview Halaman</Link>
        </div>
      </div>
      <div className="page-content">
        {page ? (
          <ThemeSelector pageId={page.id} currentTheme={page.theme} csrfToken={csrfToken} isPro={isPro} />
        ) : (
          <div className="anl-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
            <p style={{ color: "var(--n-500)" }}>Buat halaman dulu untuk memilih tema.</p>
          </div>
        )}
      </div>
    </>
  );
}
