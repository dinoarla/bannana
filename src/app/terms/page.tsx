import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — bannana.id",
  description: "Syarat dan ketentuan penggunaan layanan bannana.id.",
};

export default function TermsPage() {
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

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "5rem 2rem 6rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div className="eyebrow" style={{ marginBottom: ".75rem" }}>
            <i className="fa-solid fa-file-contract" /> Legal
          </div>
          <h1 className="sec-title">Syarat &amp; Ketentuan</h1>
          <p className="muted" style={{ marginTop: ".5rem" }}>
            Terakhir diperbarui: 1 Januari 2025
          </p>
        </div>

        <div className="legal-body">
          <section>
            <h2>1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses atau menggunakan layanan bannana.id (&quot;Layanan&quot;), kamu menyetujui untuk terikat dengan Syarat &amp; Ketentuan ini. Jika kamu tidak setuju dengan bagian mana pun dari syarat ini, kamu tidak dapat menggunakan Layanan kami.
            </p>
          </section>

          <section>
            <h2>2. Deskripsi Layanan</h2>
            <p>
              bannana.id adalah platform <em>link-in-bio</em> yang memungkinkan pengguna membuat halaman profil berisi kumpulan tautan, blok konten, dan informasi sosial media. Layanan tersedia secara gratis dengan fitur dasar, dan dapat ditingkatkan ke paket berbayar untuk fitur tambahan.
            </p>
          </section>

          <section>
            <h2>3. Akun Pengguna</h2>
            <p>
              Kamu bertanggung jawab untuk menjaga kerahasiaan kata sandi akun dan semua aktivitas yang terjadi di bawah akunmu. Kamu wajib memberikan informasi yang akurat dan terkini saat mendaftar. bannana.id berhak menangguhkan atau menghapus akun yang melanggar syarat ini.
            </p>
          </section>

          <section>
            <h2>4. Konten Pengguna</h2>
            <p>
              Kamu mempertahankan hak kepemilikan atas konten yang kamu unggah ke bannana.id. Dengan mengunggah konten, kamu memberikan bannana.id lisensi non-eksklusif untuk menampilkan konten tersebut sesuai fungsi Layanan. Kamu dilarang mengunggah konten yang:
            </p>
            <ul>
              <li>Melanggar hak cipta atau hak kekayaan intelektual pihak lain</li>
              <li>Mengandung konten ilegal, berbahaya, atau melanggar hukum yang berlaku di Indonesia</li>
              <li>Bersifat spam, menyesatkan, atau penipuan</li>
              <li>Mengandung malware atau kode berbahaya</li>
            </ul>
          </section>

          <section>
            <h2>5. Penggunaan yang Dilarang</h2>
            <p>Kamu dilarang menggunakan Layanan untuk:</p>
            <ul>
              <li>Melanggar hukum atau peraturan yang berlaku</li>
              <li>Mengirimkan spam atau komunikasi yang tidak diminta</li>
              <li>Menyamar sebagai orang atau entitas lain</li>
              <li>Mengganggu atau merusak infrastruktur Layanan</li>
              <li>Mengumpulkan data pengguna lain tanpa izin</li>
            </ul>
          </section>

          <section>
            <h2>6. Kebijakan Privasi</h2>
            <p>
              Penggunaan Layanan juga diatur oleh <Link href="/privacy">Kebijakan Privasi</Link> kami, yang merupakan bagian integral dari Syarat &amp; Ketentuan ini.
            </p>
          </section>

          <section>
            <h2>7. Penghentian Layanan</h2>
            <p>
              bannana.id berhak menghentikan atau menangguhkan akses ke Layanan kapan saja, dengan atau tanpa pemberitahuan, atas pelanggaraan syarat ini atau alasan lain yang dianggap perlu.
            </p>
          </section>

          <section>
            <h2>8. Penafian Garansi</h2>
            <p>
              Layanan disediakan &quot;sebagaimana adanya&quot; tanpa garansi apa pun, baik tersurat maupun tersirat. bannana.id tidak menjamin bahwa Layanan akan selalu tersedia, bebas dari kesalahan, atau memenuhi kebutuhanmu secara spesifik.
            </p>
          </section>

          <section>
            <h2>9. Batasan Tanggung Jawab</h2>
            <p>
              Sejauh diizinkan oleh hukum yang berlaku, bannana.id tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan.
            </p>
          </section>

          <section>
            <h2>10. Perubahan Syarat</h2>
            <p>
              bannana.id berhak mengubah Syarat &amp; Ketentuan ini kapan saja. Perubahan signifikan akan diberitahukan melalui email atau notifikasi dalam aplikasi. Penggunaan Layanan yang berkelanjutan setelah perubahan merupakan penerimaan syarat yang baru.
            </p>
          </section>

          <section>
            <h2>11. Hukum yang Berlaku</h2>
            <p>
              Syarat &amp; Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa diselesaikan melalui mekanisme yang berlaku di yurisdiksi Indonesia.
            </p>
          </section>

          <section>
            <h2>12. Hubungi Kami</h2>
            <p>
              Jika ada pertanyaan tentang Syarat &amp; Ketentuan ini, silakan hubungi kami melalui halaman Kontak atau email resmi bannana.id.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
