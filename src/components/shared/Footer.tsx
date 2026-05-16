import Link from "next/link";

export function Footer() {
  return (
    <footer className="lp-footer">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Top: brand + columns */}
        <div className="footer-top">
          {/* Brand */}
          <div style={{ maxWidth: 240 }}>
            <div className="footer-brand-name"><span className="bana">🍌</span> bannana.id</div>
            <div className="footer-tagline">Platform mobile marketing &amp; link page untuk semua — UMKM, kreator, freelancer, dan affiliator.</div>
            {/* Social icons */}
            <div style={{ display: "flex", gap: ".75rem", marginTop: "1rem" }}>
              {[
                { href: "#", icon: "fa-brands fa-instagram", label: "Instagram" },
                { href: "#", icon: "fa-brands fa-x-twitter", label: "X / Twitter" },
                { href: "#", icon: "fa-brands fa-tiktok",    label: "TikTok" },
                { href: "#", icon: "fa-brands fa-github",    label: "GitHub" },
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(251,191,36,.12)", border: "1.5px solid rgba(251,191,36,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-600)", fontSize: ".9rem", transition: "all 150ms", textDecoration: "none" }}>
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div className="footer-col">
              <h4>Produk</h4>
              <ul>
                <li><Link href="/#features"><i className="fa-solid fa-chevron-right" /> Fitur</Link></li>
                <li><Link href="/#blocks"><i className="fa-solid fa-chevron-right" /> Blok Konten</Link></li>
                <li><Link href="/#themes"><i className="fa-solid fa-chevron-right" /> Tema</Link></li>
                <li><Link href="/#analytics"><i className="fa-solid fa-chevron-right" /> Analytics</Link></li>
                <li><Link href="/pricing"><i className="fa-solid fa-chevron-right" /> Pricing</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Untuk Siapa</h4>
              <ul>
                <li><Link href="/#untuk-siapa"><i className="fa-solid fa-store" /> UMKM &amp; Penjual</Link></li>
                <li><Link href="/#untuk-siapa"><i className="fa-solid fa-camera" /> Kreator Konten</Link></li>
                <li><Link href="/#untuk-siapa"><i className="fa-solid fa-briefcase" /> Freelancer</Link></li>
                <li><Link href="/#untuk-siapa"><i className="fa-solid fa-percent" /> Affiliator</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Developer</h4>
              <ul>
                <li><a href="#"><i className="fa-solid fa-book-open" /> API Docs</a></li>
                <li><a href="#"><i className="fa-brands fa-github" /> GitHub</a></li>
                <li><a href="#"><i className="fa-solid fa-server" /> Self-Hosted</a></li>
                <li><a href="#"><i className="fa-solid fa-clock-rotate-left" /> Changelog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Bantuan</h4>
              <ul>
                <li><Link href="/dokumentasi"><i className="fa-solid fa-book" /> Dokumentasi</Link></li>
                <li><Link href="/laporin-bug"><i className="fa-solid fa-bug" /> Laporin Bug</Link></li>
                <li><Link href="/request-fitur"><i className="fa-solid fa-lightbulb" /> Request Fitur</Link></li>
                <li><Link href="/kontak"><i className="fa-solid fa-envelope" /> Kontak</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bot">
          <span>&copy; 2026 bannana.id &mdash; dibuat dengan cinta, kuning, dan sedikit gila&nbsp;💛</span>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <a href="#">MIT License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
