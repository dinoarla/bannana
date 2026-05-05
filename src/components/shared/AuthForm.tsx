"use client";

import { useState } from "react";
import Link from "next/link";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message ?? "Terjadi kesalahan.");
        return;
      }
      location.href = "/dashboard";
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <form onSubmit={submit} className="auth-card" style={{ width: "100%", maxWidth: 440 }}>
      <h1 className="page-title" style={{ marginBottom: ".25rem" }}>
        {isLogin ? "Selamat datang! 👋" : "Buat akun bannana.id 🍌"}
      </h1>
      <p className="muted" style={{ marginBottom: "1.5rem", fontSize: ".875rem" }}>
        {isLogin ? "Masuk ke dashboard bannana.id kamu." : "Gratis selamanya. Setup 2 menit."}
      </p>

      {mode === "register" && (
        <div className="form-group">
          <label className="form-label">Username</label>
          <input name="username" className="input" placeholder="contoh: rina_kreasi" required pattern="[a-zA-Z0-9_\-]+" minLength={3} maxLength={32} />
          <span className="form-hint">Huruf, angka, underscore, strip. Ini jadi URL kamu: bannana.id/username</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Email</label>
        <input name="email" type="email" className="input" placeholder="halo@bannana.id" required />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input name="password" type="password" className="input" placeholder="Min. 8 karakter" required minLength={8} />
      </div>

      {mode === "register" && (
        <div className="form-group">
          <label className="form-label">Konfirmasi Password</label>
          <input name="confirmPassword" type="password" className="input" placeholder="Ulangi password" required minLength={8} />
        </div>
      )}

      {error && (
        <div className="badge badge-danger" style={{ width: "100%", justifyContent: "flex-start", marginBottom: "1rem", padding: ".75rem 1rem", borderRadius: "10px" }}>
          ⚠️ {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
        {loading ? "Memproses…" : isLogin ? "Masuk →" : "Buat Akun →"}
      </button>

      {isLogin && (
        <div style={{ textAlign: "right", marginTop: ".75rem" }}>
          <Link href="/forgot-password" style={{ fontSize: ".8rem", color: "var(--b-600)", fontWeight: 600 }}>Lupa password?</Link>
        </div>
      )}

      <div className="auth-divider"><span>atau</span></div>

      <div style={{ marginBottom: ".5rem", fontSize: ".75rem", color: "var(--n-400)", textAlign: "center" }}>
        Demo: <strong style={{ color: "var(--b-700)" }}>halo@bannana.id</strong> / <strong style={{ color: "var(--b-700)" }}>Bannana@2025</strong>
      </div>
    </form>
  );
}
