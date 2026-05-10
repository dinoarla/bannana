"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [devLink, setDevLink] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error?.message ?? "Terjadi kesalahan."); return; }
      if (json.data?.resetUrl) setDevLink(json.data.resetUrl);
      setSent(true);
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page-bg">
      <div className="auth-wrap">
        <Link href="/" className="auth-logo">
          <span className="bana">🍌</span> bannana
        </Link>

        <div className="auth-glass">
          {!sent ? (
            <>
              <div className="icon-big"><i className="fa-solid fa-key" /></div>
              <div className="card-title">Lupa Password?</div>
              <div className="card-sub">Tenang! Masukkan emailmu dan kami akan kirim link reset password ke sana.</div>
              {error && (
                <div style={{ background: "var(--danger-100)", border: "1.5px solid #FECDD3", borderRadius: 10, padding: ".75rem 1rem", fontSize: ".84rem", color: "var(--danger-700)", margin: "1rem 0", display: "flex", gap: ".5rem" }}>
                  <i className="fa-solid fa-triangle-exclamation" /> {error}
                </div>
              )}
              <form onSubmit={submit}>
                <div className="form-group">
                  <label className="form-label">Alamat Email</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-regular fa-envelope" />
                    <input className="input" type="email" placeholder="kamu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="form-hint"><i className="fa-solid fa-circle-info" /> Link reset akan expired dalam 1 jam</div>
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? <><i className="fa-solid fa-spinner fa-spin" /> Mengirim...</>
                    : <><i className="fa-solid fa-paper-plane" /> Kirim Link Reset</>
                  }
                </button>
              </form>
              <Link href="/login" className="back-link">
                <i className="fa-solid fa-arrow-left" /> Kembali ke halaman masuk
              </Link>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon"><i className="fa-solid fa-envelope-circle-check" /></div>
              <div className="card-title">Cek emailmu! 📬</div>
              <div className="card-sub">
                Kami sudah kirim link reset ke <strong>{email}</strong>. Kalau tidak ada di inbox, cek folder spam.
              </div>
              {devLink && (
                <div style={{ background: "var(--b-50)", border: "1.5px solid var(--b-200)", borderRadius: 12, padding: "1rem", fontSize: ".82rem", color: "var(--n-600)", lineHeight: 1.65, textAlign: "left", wordBreak: "break-all", marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 700, color: "var(--b-800)", marginBottom: ".4rem" }}>
                    <i className="fa-solid fa-link" style={{ marginRight: 5 }} /> Link reset kamu:
                  </div>
                  <Link href={devLink} style={{ color: "var(--b-700)", fontSize: ".78rem" }}>{devLink}</Link>
                </div>
              )}
              <div style={{ background: "var(--b-50)", border: "1.5px solid var(--b-200)", borderRadius: 12, padding: "1rem", fontSize: ".82rem", color: "var(--n-600)", lineHeight: 1.65, textAlign: "left" }}>
                <i className="fa-solid fa-circle-info" style={{ color: "var(--b-500)", marginRight: 6 }} />
                Link reset password hanya berlaku selama <strong>1 jam</strong> dan hanya bisa dipakai sekali.
              </div>
              <Link href="/login" className="back-link" style={{ marginTop: "2rem" }}>
                <i className="fa-solid fa-arrow-left" /> Kembali ke halaman masuk
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
