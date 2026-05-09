import Link from "next/link";

export function Footer() {
  return (
    <footer className="lp-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name"><span className="bana">🍌</span> bannana.id</div>
            <div className="footer-tagline">satu link, semua tempat &mdash; manis &amp; mudah!</div>
          </div>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div className="footer-col">
              <h4>Produk</h4>
              <ul>
                <li><Link href="/#features"><i className="fa-solid fa-chevron-right" /> Fitur</Link></li>
                <li><Link href="/#themes"><i className="fa-solid fa-chevron-right" /> Tema</Link></li>
                <li><Link href="/#analytics"><i className="fa-solid fa-chevron-right" /> Analytics</Link></li>
                <li><Link href="/pricing"><i className="fa-solid fa-chevron-right" /> Pricing</Link></li>
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
                <li><a href="#"><i className="fa-solid fa-chevron-right" /> Dokumentasi</a></li>
                <li><a href="#"><i className="fa-solid fa-bug" /> Laporin Bug</a></li>
                <li><a href="#"><i className="fa-solid fa-lightbulb" /> Request Fitur</a></li>
                <li><a href="#"><i className="fa-solid fa-envelope" /> Kontak</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bot">
          <span>&copy; 2025 bannana.id &mdash; dibuat dengan cinta, kuning, dan sedikit gila~ 💛</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="#">MIT License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
