import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "MIT License — bannana.id",
  description: "bannana.id is open-source software released under the MIT License.",
};

export default function MitPage() {
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
            <i className="fa-brands fa-github" /> Open Source
          </div>
          <h1 className="sec-title">MIT License</h1>
          <p className="muted" style={{ marginTop: ".5rem" }}>
            bannana.id adalah perangkat lunak open-source yang dirilis di bawah lisensi MIT.
          </p>
        </div>

        <div style={{ background: "var(--n-50)", border: "1.5px solid var(--n-200)", borderRadius: 16, padding: "2rem 2.25rem", fontFamily: "var(--fm, monospace)", fontSize: ".875rem", lineHeight: 1.8, color: "var(--n-700)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
{`MIT License

Copyright (c) 2026 bannana.id

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        </div>

        <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ background: "var(--b-50)", border: "1.5px solid var(--b-200)", borderRadius: 14, padding: "1.25rem 1.5rem" }}>
            <div style={{ fontWeight: 700, color: "var(--b-900)", marginBottom: ".4rem" }}>
              <i className="fa-solid fa-circle-check" style={{ color: "var(--b-500)", marginRight: 8 }} />
              Apa yang boleh kamu lakukan
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".4rem", paddingLeft: "1.5rem" }}>
              {[
                "Menggunakan bannana.id secara bebas untuk keperluan pribadi maupun komersial",
                "Menyalin, memodifikasi, dan mendistribusikan kode sumber",
                "Membuat fork dan mengembangkan versi sendiri",
                "Menggunakannya dalam proyek proprietary",
              ].map((item) => (
                <li key={item} style={{ fontSize: ".875rem", color: "var(--n-600)", display: "flex", gap: 8 }}>
                  <i className="fa-solid fa-check" style={{ color: "var(--b-500)", marginTop: 3, flexShrink: 0, fontSize: ".75rem" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: "var(--n-50)", border: "1.5px solid var(--n-200)", borderRadius: 14, padding: "1.25rem 1.5rem" }}>
            <div style={{ fontWeight: 700, color: "var(--n-800)", marginBottom: ".4rem" }}>
              <i className="fa-solid fa-circle-info" style={{ color: "var(--n-500)", marginRight: 8 }} />
              Yang perlu diperhatikan
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".4rem", paddingLeft: "1.5rem" }}>
              {[
                "Sertakan teks lisensi dan copyright di setiap salinan atau distribusi",
                "Tidak ada garansi — software disediakan \"apa adanya\"",
                "Penulis tidak bertanggung jawab atas kerusakan yang timbul dari penggunaan",
              ].map((item) => (
                <li key={item} style={{ fontSize: ".875rem", color: "var(--n-600)", display: "flex", gap: 8 }}>
                  <i className="fa-solid fa-circle-dot" style={{ color: "var(--n-400)", marginTop: 3, flexShrink: 0, fontSize: ".75rem" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link href="/" className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-arrow-left" /> Kembali ke Beranda
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
