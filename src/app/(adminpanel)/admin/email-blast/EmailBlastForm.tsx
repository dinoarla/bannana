"use client";

import { useState, useEffect } from "react";

type Counts = { all: number; pro: number; free: number };

function getCsrf() {
  return decodeURIComponent(
    document.cookie.split("; ").find((r) => r.startsWith("bid_csrf="))?.split("=")[1] ?? ""
  );
}

const TEMPLATES: Array<{
  id: string;
  label: string;
  icon: string;
  trigger: string;
  tujuan: string;
  segment: "all" | "free" | "pro";
  subject: string;
  body: string;
}> = [
  {
    id: "welcome",
    label: "Welcome",
    icon: "fa-hand-wave",
    trigger: "Setelah register",
    tujuan: "Onboarding, arahkan buat halaman pertama",
    segment: "all",
    subject: "Selamat datang di bannana.id! 🍌",
    body: `Halo!

Selamat datang di bannana.id — platform link-in-bio terbaik untuk konten kreator Indonesia.

Dengan bannana.id, kamu bisa:
• Buat halaman link-in-bio profesional dalam hitungan menit
• Lacak berapa klik dan pengunjung setiap harinya
• Ganti tampilan dengan tema-tema kece

Yuk mulai buat halaman pertamamu sekarang: https://bannana.id/pages

Salam,
Tim bannana.id`,
  },
  {
    id: "aktivasi",
    label: "Aktivasi halaman",
    icon: "fa-flag-checkered",
    trigger: "User buat halaman pertama",
    tujuan: "Dorong publish",
    segment: "all",
    subject: "Halaman bannana.id kamu hampir siap — yuk publish! 🚀",
    body: `Halo!

Mantap banget, kamu sudah mulai membuat halamanmu di bannana.id!

Satu langkah lagi: publish halamanmu agar bisa dibagikan ke semua orang.

Setelah publish, kamu bisa:
• Share link halaman ke Instagram, TikTok, atau YouTube bio
• Pantau berapa banyak orang yang klik link-mu
• Terus tambah dan atur linkmu kapan saja

Selesaikan dan publish sekarang: https://bannana.id/pages

Salam,
Tim bannana.id`,
  },
  {
    id: "tips",
    label: "Tips mingguan",
    icon: "fa-lightbulb",
    trigger: "Setiap Senin, manual blast",
    tujuan: "Engagement, edukasi fitur",
    segment: "all",
    subject: "Tips bannana.id minggu ini 💡",
    body: `Halo!

Ini tips minggu ini dari tim bannana.id:

✅ [Tips 1: Contoh — Tambahkan foto profil yang jelas agar pengunjung lebih percaya]
✅ [Tips 2: Contoh — Urutkan link paling penting di posisi paling atas]
✅ [Tips 3: Contoh — Pantau analytics setiap minggu untuk tahu mana link yang paling banyak diklik]

Punya pertanyaan? Balas email ini saja.

Salam,
Tim bannana.id`,
  },
  {
    id: "upgrade",
    label: "Upgrade nudge",
    icon: "fa-crown",
    trigger: "Free user > 7 hari, belum Pro",
    tujuan: "Konversi",
    segment: "free",
    subject: "Unlock semua fitur Pro bannana.id 👑",
    body: `Halo!

Kamu sudah seminggu lebih pakai bannana.id — tapi masih di versi Gratis.

Dengan bannana.id Pro, kamu bisa:
• Tambah link tanpa batas
• Analytics lebih detail (klik per link, asal pengunjung)
• Tema premium eksklusif

Harga mulai Rp 15.000/bulan — lebih murah dari secangkir kopi.

Coba Pro sekarang: https://bannana.id/langganan

Salam,
Tim bannana.id`,
  },
  {
    id: "fitur-baru",
    label: "Fitur baru",
    icon: "fa-rocket",
    trigger: "Setiap ada update",
    tujuan: "Retensi, eksitasi",
    segment: "all",
    subject: "Fitur baru bannana.id sudah hadir! 🚀",
    body: `Halo!

Kami baru saja meluncurkan fitur baru yang sudah kamu tunggu-tunggu:

🆕 [Nama Fitur] — [Deskripsi singkat manfaatnya buat pengguna]

Cara pakainya:
1. Buka dashboard bannana.id
2. [Langkah 2]
3. [Langkah 3]

Coba sekarang: https://bannana.id/dashboard

Feedback atau pertanyaan? Balas email ini.

Salam,
Tim bannana.id`,
  },
  {
    id: "reengagement",
    label: "Re-engagement",
    icon: "fa-heart",
    trigger: "User tidak login > 30 hari",
    tujuan: "Churn prevention",
    segment: "all",
    subject: "Kamu sudah lama tidak mampir ke bannana.id 👀",
    body: `Halo!

Kami kangen kamu di bannana.id!

Sudah lama tidak update halaman linkmu? Ini saat yang tepat untuk:
• Tambah link terbaru (konten, produk, atau promo)
• Cek analytics — siapa yang mengunjungi halamanmu
• Update foto dan bio profil

Halaman aktif cenderung mendapat lebih banyak klik, lho!

Buka halamanmu: https://bannana.id/dashboard

Salam,
Tim bannana.id`,
  },
];

