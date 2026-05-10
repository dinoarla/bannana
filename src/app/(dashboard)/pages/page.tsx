export const dynamic = "force-dynamic";
import Link from "next/link";
import { assertSessionUser } from "@/lib/auth/session";
import { PageService } from "@/lib/services/PageService";
import { PageActions } from "./PageActions";

export default async function PagesPage() {
  const user = await assertSessionUser();
  const pages = await new PageService().list(user.id);

  return (
    <>
      <div className="topbar">
        <div style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, color: "var(--b-900)" }}>
          <i className="fa-solid fa-table-columns" style={{ color: "var(--b-500)", marginRight: 8 }} /> Halaman Saya
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Link href="/pages/new" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus" /> Halaman Baru
          </Link>
        </div>
      </div>

      <div className="page-content">
        {pages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "1.2rem", fontWeight: 700, color: "var(--b-900)", marginBottom: ".5rem" }}>
              Belum ada halaman
            </div>
            <p style={{ color: "var(--n-500)", marginBottom: "1.5rem" }}>
              Buat halaman pertama kamu dan mulai tambahkan link!
            </p>
            <Link href="/pages/new" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-plus" /> Buat Halaman Pertama
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))", gap: "1rem" }}>
            {pages.map((page) => (
              <div key={page.id} style={{ background: "var(--n-0)", border: "2px solid var(--n-200)", borderRadius: 20, overflow: "hidden" }}>
                {/* Preview header */}
                <div style={{ height: 112, background: "linear-gradient(160deg,var(--b-50),#fff)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 5 }}>
                  <div style={{ position: "absolute", top: 9, right: 9, borderRadius: "9999px", padding: "2px 9px", fontSize: ".62rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, background: page.isPublished ? "var(--success-100)" : "var(--n-200)", color: page.isPublished ? "var(--success-700)" : "var(--n-500)" }}>
                    {page.isPublished && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success-600)", display: "inline-block" }} />}
                    {page.isPublished ? "Live" : "Draft"}
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,var(--b-400),var(--b-600))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-950)", fontSize: "1.2rem" }}>
                    <i className="fa-solid fa-user" />
                  </div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: ".78rem", fontWeight: 700, color: "var(--b-900)" }}>@{page.slug}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", padding: "0 14px" }}>
                    <div style={{ height: 7, background: "var(--b-300)", borderRadius: 4, width: "82%" }} />
                    <div style={{ height: 7, background: "var(--b-200)", borderRadius: 4, width: "66%" }} />
                    <div style={{ height: 7, background: "var(--b-100)", borderRadius: 4, width: "55%" }} />
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: 700, fontSize: ".92rem", color: "var(--b-900)", marginBottom: ".3rem" }}>
                    {page.title}
                  </div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: ".7rem", color: "var(--n-500)", marginBottom: ".5rem" }}>
                    bannana.id/{page.slug}
                  </div>
                  <div style={{ display: "flex", gap: ".875rem", fontSize: ".72rem", color: "var(--n-500)", marginBottom: ".875rem" }}>
                    <span><i className="fa-solid fa-puzzle-piece" style={{ color: "var(--b-500)", fontSize: ".65rem" }} /> {page.blocks.length} blok</span>
                    <span><i className="fa-solid fa-eye" style={{ color: "var(--b-500)", fontSize: ".65rem" }} /> {page.viewCount} views</span>
                  </div>

                  {/* Edit + View row */}
                  <div style={{ display: "flex", gap: ".5rem", marginBottom: ".5rem" }}>
                    <Link href={`/pages/${page.id}`} style={{ flex: 1, height: 33, borderRadius: 9, fontSize: ".78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "var(--b-500)", color: "var(--b-950)", textDecoration: "none" }}>
                      <i className="fa-solid fa-pen-to-square" /> Edit
                    </Link>
                    <Link href={`/${page.slug}`} target="_blank" style={{ flex: 1, height: 33, borderRadius: 9, fontSize: ".78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "var(--n-100)", color: "var(--n-700)", border: "1.5px solid var(--n-200)", textDecoration: "none" }}>
                      <i className="fa-solid fa-eye" /> Lihat
                    </Link>
                  </div>

                  {/* Publish + Delete */}
                  <PageActions pageId={page.id} isPublished={page.isPublished} />
                </div>
              </div>
            ))}

            {/* Create new card */}
            <Link href="/pages/new" style={{ background: "var(--b-50)", border: "2px dashed var(--b-200)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".75rem", padding: "2.25rem", textDecoration: "none", minHeight: 220 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--b-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-500)", fontSize: "1.2rem" }}>
                <i className="fa-solid fa-plus" />
              </div>
              <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-700)" }}>Buat Halaman Baru</div>
              <div style={{ fontSize: ".75rem", color: "var(--n-500)", textAlign: "center" }}>Link page, about me, portofolio — bebas!</div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
