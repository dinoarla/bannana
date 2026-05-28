"use client";

import { useState } from "react";

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

const TEMPLATE_OPTIONS = [
  { value: "payment_success", label: "Konfirmasi Pembayaran Pro" },
  { value: "verification", label: "Verifikasi Email" },
  { value: "password_reset", label: "Reset Password" },
];

export function EmailTestButton() {
  const [to, setTo] = useState("");
  const [template, setTemplate] = useState("payment_success");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function send() {
    if (!to.trim()) return;
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "X-CSRF-Token": getCsrf(), "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim(), template }),
      });
      const json = await res.json();
      if (!json.success) {
        setStatus("error");
        setMsg(json.error?.message ?? "Gagal kirim.");
      } else {
        setStatus("ok");
        setMsg(`Test email (${template}) terkirim ke ${to.trim()}`);
      }
    } catch {
      setStatus("error");
      setMsg("Koneksi gagal.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <input
        className="input"
        type="email"
        placeholder="email@contoh.com"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ fontSize: ".85rem" }}
      />
      <select
        className="input"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        style={{ fontSize: ".85rem" }}
      >
        {TEMPLATE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={send}
        disabled={status === "loading" || !to.trim()}
        className="btn"
        style={{ fontSize: ".8rem", padding: "7px 14px", border: "1.5px solid var(--n-300)", background: "#fff", color: "var(--n-700)", fontWeight: 700, cursor: "pointer", borderRadius: 8 }}
      >
        {status === "loading" ? <><i className="fa-solid fa-spinner fa-spin" /> Mengirim…</> : <><i className="fa-solid fa-paper-plane" /> Kirim Test</>}
      </button>
      {status === "ok" && (
        <div style={{ fontSize: ".78rem", color: "#059669", display: "flex", alignItems: "center", gap: ".35rem" }}>
          <i className="fa-solid fa-check" /> {msg}
        </div>
      )}
      {status === "error" && (
        <div style={{ fontSize: ".78rem", color: "#DC2626", display: "flex", alignItems: "center", gap: ".35rem" }}>
          <i className="fa-solid fa-circle-exclamation" /> {msg}
        </div>
      )}
    </div>
  );
}
