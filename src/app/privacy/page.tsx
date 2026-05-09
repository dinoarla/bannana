import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — bannana.id",
  description: "Kebijakan privasi dan perlindungan data pengguna bannana.id.",
};

export default function PrivacyPage() {
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
            <i className="fa-solid fa-shield-halved" /> Legal
          </div>
          <h1 className="sec-title">Kebijakan Privasi</h1>
          <p className="muted" style={{ marginTop: ".5rem" }}>
            Terakhir diperbarui: 1 Januari 2025
          </p>
        </div>

        <div className="legal-body">
          <section>
            <h2>1. Pendahuluan</h2>
            <p>
              bannana.id berkomitmen untuk melindungi privasi penggunanya. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadimu saat menggunakan layanan bannana.id.
            </p>
          </section>

          <section>
            <h2>2. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan informasi berikut:</p>
            <ul>
              <li><strong>Informasi Akun:</strong> nama, username, alamat email, dan kata sandi terenkripsi saat kamu mendaftar.</li>
              <li><strong>Konten Profil:</strong> tautan, gambar, dan informasi lain yang kamu tambahkan ke halaman profil bannana.id-mu.</li>
              <li><strong>Data Analitik:</strong> jumlah klik, asal negara pengunjung, dan jenis perangkat yang digunakan pengunjung halaman profilmu.</li>
              <li><strong>Data Teknis:</strong> alamat IP, jenis browser, sistem operasi, dan waktu akses untuk keamanan dan optimasi layanan.</li>
            </ul>
          </section>

          <section>
            <h2>3. Cara Kami Menggunakan Informasi</h2>
            <p>Informasi yang dikumpulkan digunakan untuk:</p>
            <ul>
              <li>Menyediakan, mengoperasikan, dan meningkatkan layanan bannana.id</li>
              <li>Menampilkan statistik analitik pada dashboard penggunamu</li>
              <li>Mengirim notifikasi penting terkait akun (bukan spam pemasaran)</li>
              <li>Mendeteksi dan mencegah aktivitas penipuan atau penyalahgunaan</li>
              <li>Mematuhi kewajiban hukum yang berlaku</li>
            </ul>
          </section>

          <section>
            <h2>4. Berbagi Informasi</h2>
            <p>
              bannana.id <strong>tidak menjual</strong> data pribadimu kepada pihak ketiga. Kami hanya berbagi informasi dalam kondisi berikut:
            </p>
            <ul>
              <li>Dengan penyedia layanan infrastruktur (hosting, database) yang terikat perjanjian kerahasiaan</li>
              <li>Jika diwajibkan oleh hukum atau perintah pengadilan yang sah</li>
              <li>Dengan persetujuan eksplisit darimu</li>
            </ul>
          </section>

          <section>
            <h2>5. Keamanan Data</h2>
            <p>
              Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi datamu, termasuk enkripsi kata sandi menggunakan bcrypt, koneksi HTTPS, dan kontrol akses database yang ketat. Namun, tidak ada sistem yang 100% aman — kami mendorongmu untuk menggunakan kata sandi yang kuat dan unik.
            </p>
          </section>

          <section>
            <h2>6. Cookie dan Penyimpanan Lokal</h2>
            <p>
              bannana.id menggunakan cookie sesi httpOnly untuk autentikasi yang aman. Cookie ini tidak dapat diakses oleh JavaScript pihak ketiga dan dihapus saat kamu keluar dari akun. Kami tidak menggunakan cookie pelacak pihak ketiga untuk iklan.
            </p>
          </section>

          <section>
            <h2>7. Retensi Data</h2>
            <p>
              Kami menyimpan datamu selama akunmu aktif. Saat kamu menghapus akun, data profil, konten, dan analitikmu akan dihapus permanen dari sistem kami dalam waktu 30 hari, kecuali jika diperlukan oleh kewajiban hukum.
            </p>
          </section>

          <section>
            <h2>8. Hak Pengguna</h2>
            <p>Kamu memiliki hak untuk:</p>
            <ul>
              <li><strong>Mengakses</strong> data pribadi yang kami simpan tentangmu</li>
              <li><strong>Memperbaiki</strong> informasi yang tidak akurat melalui halaman Pengaturan</li>
              <li><strong>Mengekspor</strong> datamu (tersedia di dashboard)</li>
              <li><strong>Menghapus</strong> akunmu beserta semua data terkait</li>
              <li><strong>Menolak</strong> pemrosesan data untuk tujuan tertentu</li>
            </ul>
          </section>

          <section>
            <h2>9. Privasi Anak-Anak</h2>
            <p>
              Layanan bannana.id tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak dengan sengaja mengumpulkan informasi dari anak-anak. Jika kamu mendapati anak di bawah umur mendaftar, hubungi kami segera.
            </p>
          </section>

          <section>
            <h2>10. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi dalam aplikasi setidaknya 7 hari sebelum berlaku.
            </p>
          </section>

          <section>
            <h2>11. Hubungi Kami</h2>
            <p>
              Jika ada pertanyaan atau permintaan terkait data pribadimu, silakan hubungi kami. Kami berkomitmen merespons dalam waktu 3 hari kerja.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
