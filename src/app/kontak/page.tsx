import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi tim bannana.id — pertanyaan, saran, kolaborasi, atau dukungan teknis. Kami merespons dalam 1–2 hari kerja.",
  openGraph: {
    title: "Kontak — bannana.id",
    description: "Ada pertanyaan atau saran untuk bannana.id? Hubungi kami di halo@bannana.id.",
  },
};

const contactOptions = [
  {
    href: "mailto:halo@bannana.id",
    icon: "fa-envelope",
    title: "halo@bannana.id",
    sub: "Untuk pertanyaan umum, billing, dan kolaborasi",
    label: "Kirim Email",
    primary: true,
  },
  {
    href: "/laporin-bug",
    icon: "fa-bug",
    title: "Laporin Bug",
    sub: "Temukan sesuatu yang tidak beres? Beri tahu kami",
    label: "Laporin Bug",
    primary: false,
  },
  {
    href: "/request-fitur",
    icon: "fa-lightbulb",
    title: "Request Fitur",
    sub: "Punya ide fitur? Kami selalu terbuka untuk masukan",
    label: "Request Fitur",
    primary: false,
  },
  {
    href: "/dokumentasi",
    icon: "fa-book-open",
    title: "Dokumentasi",
    sub: "Cek panduan lengkap sebelum menghubungi kami",
    label: "Buka Docs",
    primary: false,
  },
];

const socials = [
  { href: "#", icon: "fa-brands fa-instagram", label: "Instagram" },
  { href: "#", icon: "fa-brands fa-x-twitter", label: "X / Twitter" },
  { href: "#", icon: "fa-brands fa-tiktok", label: "TikTok" },
  { href: "#", icon: "fa-brands fa-github", label: "GitHub" },
];

export default function KontakPage() {
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
          <i className="fa-solid fa-envelope" /> Kontak
        </div>
        <h1 className="sec-title">Hubungi Kami</h1>
        <p className="muted" style={{ marginTop: ".5rem", maxWidth: 460 }}>
          Ada pertanyaan, saran, atau butuh bantuan? Kami senang mendengar dari kamu.
        </p>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 2rem 6rem" }}>

        {/* Main email CTA */}
        <a
          href="mailto:halo@bannana.id"
          style={{
            display: "flex", alignItems: "center", gap: "1.25rem",
            padding: "1.5rem 1.75rem",
            background: "var(--b-50)", border: "2px solid var(--b-300)",
            borderRadius: 20, textDecoration: "none", marginBottom: "2rem",
            transition: "all 160ms",
          }}
          className="contact-card"
        >
          <div style={{ width: 56, height: 56, background: "var(--b-200)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="fa-solid fa-envelope" style={{ fontSize: "1.3rem", color: "var(--b-700)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "var(--b-900)", marginBottom: ".2rem" }}>
              halo@bannana.id
            </p>
            <p style={{ fontSize: ".875rem", color: "var(--n-500)", margin: 0 }}>
              Respons dalam <strong style={{ color: "var(--b-800)" }}>1–2 hari kerja</strong> &nbsp;·&nbsp; Senin–Jumat, 09.00–17.00 WIB
            </p>
          </div>
          <span className="btn btn-primary btn-sm" style={{ flexShrink: 0, pointerEvents: "none" }}>
            Kirim Email
          </span>
        </a>

        {/* Other options */}
        <p style={{ fontSize: ".8rem", fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "1rem" }}>
          Cara Lain
        </p>
        <div className="contact-grid" style={{ marginBottom: "2.5rem" }}>
          {contactOptions.slice(1).map((opt) => (
            <Link key={opt.href} href={opt.href} className="contact-card">
              <div className="contact-icon">
                <i className={`fa-solid ${opt.icon}`} />
              </div>
              <div>
                <p className="contact-info-title">{opt.title}</p>
                <p className="contact-info-sub">{opt.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQ teaser */}
        <div style={{ padding: "1.75rem", background: "var(--n-50)", borderRadius: 16, border: "1.5px solid var(--n-200)", marginBottom: "2.5rem" }}>
          <p style={{ fontWeight: 700, color: "var(--b-900)", marginBottom: ".5rem" }}>
            <i className="fa-solid fa-circle-question" style={{ color: "var(--b-500)", marginRight: ".5rem" }} />
            Pertanyaan Umum
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {[
              "Bagaimana cara upgrade ke Pro?",
              "Apakah saya bisa ganti username?",
              "Bagaimana cara menghapus akun?",
            ].map((q) => (
              <div key={q} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: ".875rem", color: "var(--n-600)" }}>{q}</span>
                <Link href="/dokumentasi#faq" style={{ fontSize: ".78rem", color: "var(--b-700)", fontWeight: 600, textDecoration: "none", flexShrink: 0, marginLeft: ".75rem" }}>
                  Lihat jawaban <i className="fa-solid fa-arrow-right" style={{ fontSize: ".7rem" }} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Social media */}
        <div>
          <p style={{ fontSize: ".8rem", fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "1rem" }}>
            Media Sosial
          </p>
          <div className="social-row">
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="social-pill" aria-label={s.label}>
                <i className={s.icon} />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
