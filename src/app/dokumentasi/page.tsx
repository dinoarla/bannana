import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Dokumentasi",
  description: "Panduan lengkap menggunakan bannana.id — mulai dari membuat akun, menambahkan blok konten, memilih tema, hingga memantau analytics.",
  openGraph: {
    title: "Dokumentasi bannana.id",
    description: "Panduan lengkap menggunakan bannana.id untuk UMKM, kreator, freelancer, dan affiliator.",
  },
};

const sections = [
  { id: "mulai-cepat", label: "Mulai Cepat", icon: "fa-rocket" },
  { id: "blok-konten", label: "Blok Konten", icon: "fa-cubes" },
  { id: "tema", label: "Tema", icon: "fa-palette" },
  { id: "analytics", label: "Analytics", icon: "fa-chart-line" },
  { id: "faq", label: "FAQ", icon: "fa-circle-question" },
];

const bloks = [
  { icon: "fa-link", name: "LINK", desc: "Tautan ke website, toko, atau halaman lain. Tampil sebagai tombol dengan judul dan URL yang bisa dikustomisasi." },
  { icon: "fa-heading", name: "HEADER", desc: "Judul atau subjudul untuk mengelompokkan konten halaman kamu." },
  { icon: "fa-share-nodes", name: "SOCIAL", desc: "Ikon media sosial (Instagram, TikTok, YouTube, dll.) yang langsung terhubung ke profil sosialmu." },
  { icon: "fa-code", name: "EMBED", desc: "Sematkan konten dari YouTube, Spotify, SoundCloud, atau platform lain langsung ke halamanmu." },
  { icon: "fa-image", name: "IMAGE", desc: "Tambahkan gambar atau banner ke halaman profilmu." },
  { icon: "fa-minus", name: "DIVIDER", desc: "Pemisah visual untuk membantu pengunjung membaca halaman dengan lebih nyaman." },
];

const faqs = [
  { q: "Apakah bannana.id gratis?", a: "Ya! Plan Gratis mencakup 10 blok konten, 3 tema, dan analitik dasar tanpa batas waktu. Plan Pro tersedia untuk fitur lebih lengkap." },
  { q: "Bisakah saya mengubah username?", a: "Saat ini username bersifat permanen setelah dipilih. Fitur ganti username sedang dalam pengembangan dan akan tersedia di versi mendatang." },
  { q: "Apakah ada batas jumlah pengunjung?", a: "Tidak ada! Halaman bannana.id-mu bisa dikunjungi siapa saja tanpa batas, baik di plan Gratis maupun Pro." },
  { q: "Bagaimana cara menghapus akun?", a: "Buka Pengaturan → Akun → scroll ke bawah → klik 'Hapus Akun'. Semua data dihapus permanen dalam 30 hari." },
  { q: "Apakah bannana.id bisa dipakai untuk bisnis?", a: "Tentu! bannana.id cocok untuk UMKM, kreator konten, freelancer, dan affiliator sebagai 'kartu nama digital' bisnis kamu." },
];

