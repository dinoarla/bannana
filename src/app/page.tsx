import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { LandingNavMobile } from "@/components/shared/LandingNavMobile";
import { HeroHeadline } from "@/components/landing/HeroHeadline";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "bannana.id — Mobile Marketing & Link Page Gratis 🍌",
  description: "Ganti biaya hosting & domain yang mahal dengan bannana.id. Buat halaman mobile marketing profesional dalam 2 menit — gratis selamanya. Cocok untuk UMKM, kreator, freelancer, affiliator.",
  keywords: ["link in bio", "bannana", "bannana.id", "link page", "mobile marketing", "UMKM", "kreator konten", "influencer", "halaman bisnis", "bio link indonesia", "linktree alternatif indonesia", "link bio gratis"],
  openGraph: {
    title: "bannana.id — Mobile Marketing & Link Page Gratis",
    description: "Lebih murah dari domain & hosting. Tampil profesional di semua HP dalam 2 menit. Gratis selamanya!",
    url: "https://bannana.id",
    siteName: "bannana.id",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "bannana.id — Satu Link, Semua Tempat" }],
  },
  twitter: { card: "summary_large_image", title: "bannana.id — Link Page Gratis untuk Kreator Indonesia", description: "Mobile marketing terjangkau untuk semua orang. Gratis selamanya!" },
  alternates: { canonical: "https://bannana.id" },
};

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://bannana.id/#webpage",
  "url": "https://bannana.id",
  "name": "bannana.id — Mobile Marketing & Link Page Gratis",
  "isPartOf": { "@id": "https://bannana.id/#website" },
  "about": { "@id": "https://bannana.id/#organization" },
  "description": "Platform link-in-bio gratis untuk kreator, UMKM, dan freelancer Indonesia. Buat halaman profesional dalam 2 menit.",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://bannana.id" }],
  },
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const user = await getSessionUser();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      {/* NAVBAR */}
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <span className="bana">🍌</span> bannana
        </Link>
        <ul className="navbar-links">
          <li><a href="#features">Fitur</a></li>
          <li><a href="#blocks">Blok</a></li>
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
          <LandingNavMobile isLoggedIn={!!user} />
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-mesh" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-text" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div className="hero-badge">
              <i className="fa-solid fa-mobile-screen" />
              Mobile Marketing · Gratis Selamanya
            </div>
            <HeroHeadline />
            <p className="hero-sub">
              Tidak perlu domain. Tidak perlu hosting. Cukup daftar, buat halaman profesionalmu dalam <strong>2 menit</strong>, dan bagikan satu link ke semua platform &mdash; <strong>mulai Rp&nbsp;0</strong>.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-xl">
                <i className="fa-solid fa-bolt" /> Mulai Gratis Sekarang
              </Link>
              <a href="#why" className="btn btn-ghost btn-xl">
                <i className="fa-solid fa-eye" /> Kenapa bannana?
              </a>
            </div>
            <div style={{ display: "flex", gap: "1.25rem", marginTop: ".75rem", flexWrap: "wrap" }}>
              {["Tanpa kartu kredit", "Setup 2 menit", "Gratis selamanya"].map((t) => (
                <span key={t} style={{ fontSize: ".78rem", color: "var(--n-600)", display: "flex", alignItems: "center", gap: 5 }}>
                  <i className="fa-solid fa-check" style={{ color: "var(--success-600)", fontSize: ".65rem" }} /> {t}
                </span>
              ))}
            </div>
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
              {/* drag-drop demo overlay */}
              <div className="hero-drag-ghost" />
              <div className="hero-drag-cursor">
                <i className="fa-solid fa-up-down-left-right" style={{ fontSize: "1rem" }} />
              </div>
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

      {/* PAIN POINTS */}
      <section style={{ padding: "6rem 2.5rem", background: "var(--b-50)" }} id="masalah">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sec-header">
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-heart-crack" /> Cerita yang Mungkin Kamu Kenal
            </div>
            <div className="sec-title">Tampil profesional itu harusnya<br />nggak perlu mahal</div>
            <div className="sec-sub sec-sub-center" style={{ maxWidth: 560, margin: "1rem auto 0" }}>
              Sebelum bannana.id ada, banyak yang harus pilih antara keliatan serius — atau hemat uang.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {[
              {
                avatar: "https://i.pravatar.cc/80?img=47",
                name: "Ibu Tini",
                role: "Pemilik usaha keripik, Malang",
                color: "#FEF3C7",
                story: "Pelanggan datang dari mana-mana — WA, Instagram, Shopee. Tiap hari harus jawab satu-satu. Pernah coba bikin website, keluar Rp 1,2 juta buat domain + hosting. Belum termasuk bayar orang buat bikinnya. Akhirnya dibiarkan.",
                pain: "Rp 1,2jt habis, website nggak jadi",
              },
              {
                avatar: "https://i.pravatar.cc/80?img=11",
                name: "Aldo",
                role: "Fresh grad freelance designer, Bandung",
                color: "#EDE9FE",
                story: "Klien pertama minta lihat portfolio. Aldo kirim file PDF lewat email. Klien sempat ragu — keliatannya kurang profesional. Padahal karyanya bagus. Cuma butuh satu halaman yang bisa dibuka dari HP, tapi bikin web sendiri perlu waktu & modal.",
                pain: "Portfolio bagus, tapi terkesan amatir",
              },
              {
                avatar: "https://i.pravatar.cc/80?img=20",
                name: "Rara",
                role: "Content creator 50K followers, Semarang",
                color: "#DCFCE7",
                story: "Tiap upload video, komentar penuh: \"link shopee-nya mana?\", \"channel YouTube lo apa?\", \"WA jualan dong!\". Rara jawab manual satu-satu setiap hari. Padahal dia cuma butuh satu link — yang isinya semuanya.",
                pain: "50K followers, tapi link-nya berantakan",
              },
              {
                avatar: "https://i.pravatar.cc/80?img=33",
                name: "Budi",
                role: "Affiliator marketplace, Surabaya",
                color: "#FEE2E2",
                story: "6 bulan jadi affiliator, sebarkan 10 link beda. Tapi nggak pernah tahu link mana yang paling laku. Feeling terus. Pernah promosi keras-kerasan, ternyata link yang viral bukan yang dia push. Data kosong, strategi buta.",
                pain: "Nggak ada data, semua feeling",
              },
              {
                avatar: "https://i.pravatar.cc/80?img=52",
                name: "Pak Hendra",
                role: "Pemilik catering & kue, Bekasi",
                color: "#FEE2D5",
                story: "Orderan datang dari WA, dari mulut ke mulut, dari tetangga. Tapi pas mau promosi online, bingung — naruh foto menu di mana? Kirim katalog PDF-nya besar banget. Pernah bayar influencer lokal, nggak ada yang tahu harus klik apa.",
                pain: "Promosi habis, tapi susah dihubungi",
              },
              {
                avatar: "https://i.pravatar.cc/80?img=5",
                name: "Dewi",
                role: "Yoga & wellness coach, Bali",
                color: "#E0F2FE",
                story: "Klien luar kota tanya jadwal kelas, link Zoom, dan nomor WA-nya setiap hari. Dewi jawab satu per satu lewat DM. Padahal dia mau fokus ngajar, bukan balas pesan. Satu halaman aja cukup — tapi bikin web sendiri terasa ribet banget.",
                pain: "Waktu habis buat balas DM",
              },
            ].map((s) => (
              <div key={s.name} style={{ background: "var(--n-0)", border: "2px solid var(--n-150, #F0EBE0)", borderRadius: 20, padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                  <img src={s.avatar} alt={s.name} width={48} height={48} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid var(--b-100)" }} />
                  <div>
                    <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1rem", color: "var(--b-900)", lineHeight: 1.2 }}>{s.name}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--n-400)" }}>{s.role}</div>
                  </div>
                </div>
                <p style={{ fontSize: ".875rem", color: "var(--n-600)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  &ldquo;{s.story}&rdquo;
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.color, borderRadius: 9999, padding: "4px 12px", fontSize: ".72rem", fontWeight: 700, color: "var(--n-700)" }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: ".65rem" }} />
                  {s.pain}
                </div>
              </div>
            ))}
          </div>

          {/* Bridge to solution */}
          <div style={{ textAlign: "center", marginTop: "4rem", padding: "3rem 2rem", background: "linear-gradient(135deg, var(--b-100), var(--b-50))", borderRadius: 24, border: "2px solid var(--b-200)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🍌</div>
            <div style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.6rem", color: "var(--b-900)", marginBottom: ".75rem", lineHeight: 1.3 }}>
              bannana hadir untuk menjawab semua ini.
            </div>
            <p style={{ fontSize: ".95rem", color: "var(--n-600)", maxWidth: 520, margin: "0 auto 1.75rem", lineHeight: 1.7 }}>
              Satu halaman profesional, bisa dibuat dalam 2 menit, tanpa modal, tanpa coding —
              yang benar-benar bekerja untuk orang Indonesia.
            </p>
            <a href="#features" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--b-500)", color: "#1C1409", fontWeight: 800, fontSize: ".9rem", padding: ".7rem 1.75rem", borderRadius: 99, textDecoration: "none" }}>
              <i className="fa-solid fa-arrow-down" /> Lihat Solusinya
            </a>
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
              { icon: "fa-pen-to-square", title: "Editor Drag & Drop", desc: "Susun link & blok sesuka hati. Live preview real-time, undo/redo 50 langkah." },
              { icon: "fa-palette", title: "12+ Tema Keren", desc: "Pilih dari 12 tema preset cantik atau kustomisasi penuh dengan custom CSS." },
              { icon: "fa-chart-line", title: "Analytics Detail", desc: "Lihat klik per link, negara asal, dan device pengunjung. Export CSV kapan aja." },
            ].map((f) => (
              <div className="feat-card" key={f.title}>
                <div className="feat-icon"><i className={`fa-solid ${f.icon}`} /></div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section style={{ padding: "5rem 2.5rem", background: "var(--b-50)" }} id="untuk-siapa">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sec-header">
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-users" /> Untuk Siapa?
            </div>
            <div className="sec-title">Satu platform, ribuan profesi</div>
            <div className="sec-sub sec-sub-center">
              bannana.id dirancang untuk semua yang ingin tampil profesional di era digital &mdash; tanpa ribet, tanpa mahal.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem", marginTop: "2rem" }}>
            {[
              { icon: "fa-store", color: "#DCFCE7", ic: "#16A34A", title: "UMKM & Penjual Online", tag: "Paling banyak pakai", desc: "Gabungkan katalog produk, WhatsApp, Shopee, Tokopedia, dan Instagram dalam 1 link. Pelanggan langsung bisa nemuin kamu di mana-mana.", tags: ["Katalog Produk", "WA Langsung", "Toko Online"] },
              { icon: "fa-camera", color: "#FEF3C7", ic: "#D97706", title: "Kreator Konten", tag: "", desc: "Arahkan followers ke semua platform sekaligus. YouTube, TikTok, Spotify, newsletter — semua ada di 1 halaman yang bisa dikustomisasi.", tags: ["Multi Platform", "Analytics", "Custom Tema"] },
              { icon: "fa-briefcase", color: "#EDE9FE", ic: "#7C3AED", title: "Freelancer & Profesional", tag: "", desc: "Portfolio + CV + kontak dalam 1 halaman. Kesan pertama klien selalu profesional, tanpa harus bayar web developer.", tags: ["Portfolio", "Booking", "CV Digital"] },
              { icon: "fa-percent", color: "#FEE2E2", ic: "#DC2626", title: "Affiliator & Marketer", tag: "", desc: "Semua link afiliasi tersusun rapi dan bisa ditrack per link. Tahu mana yang paling menghasilkan — bukan tebak-tebakan.", tags: ["Click Tracking", "Multi Link", "Export CSV"] },
            ].map((p) => (
              <div key={p.title} style={{ background: "var(--n-0)", border: "2px solid var(--b-100)", borderRadius: 20, padding: "1.5rem", position: "relative", transition: "all 200ms" }}>
                {p.tag && <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--b-500)", color: "var(--b-950)", borderRadius: 9999, padding: "3px 12px", fontSize: ".68rem", fontWeight: 800, whiteSpace: "nowrap" }}>{p.tag}</span>}
                <div style={{ width: 50, height: 50, borderRadius: 14, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", color: p.ic, fontSize: "1.3rem", marginBottom: "1rem" }}>
                  <i className={`fa-solid ${p.icon}`} />
                </div>
                <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.05rem", color: "var(--b-900)", marginBottom: ".5rem" }}>{p.title}</div>
                <div style={{ fontSize: ".84rem", color: "var(--n-500)", lineHeight: 1.65, marginBottom: "1rem" }}>{p.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map((t) => <span key={t} style={{ fontSize: ".68rem", fontWeight: 700, background: "var(--b-100)", color: "var(--b-700)", borderRadius: 9999, padding: "2px 10px" }}>{t}</span>)}
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
              13+ jenis blok,<br />infinite possibilities
            </h2>
            <p className="sec-sub" style={{ marginTop: "1rem", marginBottom: "2rem" }}>
              Dari link biasa, embed YouTube &amp; Spotify, tombol WA langsung, katalog produk, hitung mundur, FAQ — semua tersedia. Drag, susun, nyala/matikan kapanpun.
            </p>
            <Link href="/register" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-rocket" /> Coba Gratis Sekarang
            </Link>
          </div>

          {/* Cloud block view */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", alignContent: "flex-start", alignItems: "flex-start" }}>
            {[
              { icon: "fa-link",            name: "Link",          hot: true,  size: "lg" },
              { icon: "fa-heading",         name: "Header",                    size: "md" },
              { icon: "fa-paragraph",       name: "Teks",                      size: "md" },
              { icon: "fa-circle-play",     name: "Embed",         hot: true,  size: "lg" },
              { icon: "fa-image",           name: "Gambar",                    size: "md" },
              { icon: "fa-bag-shopping",    name: "Produk",        hot: true,  size: "lg" },
              { icon: "fa-address-card",    name: "Kontak / WA",   hot: true,  size: "lg" },
              { icon: "fa-rectangle-ad",    name: "Banner",                    size: "md" },
              { icon: "fa-circle-question", name: "FAQ",                       size: "md" },
              { icon: "fa-hourglass-half",  name: "Hitung Mundur",             size: "md" },
              { icon: "fa-map-location-dot",name: "Peta",                      size: "sm" },
              { icon: "fa-clipboard-list",  name: "Formulir",                  size: "sm" },
              { icon: "fa-minus",           name: "Divider",                   size: "sm" },
            ].map((b) => (
              <div
                key={b.name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: b.size === "lg" ? ".6rem" : ".45rem",
                  background: b.hot ? "var(--b-500)" : "var(--n-0)",
                  color: b.hot ? "var(--b-950)" : "var(--n-700)",
                  border: b.hot ? "none" : "2px solid var(--n-200)",
                  borderRadius: 99,
                  padding: b.size === "lg" ? ".6rem 1.1rem" : b.size === "sm" ? ".35rem .75rem" : ".45rem .9rem",
                  fontWeight: 700,
                  fontSize: b.size === "lg" ? ".9rem" : b.size === "sm" ? ".72rem" : ".8rem",
                  boxShadow: b.hot ? "0 4px 14px rgba(245,158,11,.25)" : "0 1px 4px rgba(0,0,0,.06)",
                }}
              >
                <i className={`fa-solid ${b.icon}`} style={{ fontSize: b.size === "sm" ? ".65rem" : ".75rem" }} />
                {b.name}
                {b.hot && <span style={{ background: "var(--b-800)", color: "var(--b-200)", fontSize: ".62rem", fontWeight: 800, borderRadius: 99, padding: "1px 7px", marginLeft: 2 }}>Populer</span>}
              </div>
            ))}
            <div style={{ width: "100%", marginTop: ".75rem", padding: ".75rem 1rem", background: "var(--b-50)", border: "2px dashed var(--b-200)", borderRadius: 14, fontSize: ".78rem", color: "var(--b-700)", fontWeight: 600 }}>
              <i className="fa-solid fa-sparkles" style={{ marginRight: 6 }} />
              Semua blok bisa di-drag, diurutkan, dan dinyala/matikan kapanpun
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="anl-sec" id="analytics" style={{ background: "var(--n-0)" }}>
        <div className="anl-layout">
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
        </div>
      </section>

      {/* WHY BANNANA — COMPARISON */}
      <section style={{ padding: "6rem 2.5rem", background: "var(--n-0)" }} id="why">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sec-header">
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-scale-balanced" /> Kenapa bannana?
            </div>
            <div className="sec-title">Lebih hemat dari domain &amp; hosting</div>
            <div className="sec-sub sec-sub-center">
              Kamu tidak perlu beli domain, bayar hosting, atau hire developer. bannana.id sudah siap pakai dalam hitungan menit.
            </div>
          </div>

          {/* Cost comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem", margin: "3rem 0 3.5rem" }}>
            {[
              { label: "Bikin Website Sendiri", price: "Rp 600K–2jt/tahun", icon: "fa-server", color: "var(--danger-100)", ic: "var(--danger-600)", items: ["Domain .com Rp 200–300K/tahun", "Hosting VPS/shared Rp 300K–1.5jt", "Butuh developer/waktu setup", "Update manual tiap ada bug", "Tidak ada analytics bawaan"], bad: true },
              { label: "bannana.id Pro", price: "Rp 150K/tahun", icon: "fa-crown", color: "var(--b-100)", ic: "var(--b-700)", items: ["Langsung jalan tanpa setup", "Analytics lengkap + export CSV", "12+ tema keren, custom CSS", "Update otomatis selamanya", "Support & dokumentasi tersedia"], bad: false, highlight: true },
              { label: "Kompetitor (Linktree dll)", price: "Rp 250K–800K/tahun", icon: "fa-link", color: "var(--n-100)", ic: "var(--n-600)", items: ["Harga dalam USD (kena kurs)", "Fitur analytics terbatas", "Tidak bisa custom penuh", "Branding platform terlihat", "Tidak ada versi self-hosted"], bad: true },
            ].map((c) => (
              <div key={c.label} style={{ border: `2px solid ${c.highlight ? "var(--b-400)" : "var(--n-200)"}`, borderRadius: 20, overflow: "hidden", position: "relative", boxShadow: c.highlight ? "0 0 0 4px rgba(251,191,36,.12)" : undefined }}>
                {c.highlight && <div style={{ background: "var(--b-500)", color: "var(--b-950)", textAlign: "center", padding: "6px", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".04em" }}>PILIHAN TERBAIK ⭐</div>}
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: c.ic, fontSize: "1rem" }}>
                      <i className={`fa-solid ${c.icon}`} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".95rem", color: "var(--b-900)" }}>{c.label}</div>
                      <div style={{ fontSize: ".82rem", fontWeight: 700, color: c.highlight ? "var(--b-600)" : "var(--n-500)" }}>{c.price}</div>
                    </div>
                  </div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {c.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: ".82rem", color: "var(--n-600)" }}>
                        <i className={`fa-solid ${c.bad ? "fa-xmark" : "fa-check"}`} style={{ color: c.bad ? "var(--n-300)" : "var(--b-500)", marginTop: 2, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile stats strip */}
          <div style={{ background: "linear-gradient(135deg,var(--b-900),var(--b-800))", borderRadius: 24, padding: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "2rem", textAlign: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--fd)", fontSize: "2.4rem", fontWeight: 700, color: "var(--b-200)", lineHeight: 1 }}>97%</div>
              <div style={{ fontSize: ".82rem", color: "var(--b-300)", marginTop: ".4rem" }}>pengguna internet Indonesia akses via HP</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--fd)", fontSize: "2.4rem", fontWeight: 700, color: "var(--b-200)", lineHeight: 1 }}>2 mnt</div>
              <div style={{ fontSize: ".82rem", color: "var(--b-300)", marginTop: ".4rem" }}>waktu setup hingga halaman live</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--fd)", fontSize: "2.4rem", fontWeight: 700, color: "var(--b-200)", lineHeight: 1 }}>Rp&nbsp;0</div>
              <div style={{ fontSize: ".82rem", color: "var(--b-300)", marginTop: ".4rem" }}>biaya awal — daftar gratis, bayar kalau mau upgrade</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--fd)", fontSize: "2.4rem", fontWeight: 700, color: "var(--b-200)", lineHeight: 1 }}>10×</div>
              <div style={{ fontSize: ".82rem", color: "var(--b-300)", marginTop: ".4rem" }}>lebih murah dari biaya domain + hosting per tahun</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "6rem 2.5rem", background: "var(--b-50)" }} id="testimoni">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="sec-header">
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <i className="fa-solid fa-star" /> Kata Mereka
            </div>
            <div className="sec-title">Sudah dipakai oleh ratusan orang</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem", marginTop: "2rem" }}>
            {[
              { name: "Sari W.", role: "Reseller Online, Jakarta", avatar: "SW", text: "Sebelumnya bingung mau pakai apa selain Linktree. bannana.id jauh lebih lengkap, bisa custom warna sesuai brand toko aku, dan yang paling penting — GRATIS! Serius rekomen buat reseller.", rating: 5 },
              { name: "Dimas K.", role: "Content Creator, Bandung", avatar: "DK", text: "Analytics-nya detail banget. Aku bisa tahu link mana yang paling banyak diklik follower, jam ramai-nya kapan. Lumayan banget buat strategi konten.", rating: 5 },
              { name: "Rizky F.", role: "Freelance Designer, Surabaya", avatar: "RF", text: "Ganti bio link ke bannana.id dan portfolio aku langsung keliatan lebih profesional. Klien pertama langsung masuk dari link ini. Upgrade ke Pro udah worth banget!", rating: 5 },
              { name: "Mbak Nia", role: "Pemilik UMKM Kuliner, Yogyakarta", avatar: "MN", text: "Tadinya mau bayar jutaan buat bikin website. Pakai bannana.id cuma perlu 10 menit dan semuanya udah rapi — menu, WA, Instagram, semua ada!", rating: 5 },
              { name: "Arif M.", role: "Affiliator, Medan", avatar: "AM", text: "Semua link afiliasi aku taruh di sini, terus bagi ke semua platform. Click tracking-nya akurat. Akhirnya tau mana produk yang paling laku!", rating: 5 },
              { name: "Citra L.", role: "Podcaster & Blogger, Bali", avatar: "CL", text: "Suka banget sama tampilan tema Night-nya. Gelap, elegan, dan match sama vibe konten aku. Custom CSS-nya juga powerfull banget buat yang ngerti coding.", rating: 5 },
            ].map((t) => (
              <div key={t.name} style={{ background: "var(--n-0)", border: "2px solid var(--b-100)", borderRadius: 20, padding: "1.5rem" }}>
                <div style={{ color: "var(--b-400)", fontSize: "1rem", marginBottom: ".75rem" }}>
                  {"★".repeat(t.rating)}
                </div>
                <div style={{ fontSize: ".875rem", color: "var(--n-600)", lineHeight: 1.65, marginBottom: "1.25rem" }}>&ldquo;{t.text}&rdquo;</div>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,var(--b-300),var(--b-500))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-900)", fontWeight: 800, fontSize: ".8rem", flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--n-800)" }}>{t.name}</div>
                    <div style={{ fontSize: ".75rem", color: "var(--n-400)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="cta-inner">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(251,191,36,.15)", border: "1.5px solid rgba(251,191,36,.3)", borderRadius: 9999, padding: "5px 16px", fontSize: ".78rem", fontWeight: 700, color: "var(--b-300)", marginBottom: "1.5rem" }}>
            <i className="fa-solid fa-bolt" /> Gratis Selamanya · Tanpa Kartu Kredit
          </div>
          <h2 className="cta-h2">Mulai tampil profesional<br />hari ini &mdash; gratis!</h2>
          <p className="cta-sub">
            Daftar dalam 30 detik. Halaman langsung live. Mulai dari Rp&nbsp;0 &mdash; upgrade ke Pro kapanpun kamu siap.
          </p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Link href="/register" className="btn-white btn btn-xl">
              <i className="fa-solid fa-bolt" /> Daftar Gratis Sekarang
            </Link>
            <Link href="/pricing" className="btn-outline-light btn btn-xl">
              <i className="fa-solid fa-tag" /> Lihat Paket &amp; Harga
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", fontSize: ".8rem", color: "var(--b-300)" }}>
            {["✓ Tidak perlu coding", "✓ Tidak perlu domain", "✓ Tidak perlu hosting", "✓ Live dalam 2 menit"].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
