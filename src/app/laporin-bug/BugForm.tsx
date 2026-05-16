"use client";

import { useState } from "react";

interface FormData {
  nama: string;
  email: string;
  ringkasan: string;
  platform: string;
  langkah: string;
  expected: string;
  actual: string;
}

const empty: FormData = {
  nama: "", email: "", ringkasan: "", platform: "web", langkah: "", expected: "", actual: "",
};

export function BugForm() {
  const [form, setForm] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[Laporin Bug] ${form.ringkasan}`);
    const body = encodeURIComponent(
      `Nama: ${form.nama}\nEmail: ${form.email}\nPlatform: ${form.platform}\n\nRingkasan Bug:\n${form.ringkasan}\n\nLangkah Reproduksi:\n${form.langkah}\n\nYang Diharapkan:\n${form.expected}\n\nYang Terjadi:\n${form.actual}`
    );
    window.open(`mailto:halo@bannana.id?subject=${subject}&body=${body}`);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ width: 64, height: 64, background: "var(--b-100)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <i className="fa-solid fa-check" style={{ fontSize: "1.5rem", color: "var(--b-600)" }} />
        </div>
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", fontWeight: 700, color: "var(--b-900)", marginBottom: ".5rem" }}>
          Laporan Terkirim!
        </h2>
        <p style={{ color: "var(--n-500)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 380, margin: "0 auto 1.5rem" }}>
          Email klienmu sudah terbuka dengan detail bug. Kirim email tersebut ke{" "}
          <strong style={{ color: "var(--b-800)" }}>halo@bannana.id</strong> dan tim kami akan merespons dalam 1–3 hari kerja.
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => { setForm(empty); setSubmitted(false); }}>
          <i className="fa-solid fa-rotate-left" /> Laporin Bug Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row" style={{ marginBottom: ".875rem" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="bug-nama">Nama</label>
          <input
            id="bug-nama" name="nama" className="input"
            placeholder="Nama kamu"
            value={form.nama} onChange={handleChange} required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bug-email">Email</label>
          <input
            id="bug-email" name="email" type="email" className="input"
            placeholder="email@contoh.com"
            value={form.email} onChange={handleChange} required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="bug-ringkasan">Ringkasan Bug</label>
        <input
          id="bug-ringkasan" name="ringkasan" className="input"
          placeholder="Deskripsikan bug secara singkat..."
          value={form.ringkasan} onChange={handleChange} required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="bug-platform">Platform</label>
        <select id="bug-platform" name="platform" className="input" value={form.platform} onChange={handleChange}>
          <option value="web">Web (desktop / laptop)</option>
          <option value="mobile-web">Mobile Web (browser HP)</option>
          <option value="ios">iOS (Safari / Chrome)</option>
          <option value="android">Android (Chrome)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="bug-langkah">Langkah Reproduksi</label>
        <textarea
          id="bug-langkah" name="langkah" className="input textarea"
          style={{ minHeight: 100 }}
          placeholder={"1. Buka halaman...\n2. Klik tombol...\n3. Bug terjadi..."}
          value={form.langkah} onChange={handleChange} required
        />
      </div>

      <div className="form-row" style={{ marginBottom: ".875rem" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="bug-expected">Yang Diharapkan</label>
          <textarea
            id="bug-expected" name="expected" className="input textarea"
            placeholder="Seharusnya terjadi apa..."
            value={form.expected} onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bug-actual">Yang Terjadi</label>
          <textarea
            id="bug-actual" name="actual" className="input textarea"
            placeholder="Tapi yang terjadi adalah..."
            value={form.actual} onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        <i className="fa-solid fa-paper-plane" /> Kirim Laporan Bug
      </button>
    </form>
  );
}
