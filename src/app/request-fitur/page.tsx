import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { FeatureForm } from "./FeatureForm";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Request Fitur",
  description: "Punya ide fitur baru untuk bannana.id? Kami selalu terbuka untuk masukan dari komunitas.",
  openGraph: {
    title: "Request Fitur — bannana.id",
    description: "Usulkan fitur baru untuk bannana.id. Kami baca setiap masukan dari komunitas.",
  },
};

export default function RequestFiturPage() {
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
          <i className="fa-solid fa-lightbulb" /> Bantuan
        </div>
        <h1 className="sec-title">Request Fitur</h1>
        <p className="muted" style={{ marginTop: ".5rem", maxWidth: 480 }}>
          Punya ide fitur yang akan membuat bannana.id lebih keren? Kami selalu terbuka untuk masukan dari komunitas.
        </p>
      </div>

      <div className="help-content">
        <div className="form-card">
          <FeatureForm />
        </div>

        {/* Alternatif */}
        <p style={{ fontSize: ".82rem", color: "var(--n-400)", textAlign: "center", marginBottom: "1rem" }}>
          Atau kirim langsung via email
        </p>
        <a
          href="mailto:halo@bannana.id?subject=[Request%20Fitur]"
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

        {/* Callout */}
        <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--b-50)", borderRadius: 14, border: "1.5px solid var(--b-200)", display: "flex", alignItems: "center", gap: ".875rem" }}>
          <i className="fa-solid fa-heart" style={{ color: "var(--b-500)", fontSize: "1.1rem", flexShrink: 0 }} />
          <p style={{ fontSize: ".85rem", color: "var(--n-600)", margin: 0, lineHeight: 1.6 }}>
            Fitur-fitur terbaik bannana.id lahir dari masukan komunitas. Terima kasih sudah meluangkan waktu!
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
