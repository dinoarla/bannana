"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Footer } from "@/components/shared/Footer";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugPreview, setSlugPreview] = useState("kreator_kamu");
  const [pwStrength, setPwStrength] = useState<{ bars: number; label: string; cls: string } | null>(null);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "register") setMode("register");
  }, []);

  function checkPw(v: string) {
    if (!v) { setPwStrength(null); return; }
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    const cls = s <= 1 ? "weak" : s <= 2 ? "medium" : "strong";
    const label = { weak: "Password lemah", medium: "Cukup kuat", strong: "Password kuat!" }[cls];
    setPwStrength({ bars: s, label, cls });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error?.message ?? "Terjadi kesalahan."); return; }
      location.href = "/dashboard";
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <main className="auth-page-bg">
      <div className="auth-wrap">
        <Link href="/" className="auth-logo">
          <span className="bana">🍌</span> bannana
        </Link>

        <div className="auth-glass">
          <div className="auth-head">
            <div className="auth-title">
              {mode === "login" ? "Selamat datang! 👋" : "Buat akun bannana.id"}
            </div>
            <div className="auth-sub">
              {mode === "login" ? "Masuk ke akun bannana.id kamu" : "Gratis selamanya — tanpa kartu kredit"}
            </div>
          </div>

          {/* TABS */}
          <div className="auth-tabs">
            <button className={`auth-tab${mode === "login" ? " act" : ""}`} onClick={() => setMode("login")}>Masuk</button>
            <button className={`auth-tab${mode === "register" ? " act" : ""}`} onClick={() => setMode("register")}>Daftar</button>
          </div>

          {/* SSO */}
          <div className="sso-group">
            <a href="#" className="sso-btn"><i className="fa-brands fa-google" style={{ color: "#EA4335" }} /> Lanjutkan dengan Google</a>
            <a href="#" className="sso-btn"><i className="fa-brands fa-github" style={{ color: "var(--n-800)" }} /> Lanjutkan dengan GitHub</a>
          </div>

          <div className="divider">
            <div className="div-line" />
            <div className="div-txt">atau gunakan email</div>
            <div className="div-line" />
          </div>

          {error && (
            <div style={{ background: "var(--danger-100)", border: "1.5px solid #FECDD3", borderRadius: 10, padding: ".75rem 1rem", fontSize: ".84rem", color: "var(--danger-700)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <i className="fa-solid fa-triangle-exclamation" /> {error}
            </div>
          )}

          <form onSubmit={submit}>
            {mode === "login" ? (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-regular fa-envelope" />
                    <input className="input" type="email" name="email" placeholder="kamu@email.com" required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Password</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-solid fa-lock" />
                    <input className="input" type={showPw ? "text" : "password"} name="password" placeholder="••••••••" required />
                    <button type="button" className="ico ico-right" style={{ border: "none", background: "none", color: "var(--n-400)", fontSize: ".85rem", cursor: "pointer" }} onClick={() => setShowPw(!showPw)}>
                      <i className={showPw ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
                    </button>
                  </div>
                </div>
                <Link href="/forgot-password" className="forgot-link">Lupa password?</Link>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Memproses...</> : <><i className="fa-solid fa-arrow-right-to-bracket" /> Masuk</>}
                </button>
                <div className="auth-terms">
                  <i className="fa-solid fa-shield-halved" style={{ color: "var(--b-400)" }} /> Login aman &amp; terenkripsi dengan bcrypt
                </div>
                <div className="auth-switch">Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setMode("register"); }}>Daftar gratis</a></div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nama Depan</label>
                    <div className="input-icon-wrap">
                      <i className="ico fa-solid fa-user" />
                      <input className="input" type="text" name="firstName" placeholder="Andi" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Belakang</label>
                    <div className="input-icon-wrap">
                      <i className="ico fa-solid fa-user" />
                      <input className="input" type="text" name="lastName" placeholder="Pratama" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-solid fa-at" />
                    <input className="input" type="text" name="username" placeholder="kreator_kamu" onChange={(e) => setSlugPreview(e.target.value || "kreator_kamu")} required pattern="[a-zA-Z0-9_\-]+" minLength={3} maxLength={32} />
                  </div>
                  <div className="form-hint"><i className="fa-solid fa-circle-info" /> bannana.id/<strong>{slugPreview}</strong></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-regular fa-envelope" />
                    <input className="input" type="email" name="email" placeholder="kamu@email.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-icon-wrap">
                    <i className="ico fa-solid fa-lock" />
                    <input className="input" type={showPw ? "text" : "password"} name="password" placeholder="Min. 8 karakter" required minLength={8} onChange={(e) => checkPw(e.target.value)} />
                    <button type="button" className="ico ico-right" style={{ border: "none", background: "none", color: "var(--n-400)", fontSize: ".85rem", cursor: "pointer" }} onClick={() => setShowPw(!showPw)}>
                      <i className={showPw ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
                    </button>
                  </div>
                  {pwStrength && (
                    <>
                      <div className="pw-bars">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`pw-bar${i < pwStrength.bars ? ` ${pwStrength.cls}` : ""}`} />
                        ))}
                      </div>
                      <div className="pw-lbl">{pwStrength.label}</div>
                    </>
                  )}
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Memproses...</> : <><i className="fa-solid fa-rocket" /> Buat Akun Gratis</>}
                </button>
                <div className="auth-terms">
                  Dengan mendaftar, kamu setuju dengan <a href="#">Syarat &amp; Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> bannana.id
                </div>
                <div className="auth-switch">Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); }}>Masuk</a></div>
              </>
            )}
          </form>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
