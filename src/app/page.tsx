import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const user = await getSessionUser();

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <span className="bana">🍌</span> bannana
        </Link>
        <ul className="navbar-links">
          <li><a href="#features">Fitur</a></li>
          <li><a href="#blocks">Blok</a></li>
          <li><a href="#themes">Tema</a></li>
          <li><Link href="/pricing">Pricing</Link></li>
        </ul>
        <div className="navbar-actions">
          {user ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-house" /> Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Masuk</Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                <i className="fa-solid fa-arrow-right-to-bracket" /> Daftar Gratis
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-mesh" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-text" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div className="hero-badge">
              <i className="fa-solid fa-circle-check" />
              Gratis Selamanya &mdash; Open Source &amp; Self-Hosted
            </div>
            <h1 className="hero-h1">
              Taro semua link-mu di satu tempat di{" "}
              <span className="accent">bannana.</span>
            </h1>
            <p className="hero-sub">
              Platform link-in-bio yang simple, cepat, dan bisa dikostumasi sepuasnya.
              Cocok buat affiliator, kreator, influencer, freelancer &mdash; siapa aja!
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-xl">
                <i className="fa-solid fa-bolt" /> Mulai Gratis
              </Link>
              <a href="#features" className="btn btn-ghost btn-xl">
                <i className="fa-solid fa-eye" /> Lihat Fitur
              </a>
            </div>
            <p className="hero-note">
              <i className="fa-solid fa-circle-info" /> Langsung coba tanpa daftar &mdash;{" "}
              <Link href="/demo">bannana.id/demo</Link>
            </p>
          </div>

          {/* PHONES */}
          <div className="hero-phones">
            <div className="phones-glow" />

            <div className="float-card fc-top">
              <div className="fc-row">
                <div className="fc-ico" style={{ background: "var(--b-100)", color: "var(--b-600)" }}>
                  <i className="fa-solid fa-fire-flame-curved" />
                  <div className="dot" />
                </div>
                <div>
                  <div className="fc-tit">47 klik hari ini</div>
                  <div className="fc-sub"><span className="fc-up">+12%</span> dari kemarin</div>
                </div>
              </div>
            </div>

            <div className="float-card fc-bot">
              <div className="fc-row">
                <div className="fc-ico" style={{ background: "var(--success-100)", color: "var(--success-600)" }}>
                  <i className="fa-solid fa-circle-check" />
                </div>
                <div>
                  <div className="fc-tit">Page aktif &amp; live</div>
                  <div className="fc-sub">bannana.id/kreator_kamu</div>
                </div>
              </div>
            </div>

            <div className="phone phone-back">
              <div className="phone-inner">
                <div className="psc1">
                  <div className="psc1-h">My Links</div>
                  <div className="psc1-av"><i className="fa-solid fa-user" /></div>
                  <div className="psc1-name">@kreator_kamu</div>
                  <div className="psc1-bio">konten kreator · suka kopi &amp; nulis hal-hal random</div>
                  <div className="plink">
                    <div className="plink-ico" style={{ background: "var(--b-100)", color: "var(--b-700)" }}><i className="fa-solid fa-star" /></div>
                    <div><div className="plink-t">Portfolio Terbaru</div><div className="plink-s">lihat semua karya</div></div>
                    <div className="plink-arr"><i className="fa-solid fa-chevron-right" /></div>
                  </div>
                  <div className="plink">
                    <div className="plink-ico" style={{ background: "#FEE2D5", color: "#C05621" }}><i className="fa-brands fa-youtube" /></div>
                    <div><div className="plink-t">YouTube Channel</div><div className="plink-s">tutorial mingguan</div></div>
                    <div className="plink-arr"><i className="fa-solid fa-chevron-right" /></div>
                  </div>
                  <div className="plink">
                    <div className="plink-ico" style={{ background: "#D1FAE5", color: "#065F46" }}><i className="fa-solid fa-bag-shopping" /></div>
                    <div><div className="plink-t">Toko Online</div><div className="plink-s">merch &amp; preset</div></div>
                    <div className="plink-arr"><i className="fa-solid fa-chevron-right" /></div>
                  </div>
                  <div className="plink">
                    <div className="plink-ico" style={{ background: "#E0F2FE", color: "#0369A1" }}><i className="fa-brands fa-x-twitter" /></div>
                    <div><div className="plink-t">Twitter / X</div><div className="plink-s">daily threads</div></div>
                    <div className="plink-arr"><i className="fa-solid fa-chevron-right" /></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="phone phone-front">
              <div className="phone-inner">
                <div className="psc2">
                  <div className="psc2-img"><i className="fa-solid fa-camera-retro" /></div>
                  <div className="psc2-body">
                    <div className="psc2-title">Lawyer turned designer, founder &ndash; podcast host</div>
                    <div className="psc2-desc">Halo! Aku host di @designtalks, founder startup marketing, &amp; suka bantu UMKM tampil keren online.</div>
                    <div className="psc2-tags">
                      <span className="ptag">Design</span>
                      <span className="ptag">Startup</span>
                      <span className="ptag">Podcast</span>
                      <span className="ptag">Marketing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feat-sec" id="features">
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sec-header">
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-wand-magic-sparkles" /> Fitur Unggulan
            </div>
            <div className="sec-title">Semuanya sudah ada di sini</div>
            <div className="sec-sub sec-sub-center">
              Dari editor drag-and-drop sampai analytics detail &mdash; bannana.id punya semua yang kamu butuhkan untuk tampil maksimal.
            </div>
          </div>
          <div className="feat-grid">
            {[
              { icon: "fa-pen-to-square", title: "Editor Drag & Drop", desc: "Susun link & blok semudah main puzzle. Live preview desktop/mobile langsung keliatan. Undo/redo sampai 50 langkah!", pills: [["fa-eye", "Live Preview"], ["fa-rotate-left", "Undo 50x"]] },
              { icon: "fa-palette", title: "12+ Tema Keren", desc: "12 tema preset cantik atau kustomisasi penuh — font, warna, bahkan custom CSS sampai 5KB!", pills: [["fa-swatchbook", "12 Preset"], ["fa-code", "Custom CSS"]] },
              { icon: "fa-chart-line", title: "Analytics Detail", desc: "Lihat siapa yang klik, dari mana asalnya, pakai HP atau laptop. Export ke CSV kapan aja!", pills: [["fa-arrow-pointer", "Click Tracking"], ["fa-file-csv", "Export CSV"]] },
              { icon: "fa-shield-halved", title: "Auth yang Aman", desc: "Login email/password atau SSO Google & GitHub. Dilindungi CSRF, rate limiting, dan bcrypt.", pills: [["fa-brands fa-google", "Google SSO"], ["fa-lock", "CSRF Guard"]] },
              { icon: "fa-key", title: "REST API Lengkap", desc: "API Key dengan scope read/write/analytics. Dokumentasi lengkap tersedia untuk developer!", pills: [["fa-plug", "API Key"], ["fa-sliders", "Scoped"]] },
              { icon: "fa-server", title: "Self-Hosted Ready", desc: "Deploy di server sendiri pakai PM2 + Nginx. Prisma + MySQL — pakai DB hosting yang udah ada!", pills: [["fa-database", "MySQL/Prisma"], ["fa-brands fa-node-js", "Next.js 15"]] },
            ].map((f) => (
              <div className="feat-card" key={f.title}>
                <div className="feat-icon"><i className={`fa-solid ${f.icon}`} /></div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
                <div className="feat-pills">
                  {f.pills.map(([ic, label]) => (
                    <span className="pill" key={label}>
                      <i className={ic.startsWith("fa-brands") ? ic : `fa-solid ${ic}`} /> {label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCKS */}
      <section className="blk-sec" id="blocks">
        <div className="blk-layout">
          <div>
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-puzzle-piece" /> Blok Konten
            </div>
            <h2 className="sec-title">
              6 jenis blok,<br />infinite possibilities
            </h2>
            <p className="sec-sub" style={{ marginTop: "1rem", marginBottom: "2rem" }}>
              Tambahkan konten sesukamu &mdash; dari link biasa sampai embed YouTube &amp; Spotify.
              Semua bisa drag, diatur urutan, dihidupkan/matikan kapanpun!
            </p>
            <Link href="/register" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-rocket" /> Coba Gratis Sekarang
            </Link>
          </div>
          <div className="blk-list">
            {[
              { icon: "fa-link", name: "Link", desc: "Link ke URL manapun dengan ikon & deskripsi", hot: true },
              { icon: "fa-heading", name: "Judul / Header", desc: "Teks heading untuk memisahkan konten" },
              { icon: "fa-share-nodes", name: "Sosial Media", desc: "IG, TikTok, Twitter, YouTube, dan lainnya" },
              { icon: "fa-circle-play", name: "Embed", desc: "YouTube, Spotify, Twitter/X langsung tampil" },
              { icon: "fa-image", name: "Gambar", desc: "Upload foto atau banner promosi" },
              { icon: "fa-minus", name: "Divider", desc: "Pemisah visual antar blok" },
            ].map((b) => (
              <div className="blk-item" key={b.name}>
                <div className="blk-ico"><i className={`fa-solid ${b.icon}`} /></div>
                <div>
                  <div className="blk-name">{b.name}</div>
                  <div className="blk-desc">{b.desc}</div>
                </div>
                {b.hot && <span className="blk-hot">Populer</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THEMES */}
      <section className="thm-sec" id="themes">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sec-header" style={{ marginBottom: "3rem" }}>
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-paintbrush" /> Tema Preset
            </div>
            <div className="sec-title">Ekspresi diri yang sesungguhnya</div>
            <div className="sec-sub sec-sub-center">
              12 tema cantik siap pakai &mdash; atau kustomisasi penuh sesuai kepribadianmu!
            </div>
          </div>
          <div className="thm-grid">
            {[
              { id: "classic",    name: "Bannana Classic", mood: "Light · Playful",  icon: "fa-sun",              bars: ["var(--b-500)","var(--b-300)","var(--b-200)"] },
              { id: "night",      name: "Bannana Night",   mood: "Dark · Warm",      icon: "fa-moon",             bars: ["#FBBF24","#78350F","#92400E"] },
              { id: "vanilla",    name: "Vanilla Cream",   mood: "Light · Soft",     icon: "fa-ice-cream",        bars: ["#FDE68A","#FEF9C3","#FEF3C7"] },
              { id: "peach",      name: "Peach Blossom",   mood: "Light · Sweet",    icon: "fa-heart",            bars: ["#FB923C","#FDBA74","#FED7AA"] },
              { id: "matcha",     name: "Matcha Latte",    mood: "Light · Natural",  icon: "fa-leaf",             bars: ["#4ADE80","#86EFAC","#BBF7D0"] },
              { id: "blueberry",  name: "Blueberry",       mood: "Dark · Bold",      icon: "fa-circle",           bars: ["#FACC15","#6366F1","#4338CA"] },
              { id: "strawberry", name: "Strawberry",      mood: "Light · Vibrant",  icon: "fa-fire",             bars: ["#E11D48","#FDA4AF","#FECDD3"] },
              { id: "licorice",   name: "Licorice",        mood: "Dark · Minimal",   icon: "fa-star",             bars: ["#A3E635","#333333","#222222"] },
              { id: "rainbow",    name: "Rainbow Sherbet", mood: "Light · Fun",      icon: "fa-wand-sparkles",    bars: ["white","rgba(255,255,255,.7)","rgba(255,255,255,.5)"] },
              { id: "cloud",      name: "Cloud Nine",      mood: "Light · Clean",    icon: "fa-cloud",            bars: ["#CBD5E1","#E2E8F0","#F1F5F9"] },
              { id: "pumpkin",    name: "Pumpkin Spice",   mood: "Light · Cozy",     icon: "fa-fire-flame-curved",bars: ["#EA580C","#FB923C","#FED7AA"] },
              { id: "glitter",    name: "Glitter Honey",   mood: "Dark · Glamour",   icon: "fa-gem",              bars: ["var(--b-500)","#44381A","#2A2010"] },
            ].map((t) => (
              <div className="thm-card" key={t.id}>
                <div className={`thm-prev t-${t.id}`}>
                  {t.bars.map((bg, i) => (
                    <div key={i} className="thm-bar" style={{ background: bg, width: `${80 - i * 15}%` }} />
                  ))}
                </div>
                <div className="thm-foot">
                  <div className="thm-name">
                    <i className={`fa-solid ${t.icon}`} /> {t.name}
                  </div>
                  <div className="thm-mood">{t.mood}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="anl-sec" id="analytics">
        <div className="anl-layout">
          <div>
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-chart-column" /> Analytics
            </div>
            <div className="sec-title" style={{ marginBottom: "1rem" }}>
              Data yang bikin keputusan lebih smart
            </div>
            <p className="sec-sub">
              Track klik, negara asal, dan device pengunjung &mdash; semua tersaji rapi dalam dashboard yang mudah dipahami.
            </p>
            <div className="info-list">
              {[
                { icon: "fa-arrow-pointer", title: "Klik per link — real-time", desc: "Lihat berapa kali setiap link diklik, langsung diperbarui setiap saat." },
                { icon: "fa-earth-asia", title: "Asal negara & kota", desc: "Tahu pengunjungmu dari mana saja di seluruh dunia." },
                { icon: "fa-mobile-screen", title: "Desktop vs Mobile vs Tablet", desc: "Breakdown device yang dipakai pengunjungmu secara detail." },
                { icon: "fa-file-csv", title: "Export data ke CSV", desc: "Pilih range 7d / 30d / 90d dan export kapanpun kamu mau." },
              ].map((item) => (
                <div key={item.title} className="info-row">
                  <div className="info-ico"><i className={`fa-solid ${item.icon}`} /></div>
                  <div>
                    <div className="info-tit">{item.title}</div>
                    <div className="info-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="anl-card">
            <div className="anl-card-hd">
              <div className="anl-card-title"><i className="fa-solid fa-chart-area" /> Performa Page</div>
              <span className="range-pill">30 hari terakhir</span>
            </div>
            <div className="chart-bars">
              {[35, 55, 42, 70, 60, 88, 78, 65, 82, 91, 76, 100, 85, 72].map((h, i) => (
                <div key={i} className={`chart-bar${h === 100 ? " hi" : ""}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="mini-stats">
              <div className="mini-stat"><span className="mini-stat-val">12.4K</span><span className="mini-stat-lbl">Total Views</span></div>
              <div className="mini-stat"><span className="mini-stat-val">3.8K</span><span className="mini-stat-lbl">Total Klik</span></div>
              <div className="mini-stat"><span className="mini-stat-val">30.6%</span><span className="mini-stat-lbl">Click Rate</span></div>
            </div>
            <div className="top-links">
              <div className="top-links-hd"><i className="fa-solid fa-fire-flame-curved" /> Top Links</div>
              {[
                { name: "Portfolio Terbaru", ct: "1,240", pct: "100%" },
                { name: "YouTube Channel",   ct: "980",   pct: "79%" },
                { name: "Toko Online",       ct: "740",   pct: "60%" },
              ].map((l) => (
                <div key={l.name} className="tl-row">
                  <span className="tl-name">{l.name}</span>
                  <span className="tl-ct">{l.ct}</span>
                  <div className="tl-bar"><div className="tl-fill" style={{ width: l.pct }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <h2 className="cta-title">Mulai sekarang &mdash; gratis!</h2>
        <p className="cta-sub">
          Gak perlu kartu kredit. Daftar, buat link page-mu, dan share ke dunia dalam 2 menit!
        </p>
        <div className="cta-actions">
          <Link href="/register" className="btn-white btn btn-xl">
            <i className="fa-solid fa-bolt" /> Daftar Gratis Sekarang
          </Link>
          <Link href="/pricing" className="btn-outline-light btn btn-xl">
            <i className="fa-solid fa-tag" /> Lihat Pricing
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
