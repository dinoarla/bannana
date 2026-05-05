import { cookies } from "next/headers";
import Link from "next/link";
import { assertSessionUser } from "@/lib/auth/session";
import { CSRF_COOKIE } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { ThemeSelector } from "./ThemeSelector";

export default async function ThemesPage() {
  const user = await assertSessionUser();
  const pages = await new PageService().list(user.id);
  const page = pages[0];
  const jar = await cookies();
  const csrfToken = jar.get(CSRF_COOKIE)?.value ?? "";

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
          <ThemeSelector pageId={page.id} currentTheme={page.theme} csrfToken={csrfToken} />
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
