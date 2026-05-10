"use client";

import Link from "next/link";
import { useState, use } from "react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;
    if (password !== confirm) { setError("Konfirmasi password tidak cocok."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error?.message ?? "Link tidak valid atau kadaluarsa."); return; }
      setDone(true);
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
          {done ? (
            <div className="success-state">
              <div className="success-icon"><i className="fa-solid fa-circle-check" /></div>
              <div className="card-title">Password berhasil direset! 🎉</div>
              <div className="card-sub">Password kamu sudah diganti. Silakan login dengan password baru.</div>
              <Link href="/login" className="btn-submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, textDecoration: "none", marginTop: "1.5rem" }}>
                <i className="fa-solid fa-arrow-right-to-bracket" /> Masuk Sekarang
              </Link>
            </div>
          ) : (
            <>
              <div className="icon-big"><i className="fa-solid fa-lock" /></div>
              <div className="card-title">Buat Password Baru</div>
              <div className="card-sub">Masukkan password baru untuk akunmu.</div>
              {error && (
                <div style={{ background: "var(--danger-100)", border: "1.5px solid #FECDD3", borderRadius: 10, padding: ".75rem 1rem", fontSize: ".84rem", color: "var(--danger-700)", margin: "1rem 0", display: "flex", gap: ".5rem" }}>
                  <i className="fa-solid fa-triangle-exclamation" /> {error}
                </div>
              )}
              <form onSubmit={submit}>
                <div className="form-group">
                  <label className="form-label">Password Baru</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-solid fa-lock" />
                    <input className="input" type={showPw ? "text" : "password"} name="password" placeholder="Min. 8 karakter" required minLength={8} />
                    <button type="button" className="ico ico-right" style={{ border: "none", background: "none", color: "var(--n-400)", cursor: "pointer" }} onClick={() => setShowPw(!showPw)}>
                      <i className={showPw ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Konfirmasi Password</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-solid fa-lock" />
                    <input className="input" type={showPw ? "text" : "password"} name="confirm" placeholder="Ulangi password baru" required minLength={8} />
                  </div>
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Menyimpan...</> : <><i className="fa-solid fa-check" /> Simpan Password Baru</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