export default function DokumentasiPage() {
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

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem 6rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div className="eyebrow" style={{ marginBottom: ".75rem" }}>
            <i className="fa-solid fa-book-open" /> Dokumentasi
          </div>
          <h1 className="sec-title">Panduan Penggunaan bannana.id</h1>
          <p className="muted" style={{ marginTop: ".5rem", maxWidth: 520 }}>
            Semua yang kamu perlu tahu untuk membuat link page yang keren dan mulai mendapat klik.
          </p>
        </div>

        <div className="docs-layout">
          {/* Sidebar */}
          <nav className="docs-sidebar">
            <p style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".75rem" }}>
              Panduan
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".2rem" }}>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="docs-nav-link">
                    <i className={`fa-solid ${s.icon}`} style={{ width: 16, marginRight: ".5rem", color: "var(--b-500)", fontSize: ".8rem" }} />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="docs-tip" style={{ marginTop: "1.5rem" }}>
              <p style={{ fontWeight: 700, fontSize: ".82rem", color: "var(--b-800)", marginBottom: ".4rem" }}>Butuh bantuan lebih?</p>
              <p style={{ fontSize: ".78rem", color: "var(--n-500)", lineHeight: 1.6, marginBottom: ".875rem" }}>
                Tidak ketemu jawabannya? Hubungi tim bannana.id.
              </p>
              <Link href="/kontak" className="btn btn-secondary btn-sm" style={{ fontSize: ".78rem", width: "100%", justifyContent: "center" }}>
                <i className="fa-solid fa-envelope" /> Hubungi Kami
              </Link>
            </div>
          </nav>

          {/* Main content */}
          <div className="legal-body">

            {/* Mulai Cepat */}
            <section id="mulai-cepat">
              <h2>1. Mulai Cepat</h2>
              <p>bannana.id memungkinkan kamu membuat halaman link yang cantik dalam hitungan menit. Ikuti langkah berikut:</p>
              <ol style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
                <li>
                  <strong>Daftar akun</strong> — Kunjungi{" "}
                  <Link href="/register">bannana.id/register</Link> dan buat akun gratis dengan emailmu.
                </li>
                <li>
                  <strong>Pilih username</strong> — Username-mu menjadi URL halaman
                  (contoh: <code style={{ background: "var(--b-50)", padding: "1px 6px", borderRadius: 5, fontSize: ".85em", color: "var(--b-800)" }}>bannana.id/namakamu</code>).
                </li>
                <li><strong>Tambah blok</strong> — Mulai tambahkan link, media sosial, atau konten lainnya.</li>
                <li><strong>Pilih tema</strong> — Sesuaikan tampilan halaman dengan tema yang cocok dengan brandmu.</li>
                <li><strong>Bagikan</strong> — Salin link halamanmu dan tempel di semua bio media sosialmu.</li>
              </ol>
              <div className="docs-tip">
                <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--b-900)", marginBottom: ".25rem" }}>
                  <i className="fa-solid fa-lightbulb" style={{ color: "var(--b-500)", marginRight: ".4rem" }} />
                  Tips
                </p>
                <p style={{ fontSize: ".85rem", color: "var(--n-600)", margin: 0 }}>
                  Akun gratis sudah mencakup 10 blok konten dan 3 pilihan tema. Upgrade ke Pro untuk blok tidak terbatas dan akses semua tema.
                </p>
              </div>
            </section>

            {/* Blok Konten */}
            <section id="blok-konten">
              <h2>2. Blok Konten</h2>
              <p>Blok adalah elemen penyusun halamanmu. Ada 6 jenis blok yang tersedia:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".625rem", margin: "1rem 0" }}>
                {bloks.map((blok) => (
                  <div key={blok.name} className="blok-item">
                    <div className="blok-icon">
                      <i className={`fa-solid ${blok.icon}`} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--b-900)", marginBottom: ".25rem" }}>{blok.name}</p>
                      <p style={{ fontSize: ".85rem", color: "var(--n-600)", margin: 0, lineHeight: 1.65 }}>{blok.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p>Ubah urutan blok dengan <strong>drag & drop</strong> di editor. Klik ikon pensil untuk edit, ikon hapus untuk menghapus.</p>
            </section>

            {/* Tema */}
            <section id="tema">
              <h2>3. Tema</h2>
              <p>
                Tema mengatur tampilan keseluruhan halaman bannana.id-mu — warna latar, warna tombol, font, dan efek visual.
                Saat ini tersedia <strong>12 tema</strong>:
              </p>
              <ul>
                <li><strong>Gratis (3 tema):</strong> Default, Dark, dan Minimal</li>
                <li><strong>Pro (9 tema):</strong> Ocean, Sunset, Forest, Rose, Neon, Pastel, Retro, Corporate, dan Elegant</li>
              </ul>
              <p>
                Untuk mengganti tema: buka dashboard → klik tab <strong>Tema</strong> → pilih tema yang kamu suka.
                Perubahan langsung terlihat secara real-time.
              </p>
            </section>

            {/* Analytics */}
            <section id="analytics">
              <h2>4. Analytics</h2>
              <p>bannana.id menyediakan data analitik untuk memahami pengunjung halamanmu:</p>
              <ul>
                <li><strong>Total Klik</strong> — Jumlah total klik pada semua tautan di halamanmu.</li>
                <li><strong>Klik per Blok</strong> — Lihat blok mana yang paling sering diklik.</li>
                <li><strong>Asal Negara</strong> — Dari mana saja pengunjungmu berasal.</li>
                <li><strong>Jenis Perangkat</strong> — Desktop, mobile, atau tablet.</li>
                <li><strong>Tren Waktu</strong> — Grafik klik per hari, minggu, atau bulan.</li>
              </ul>
              <p>
                Data analitik tersedia di tab <strong>Analytics</strong> di dashboard. Pengguna Pro mendapat retensi
                data hingga 1 tahun dan kemampuan ekspor CSV.
              </p>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2>5. FAQ — Pertanyaan Umum</h2>
              <div className="faq-simple">
                {faqs.map((item, i) => (
                  <div key={i} className="faq-simple-item">
                    <p className="faq-simple-q">
                      <i className="fa-solid fa-circle-question" style={{ color: "var(--b-500)", marginRight: ".5rem" }} />
                      {item.q}
                    </p>
                    <p className="faq-simple-a">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div style={{ marginTop: "2.5rem", padding: "2rem", background: "var(--b-50)", borderRadius: 16, border: "1.5px solid var(--b-200)", textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--b-900)", marginBottom: ".4rem" }}>
                Masih ada pertanyaan?
              </p>
              <p style={{ fontSize: ".88rem", color: "var(--n-500)", marginBottom: "1.25rem" }}>
                Tim bannana.id siap membantu kamu.
              </p>
              <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/kontak" className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-envelope" /> Hubungi Kami
                </Link>
                <Link href="/laporin-bug" className="btn btn-ghost btn-sm">
                  <i className="fa-solid fa-bug" /> Laporin Bug
                </Link>
                <Link href="/request-fitur" className="btn btn-ghost btn-sm">
                  <i className="fa-solid fa-lightbulb" /> Request Fitur
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
