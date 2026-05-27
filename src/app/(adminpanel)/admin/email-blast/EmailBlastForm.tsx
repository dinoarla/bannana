"use client";

import { useState, useEffect } from "react";

type Counts = { all: number; pro: number; free: number };

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

export function EmailBlastForm() {
  const [segment, setSegment] = useState<"all" | "free" | "pro">("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [counts, setCounts] = useState<Counts | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/email-blast")
      .then((r) => r.json())
      .then((j) => { if (j.success) setCounts(j.data); })
      .catch(() => {});
  }, []);

  const recipientCount = counts ? counts[segment] : null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setError("Subject dan isi pesan wajib diisi.");
      return;
    }
    if (!confirm(`Kirim email ke ${recipientCount ?? "semua"} penerima (${segment === "all" ? "semua pengguna" : segment === "pro" ? "pengguna Pro" : "pengguna Gratis"})?`)) return;

    setSending(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/email-blast", {
        method: "POST",
        headers: { "X-CSRF-Token": getCsrf(), "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim(), segment }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message ?? "Gagal mengirim email.");
        return;
      }
      setResult(json.data);
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setSending(false);
    }
  }

  const segmentOptions = [
    { value: "all", label: "Semua Pengguna", icon: "fa-users", count: counts?.all },
    { value: "pro", label: "Pengguna Pro", icon: "fa-crown", count: counts?.pro },
    { value: "free", label: "Pengguna Gratis", icon: "fa-user", count: counts?.free },
  ] as const;

  return (
    <form onSubmit={handleSend}>
      {/* Segment selector */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: ".8rem", fontWeight: 700, color: "var(--n-600)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".6rem" }}>
          Target Penerima
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".75rem" }}>
          {segmentOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSegment(opt.value)}
              style={{
                padding: "1rem",
                border: `2px solid ${segment === opt.value ? "var(--b-400)" : "var(--n-200)"}`,
                borderRadius: "var(--r-xl)",
                background: segment === opt.value ? "var(--b-50)" : "#fff",
                cursor: "pointer",
                textAlign: "left",
                transition: "all .15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".25rem" }}>
                <i className={`fa-solid ${opt.icon}`} style={{ color: segment === opt.value ? "var(--b-500)" : "var(--n-400)", fontSize: ".85rem" }} />
                <span style={{ fontWeight: 700, fontSize: ".875rem", color: segment === opt.value ? "var(--b-700)" : "var(--b-900)" }}>
                  {opt.label}
                </span>
              </div>
              <div style={{ fontSize: "1.4rem", fontFamily: "var(--fd)", fontWeight: 800, color: segment === opt.value ? "var(--b-600)" : "var(--n-500)" }}>
                {opt.count !== undefined ? opt.count : "—"}
              </div>
              <div style={{ fontSize: ".72rem", color: "var(--n-400)" }}>email</div>
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: ".8rem", fontWeight: 700, color: "var(--n-600)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".4rem" }}>
          Subject Email
        </label>
        <input
          type="text"
          className="input"
          placeholder="Contoh: Fitur baru bannana.id sudah hadir!"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ fontSize: ".9rem" }}
          required
        />
      </div>

      {/* Body */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: ".8rem", fontWeight: 700, color: "var(--n-600)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".4rem" }}>
          Isi Pesan
        </label>
        <textarea
          className="input"
          placeholder={"Halo!\n\nKami baru saja meluncurkan fitur baru yang sudah kamu tunggu-tunggu...\n\nSalam,\nTim bannana.id"}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          style={{ resize: "vertical", fontSize: ".9rem", lineHeight: 1.7, fontFamily: "inherit" }}
          required
        />
        <div style={{ fontSize: ".72rem", color: "var(--n-400)", marginTop: ".3rem" }}>
          Teks biasa. Baris baru akan menjadi &lt;br&gt; di email.
        </div>
      </div>

      {/* Preview + Send */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={sending || !subject.trim() || !body.trim()}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem", padding: "10px 24px" }}
        >
          {sending
            ? <><i className="fa-solid fa-spinner fa-spin" /> Mengirim...</>
            : <><i className="fa-solid fa-paper-plane" /> Kirim Email Blast</>}
        </button>
        {recipientCount !== null && (
          <span style={{ fontSize: ".875rem", color: "var(--n-500)" }}>
            <i className="fa-solid fa-envelope" style={{ marginRight: ".3rem", color: "var(--b-400)" }} />
            {recipientCount} email akan dikirim
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: "1rem", padding: "12px 16px", background: "#FEE2E2", borderRadius: 10, color: "#DC2626", fontSize: ".875rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: "1rem", padding: "16px 20px", background: "#D1FAE5", borderRadius: 10, color: "#065F46" }}>
          <div style={{ fontWeight: 700, marginBottom: ".25rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <i className="fa-solid fa-circle-check" />
            Email blast selesai dikirim
          </div>
          <div style={{ fontSize: ".875rem" }}>
            Berhasil: <strong>{result.sent}</strong> &nbsp;·&nbsp; Gagal: <strong style={{ color: result.failed > 0 ? "#DC2626" : "inherit" }}>{result.failed}</strong> &nbsp;·&nbsp; Total: <strong>{result.total}</strong>
          </div>
        </div>
      )}
    </form>
  );
}