export function EmailBlastForm() {
  const [segment, setSegment] = useState<"all" | "free" | "pro">("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
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

      {/* Template library */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setTemplateOpen((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: ".5rem",
            background: "none", border: "1.5px solid var(--n-200)", borderRadius: "var(--r-xl)",
            padding: "8px 16px", cursor: "pointer", fontSize: ".8rem", fontWeight: 700,
            color: templateOpen ? "var(--b-700)" : "var(--n-600)",
            borderColor: templateOpen ? "var(--b-300)" : "var(--n-200)",
          }}
        >
          <i className="fa-solid fa-layer-group" />
          Pakai Template
          <i className={`fa-solid fa-chevron-${templateOpen ? "up" : "down"}`} style={{ fontSize: ".65rem", marginLeft: ".25rem" }} />
        </button>

        {templateOpen && (
          <div style={{ marginTop: ".75rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: ".6rem" }}>
            {TEMPLATES.map((t) => {
              const active = activeTemplate === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSubject(t.subject);
                    setBody(t.body);
                    setSegment(t.segment);
                    setActiveTemplate(t.id);
                    setTemplateOpen(false);
                  }}
                  style={{
                    textAlign: "left", padding: "12px 14px", cursor: "pointer",
                    border: `2px solid ${active ? "var(--b-400)" : "var(--n-200)"}`,
                    borderRadius: "var(--r-xl)",
                    background: active ? "var(--b-50)" : "#fff",
                    transition: "border-color .15s, background .15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: ".45rem", marginBottom: ".5rem" }}>
                    <i className={`fa-solid ${t.icon}`} style={{ color: active ? "var(--b-500)" : "var(--n-400)", fontSize: ".8rem", width: 14 }} />
                    <span style={{ fontWeight: 700, fontSize: ".83rem", color: active ? "var(--b-700)" : "var(--n-800)" }}>{t.label}</span>
                    <span style={{
                      marginLeft: "auto", fontSize: ".63rem", fontWeight: 700, padding: "2px 7px", borderRadius: 5, flexShrink: 0,
                      background: t.segment === "pro" ? "var(--b-100)" : t.segment === "free" ? "var(--n-150)" : "var(--n-100)",
                      color: t.segment === "pro" ? "var(--b-700)" : "var(--n-500)",
                    }}>
                      {t.segment === "all" ? "Semua" : t.segment === "pro" ? "Pro" : "Gratis"}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
                    <div style={{ fontSize: ".7rem", color: "var(--n-500)", display: "flex", gap: ".35rem" }}>
                      <span style={{ color: "var(--n-400)", fontWeight: 600, minWidth: 42, flexShrink: 0 }}>Trigger</span>
                      <span>{t.trigger}</span>
                    </div>
                    <div style={{ fontSize: ".7rem", color: "var(--n-500)", display: "flex", gap: ".35rem" }}>
                      <span style={{ color: "var(--n-400)", fontWeight: 600, minWidth: 42, flexShrink: 0 }}>Tujuan</span>
                      <span>{t.tujuan}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
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
