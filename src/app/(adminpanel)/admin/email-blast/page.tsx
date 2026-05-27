export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { assertSessionUser } from "@/lib/auth/session";
import { EmailBlastForm } from "./EmailBlastForm";

export default async function AdminEmailBlastPage() {
  let admin;
  try {
    admin = await assertSessionUser();
  } catch {
    redirect("/login");
  }
  if (admin.role !== "ADMIN") redirect("/dashboard");

  return (
    <>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <i className="fa-solid fa-bullhorn" style={{ color: "var(--b-500)", fontSize: "1.1rem" }} />
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)" }}>
            Email Blast
          </span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700, color: "var(--b-900)" }}>
            Kirim Email Blast
          </div>
          <div style={{ fontSize: ".875rem", color: "var(--n-500)", marginTop: ".25rem" }}>
            Kirim pengumuman, update fitur, atau promosi ke pengguna bannana.id
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>
          {/* Form */}
          <div className="card">
            <EmailBlastForm />
          </div>

          {/* Tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card" style={{ background: "var(--b-50)", border: "1.5px solid var(--b-200)" }}>
              <div style={{ fontWeight: 700, color: "var(--b-800)", marginBottom: ".75rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <i className="fa-solid fa-lightbulb" style={{ color: "var(--b-500)" }} />
                Tips Email Efektif
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 1.2rem", fontSize: ".875rem", color: "var(--n-600)", lineHeight: 1.8 }}>
                <li>Gunakan subject yang singkat dan menarik</li>
                <li>Sebutkan nama fitur atau manfaat dengan jelas</li>
                <li>Tambahkan ajakan bertindak (CTA) yang jelas</li>
                <li>Sertakan link ke halaman yang relevan</li>
                <li>Tes dulu kirim ke email sendiri</li>
              </ul>
            </div>

            <div className="card" style={{ background: "#FEF3C7", border: "1.5px solid #FDE68A" }}>
              <div style={{ fontWeight: 700, color: "#92400E", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: "#D97706" }} />
                Perhatian
              </div>
              <p style={{ margin: 0, fontSize: ".875rem", color: "#78350F", lineHeight: 1.6 }}>
                Email blast tidak bisa dibatalkan setelah dikirim. Pastikan konten sudah benar sebelum menekan kirim.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
