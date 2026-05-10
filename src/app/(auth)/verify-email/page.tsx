"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      setStatus("error");
      setMsg("Link verifikasi tidak valid.");
      return;
    }
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setMsg(json.error?.message ?? "Verifikasi gagal.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMsg("Koneksi gagal. Coba lagi.");
      });
  }, []);

  return (
    <main className="auth-page-bg">
      <div className="auth-wrap">
        <Link href="/" className="auth-logo">
          <span className="bana">🍌</span> bannana
        </Link>
        <div className="auth-glass">
          {status === "loading" && (
            <div className="success-state">
              <div className="success-icon"><i className="fa-solid fa-spinner fa-spin" /></div>
              <div className="card-title">Memverifikasi email…</div>
              <div className="card-sub">Sebentar ya, sedang memproses verifikasi emailmu.</div>
            </div>
          )}
          {status === "success" && (
            <div className="success-state">
              <div className="success-icon"><i className="fa-solid fa-circle-check" /></div>
              <div className="card-title">Email terverifikasi! 🎉</div>
              <div className="card-sub">Emailmu sudah dikonfirmasi. Sekarang kamu bisa menikmati semua fitur bannana.id.</div>
              <Link href="/dashboard" className="btn-submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, textDecoration: "none", marginTop: "1.5rem" }}>
                <i className="fa-solid fa-arrow-right" /> Ke Dashboard
              </Link>
            </div>
          )}
          {status === "error" && (
            <div className="success-state">
              <div className="success-icon" style={{ background: "var(--danger-100)", color: "var(--danger-600)" }}>
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
              <div className="card-title">Verifikasi Gagal</div>
              <div className="card-sub">{msg || "Link verifikasi tidak valid atau sudah kadaluarsa."}</div>
              <Link href="/dashboard" className="btn-submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, textDecoration: "none", marginTop: "1.5rem" }}>
                <i className="fa-solid fa-house" /> Kembali ke Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
