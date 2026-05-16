import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { BugForm } from "./BugForm";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Laporin Bug",
  description: "Temukan bug di bannana.id? Laporkan ke tim kami dan kami akan segera memperbaikinya.",
  openGraph: {
    title: "Laporin Bug — bannana.id",
    description: "Bantu kami memperbaiki bannana.id dengan melaporkan bug yang kamu temukan.",
  },
};

export default function LaporinBugPage() {
  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <span className="bana">🍌</span> bannana
        </Link>
        <div className="navbar-actions">
          <Link href="/login" className="btn btn-ghost btn-sm">Masuk</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Daftar Gratis</Link>
        </div>
      </nav>

      <div className="help-hero">
        <div className="eyebrow" style={{ marginBottom: ".75rem" }}>
          <i className="fa-solid fa-bug" /> Bantuan
        </div>
        <h1 className="sec-title">Laporin Bug</h1>
        <p className="muted" style={{ marginTop: ".5rem", maxWidth: 480 }}>
          Temukan sesuatu yang tidak beres? Bantu kami memperbaiki bannana.id dengan melaporkan bug yang kamu temukan.
        </p>
      </div>

      <div className="help-content">
        <div className="form-card">
          <BugForm />
        </div>

        {/* Alternatif */}
        <p style={{ fontSize: ".82rem", color: "var(--n-400)", textAlign: "center", marginBottom: "1rem" }}>
          Atau kirim langsung via email
        </p>
        <a
          href="mailto:halo@bannana.id?subject=[Laporin%20Bug]"
          className="form-alt"
        >
          <div className="contact-icon">
            <i className="fa-solid fa-envelope" style={{ color: "var(--b-600)" }} />
          </div>
          <div>
            <p className="contact-info-title">halo@bannana.id</p>
            <p className="contact-info-sub">Kirim email langsung — kami balas dalam 1–3 hari kerja</p>
          </div>
          <i className="fa-solid fa-arrow-right" style={{ color: "var(--n-400)", marginLeft: "auto", flexShrink: 0 }} />
        </a>

        {/* Link ke docs */}
        <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--b-50)", borderRadius: 14, border: "1.5px solid var(--b-200)", display: "flex", alignItems: "center", gap: ".875rem" }}>
          <i className="fa-solid fa-circle-info" style={{ color: "var(--b-500)", fontSize: "1.1rem", flexShrink: 0 }} />
          <p style={{ fontSize: ".85rem", color: "var(--n-600)", margin: 0, lineHeight: 1.6 }}>
            Sebelum melaporkan, cek{" "}
            <Link href="/dokumentasi" style={{ color: "var(--b-700)", fontWeight: 600, textDecoration: "underline" }}>
              dokumentasi
            </Link>{" "}
            dulu — mungkin sudah ada solusinya.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
