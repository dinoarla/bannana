"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/shared/Footer";

const faqs = [
  { q: "Apakah gratis benar-benar gratis?", a: "Ya! Paket Gratis tidak memiliki batas waktu. Kamu bisa menggunakan bannana.id secara gratis selamanya dengan fitur dasar. Tidak perlu kartu kredit untuk mendaftar." },
  { q: "Bisa upgrade/downgrade kapanpun?", a: "Tentu! Kamu bisa upgrade ke Pro kapanpun, dan downgrade kembali ke Gratis jika sudah tidak butuh fitur Pro. Data halamanmu tetap aman." },
  { q: "Metode pembayaran apa saja yang tersedia?", a: "Kami menerima transfer bank, dompet digital (GoPay, OVO, Dana), dan kartu kredit/debit Visa & Mastercard melalui payment gateway yang aman." },
  { q: "Apakah ada uji coba gratis untuk paket Pro?", a: "Ya! Paket Pro bisa dicoba gratis selama 14 hari tanpa kartu kredit. Setelah 14 hari, kamu bisa memilih berlangganan atau kembali ke paket Gratis." },
  { q: "Apa itu Self-Hosted dan siapa yang cocok?", a: "Self-Hosted berarti kamu download dan jalankan bannana.id di server milikmu sendiri. Cocok untuk developer, tim teknis, atau yang ingin kontrol penuh atas data. Butuh pengetahuan teknis (Node.js, MySQL, Nginx)." },
  { q: "Dataku aman jika saya berhenti berlangganan?", a: "Data halamanmu tetap aman. Jika kamu downgrade ke Gratis, beberapa fitur Pro tidak bisa diakses, tapi semua data link dan halaman tetap tersimpan." },
];

