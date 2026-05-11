"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = (userId: string) => `bannana_onboarded_${userId}`;

const steps = [
  {
    icon: "🍌",
    title: "Selamat datang di bannana!",
    desc: "bannana.id adalah link-in-bio kamu — satu halaman yang berisi semua link penting. Yuk, pelajari cara pakainya dalam 3 langkah cepat!",
    tip: null,
  },
  {
    icon: "✏️",
    title: "Lengkapi profil kamu",
    desc: "Tambahkan foto, nama tampilan, dan bio supaya followers langsung kenal kamu. Buka menu Pengaturan untuk edit profil.",
    tip: "Buka Settings → ubah Nama, Bio, dan upload Foto Profil",
  },
  {
    icon: "🔗",
    title: "Tambah link ke halamanmu",
    desc: "Buka Halaman Saya → klik edit → tambah blok Link, Social, Header, atau Embed. Kamu bisa drag-and-drop untuk mengubah urutan!",
    tip: "Ada 6 jenis blok: Link, Header, Social, Embed, Gambar, dan Divider",
  },
  {
    icon: "🚀",
    title: "Share ke semua platform!",
    desc: "Halamanmu sudah live dan bisa langsung dibuka. Copy link di bawah, taruh di bio Instagram, TikTok, Twitter — dan mulai dapat kunjungan!",
    tip: null,
  },
];

export function OnboardingModal({ userId, username }: { userId: string; username: string }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY(userId))) {
      setVisible(true);
    }
  }, [userId]);

  function finish() {
    localStorage.setItem(STORAGE_KEY(userId), "1");
    setVisible(false);
  }

  if (!visible) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 9998,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      backdropFilter: "blur(2px)",
    }}>
      <div className="card" style={{ maxWidth: 440, width: "100%", padding: "2rem", position: "relative", overflow: "hidden" }}>
        {/* Progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--n-100)" }}>
          <div style={{
            height: "100%", background: "var(--b-500)",
            width: `${((step + 1) / steps.length) * 100}%`,
            transition: "width .3s ease",
            borderRadius: "0 2px 2px 0",
          }} />
        </div>

        {/* Step counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", marginTop: ".5rem" }}>
          <span style={{ fontSize: ".78rem", color: "var(--n-400)", fontWeight: 600 }}>
            Langkah {step + 1} dari {steps.length}
          </span>
          <button onClick={finish} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--n-400)", fontSize: ".85rem" }}>
            Lewati <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Content */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: 1 }}>{current.icon}</div>
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, color: "var(--b-900)", marginBottom: ".75rem" }}>
            {current.title}
          </div>
          <div style={{ fontSize: ".9rem", color: "var(--n-600)", lineHeight: 1.6 }}>
            {current.desc}
          </div>
          {current.tip && (
            <div style={{
              marginTop: "1rem", background: "var(--b-50)", border: "1px solid var(--b-200)",
              borderRadius: 10, padding: ".75rem 1rem", fontSize: ".82rem", color: "var(--b-700)", textAlign: "left"
            }}>
              <i className="fa-solid fa-lightbulb" style={{ marginRight: ".4rem", color: "var(--b-500)" }} />
              {current.tip}
            </div>
          )}
          {isLast && (
            <div style={{
              marginTop: "1rem", background: "var(--n-50)", border: "1px solid var(--n-200)",
              borderRadius: 10, padding: ".75rem 1rem", fontSize: ".85rem",
              display: "flex", alignItems: "center", gap: ".5rem", justifyContent: "center"
            }}>
              <i className="fa-solid fa-link" style={{ color: "var(--b-500)" }} />
              <span style={{ fontWeight: 600, color: "var(--b-700)" }}>bannana.id/{username}</span>
              <button
                onClick={() => navigator.clipboard.writeText(`https://bannana.id/${username}`)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--b-500)", fontSize: ".85rem", padding: "2px 6px" }}
                title="Salin link"
              >
                <i className="fa-solid fa-copy" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: ".75rem" }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>
              <i className="fa-solid fa-arrow-left" /> Kembali
            </button>
          )}
          {isLast ? (
            <button onClick={finish} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              Mulai sekarang! 🎉
            </button>
          ) : (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              Lanjut <i className="fa-solid fa-arrow-right" />
            </button>
          )}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: ".4rem", marginTop: "1.25rem" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8, height: 8, borderRadius: 99,
              background: i === step ? "var(--b-500)" : "var(--n-200)",
              transition: "all .25s ease", cursor: "pointer",
            }} onClick={() => setStep(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