export function PricingContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function toggleFaq(i: number) {
    setOpenFaq(openFaq === i ? null : i);
  }

  const proPrice = yearly ? "12.5K" : "15K";
  const proPeriod = yearly
    ? <><span className="strike">Rp 15K</span> /bulan · Rp 150K/tahun</>
    : "/bulan";

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-logo"><span className="bana">🍌</span> bannana</Link>
        <ul className="navbar-links">
          <li><Link href="/#features">Fitur</Link></li>
          <li><Link href="/pricing" className="active">Pricing</Link></li>
        </ul>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm"><i className="fa-solid fa-house" /> Ke Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Masuk</Link>
              <Link href="/login?mode=register" className="btn btn-primary btn-sm"><i className="fa-solid fa-bolt" /> Daftar Gratis</Link>
            </>
          )}
        </div>
      </nav>

      <div className="pricing-hero">
        <div className="eyebrow" style={{ marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
          <i className="fa-solid fa-tag" /> Harga yang jujur &amp; transparan
        </div>
        <h1 className="ph-title">Pilih paket yang cocok buatmu</h1>
        <p className="ph-sub">Mulai gratis, upgrade kapanpun kamu siap. Tidak ada biaya tersembunyi.</p>
        <div className="toggle-wrap">
          <span className={`toggle-label${yearly ? " act" : ""}`}>Tahunan</span>
          <div className={`toggle${yearly ? "" : " off"}`} onClick={() => setYearly(!yearly)} />
          <span className={`toggle-label${!yearly ? " act" : ""}`}>
            Bulanan <span className="save-pill">Hemat 2 bulan</span>
          </span>
        </div>
      </div>

      <div className="pricing-sec">
        <div className="pricing-grid">
          {/* Gratis */}
          <div className="pc">
            <div className="pc-icon" style={{ background: "var(--b-100)", color: "var(--b-600)" }}>
              <i className="fa-solid fa-seedling" />
            </div>
            <div className="pc-name">Gratis</div>
            <div className="pc-desc">Sempurna untuk memulai dan mencoba bannana.id tanpa risiko apapun.</div>
            <div className="pc-price">
              <div className="pc-amount">Rp&nbsp;0</div>
              <div className="pc-period">selamanya gratis</div>
            </div>
            <Link href="/login?mode=register" className="btn btn-ghost btn-lg btn-full">Mulai Gratis</Link>
            <hr className="pc-divider" />
            <ul className="pc-features">
              <li className="li-yes"><i className="fa-solid fa-check" /> 1 halaman link</li>
              <li className="li-yes"><i className="fa-solid fa-check" /> Hingga 10 blok per halaman</li>
              <li className="li-yes"><i className="fa-solid fa-check" /> 3 tema preset</li>
              <li className="li-yes"><i className="fa-solid fa-check" /> Analytics dasar (7 hari)</li>
              <li className="li-yes"><i className="fa-solid fa-check" /> Subdomain bannana.id/username</li>
              <li className="li-no"><i className="fa-solid fa-xmark" /> Custom domain</li>
              <li className="li-no"><i className="fa-solid fa-xmark" /> Custom CSS</li>
              <li className="li-no"><i className="fa-solid fa-xmark" /> Analytics lengkap + CSV</li>
              <li className="li-no"><i className="fa-solid fa-xmark" /> REST API access</li>
            </ul>
          </div>

          {/* Pro */}
          <div className="pc pc-pop">
            <div className="pc-pop-badge"><i className="fa-solid fa-star" /> Paling Populer</div>
            <div className="pc-icon" style={{ background: "var(--b-100)", color: "var(--b-600)" }}>
              <i className="fa-solid fa-rocket" />
            </div>
            <div className="pc-name">Pro</div>
            <div className="pc-desc">Untuk kreator serius yang ingin tampil maksimal dan punya data lengkap.</div>
            <div className="pc-price">
              <div className="pc-amount">
                <span style={{ fontSize: "1.3rem", verticalAlign: "super" }}>Rp</span>{proPrice}
              </div>
              <div className="pc-period">{proPeriod}</div>
            </div>
            <Link href="/login?mode=register" className="btn btn-primary btn-lg btn-full">
              <i className="fa-solid fa-bolt" /> Mulai 14 Hari Gratis
            </Link>
            <div className="pc-note"><i className="fa-solid fa-circle-info" /> Tidak perlu kartu kredit</div>
            <hr className="pc-divider" />
            <ul className="pc-features">
              <li className="li-yes"><i className="fa-solid fa-check" /> <strong>Halaman tidak terbatas</strong></li>
              <li className="li-yes"><i className="fa-solid fa-check" /> <strong>Blok tidak terbatas</strong></li>
              <li className="li-yes"><i className="fa-solid fa-check" /> <strong>12+ tema preset</strong></li>
              <li className="li-yes"><i className="fa-solid fa-check" /> <strong>Custom CSS hingga 5KB</strong></li>
              <li className="li-yes"><i className="fa-solid fa-check" /> Analytics lengkap (90 hari) + export CSV</li>
              <li className="li-yes"><i className="fa-solid fa-check" /> <strong>Custom domain</strong></li>
              <li className="li-yes"><i className="fa-solid fa-check" /> REST API access</li>
              <li className="li-yes"><i className="fa-solid fa-check" /> <strong>Hapus branding bannana</strong></li>
              <li className="li-yes"><i className="fa-solid fa-check" /> Priority support</li>
            </ul>
          </div>

          {/* Self-Hosted */}
          <div className="pc">
            <div className="pc-icon" style={{ background: "#EDE9FE", color: "#7C3AED" }}>
              <i className="fa-solid fa-server" />
            </div>
            <div className="pc-name">Self-Hosted</div>
            <div className="pc-desc">Deploy di server sendiri, kontrol penuh. Cocok untuk developer &amp; tim teknis.</div>
            <div className="pc-price">
              <div className="pc-amount" style={{ color: "#7C3AED" }}>Gratis</div>
              <div className="pc-period">open source · MIT License</div>
            </div>
            <a href="#" className="btn btn-lg btn-full" style={{ background: "#EDE9FE", color: "#7C3AED", border: "2px solid #DDD6FE", fontWeight: 700 }}>
              <i className="fa-brands fa-github" /> Lihat di GitHub
            </a>
            <hr className="pc-divider" />
            <ul className="pc-features">
              <li style={{ color: "var(--n-700)" }}><i className="fa-solid fa-check" style={{ color: "#7C3AED" }} /> Semua fitur Pro, gratis</li>
              <li style={{ color: "var(--n-700)" }}><i className="fa-solid fa-check" style={{ color: "#7C3AED" }} /> Kode sumber lengkap</li>
              <li style={{ color: "var(--n-700)" }}><i className="fa-solid fa-check" style={{ color: "#7C3AED" }} /> Kontrol data sepenuhnya</li>
              <li style={{ color: "var(--n-700)" }}><i className="fa-solid fa-check" style={{ color: "#7C3AED" }} /> Next.js 15 + Prisma + MySQL</li>
              <li style={{ color: "var(--n-700)" }}><i className="fa-solid fa-check" style={{ color: "#7C3AED" }} /> Deploy PM2 + Nginx</li>
              <li className="li-no"><i className="fa-solid fa-xmark" /> Setup manual (butuh teknis)</li>
              <li className="li-no"><i className="fa-solid fa-xmark" /> Tanpa cloud support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="cmp-sec">
        <div className="cmp-inner">
          <div style={{ textAlign: "center" }}>
            <div className="cmp-title">Perbandingan Lengkap</div>
            <div style={{ fontSize: ".9rem", color: "var(--n-500)" }}>Semua fitur dalam satu tabel</div>
          </div>
          <table className="cmp-table">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Fitur</th>
                <th>Gratis</th>
                <th className="th-pro">Pro</th>
                <th>Self-Hosted</th>
              </tr>
            </thead>
            <tbody>
              <tr className="cmp-cat"><td colSpan={4}>Halaman &amp; Blok</td></tr>
              <tr>
                <td>Jumlah halaman</td><td>1</td>
                <td style={{ background: "var(--b-50)", fontWeight: 600 }}>Tidak terbatas</td>
                <td>Tidak terbatas</td>
              </tr>
              <tr>
                <td>Blok per halaman</td><td>10</td>
                <td style={{ background: "var(--b-50)", fontWeight: 600 }}>Tidak terbatas</td>
                <td>Tidak terbatas</td>
              </tr>
              <tr>
                <td>Semua jenis blok</td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr className="cmp-cat"><td colSpan={4}>Tampilan &amp; Tema</td></tr>
              <tr>
                <td>Tema preset</td><td>3 tema</td>
                <td style={{ background: "var(--b-50)", fontWeight: 600 }}>12+ tema</td>
                <td>12+ tema</td>
              </tr>
              <tr>
                <td>Custom CSS</td>
                <td><i className="fa-solid fa-xmark cmp-no" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr className="cmp-cat"><td colSpan={4}>Domain &amp; Branding</td></tr>
              <tr>
                <td>Subdomain bannana.id</td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr>
                <td>Custom domain</td>
                <td><i className="fa-solid fa-xmark cmp-no" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr>
                <td>Hapus branding bannana</td>
                <td><i className="fa-solid fa-xmark cmp-no" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr className="cmp-cat"><td colSpan={4}>Analytics</td></tr>
              <tr>
                <td>Analytics dasar</td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr>
                <td>Retensi data</td><td>7 hari</td>
                <td style={{ background: "var(--b-50)", fontWeight: 600 }}>90 hari</td>
                <td>Tidak terbatas</td>
              </tr>
              <tr>
                <td>Export CSV</td>
                <td><i className="fa-solid fa-xmark cmp-no" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr className="cmp-cat"><td colSpan={4}>Developer</td></tr>
              <tr>
                <td>REST API access</td>
                <td><i className="fa-solid fa-xmark cmp-no" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-check cmp-yes" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
              <tr>
                <td>Akses kode sumber</td>
                <td><i className="fa-solid fa-xmark cmp-no" /></td>
                <td style={{ background: "var(--b-50)" }}><i className="fa-solid fa-xmark cmp-no" /></td>
                <td><i className="fa-solid fa-check cmp-yes" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-sec">
        <div className="faq-inner">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="cmp-title">Pertanyaan Umum</div>
            <div style={{ fontSize: ".9rem", color: "var(--n-500)", marginTop: ".4rem" }}>Ada yang masih bingung? Kami siap bantu!</div>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
              <button className="faq-q" onClick={() => toggleFaq(i)}>
                {faq.q} <i className="fa-solid fa-chevron-down" />
              </button>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div className="cta-strip">
        <h2 className="cta-title">{isLoggedIn ? "Kamu sudah di bannana! 🍌" : "Siap mulai? Gratis!"}</h2>
        <p className="cta-sub">{isLoggedIn ? "Buka dashboard dan mulai buat halaman linkmu." : "Daftar dalam 30 detik, buat link page pertamamu, dan share ke followers!"}</p>
        <div className="cta-acts">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn btn-white btn-xl">
              <i className="fa-solid fa-house" /> Ke Dashboard
            </Link>
          ) : (
            <Link href="/login?mode=register" className="btn btn-white btn-xl">
              <i className="fa-solid fa-bolt" /> Mulai Gratis Sekarang
            </Link>
          )}
          <Link href="/" className="btn btn-ow btn-xl">
            <i className="fa-solid fa-arrow-left" /> Kembali ke Home
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
