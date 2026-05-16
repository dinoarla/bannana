"use client";

import { useState } from "react";

interface FormData {
  nama: string;
  email: string;
  judul: string;
  kategori: string;
  deskripsi: string;
  alasan: string;
}

const empty: FormData = {
  nama: "", email: "", judul: "", kategori: "ui-ux", deskripsi: "", alasan: "",
};

export function FeatureForm() {
  const [form, setForm] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[Request Fitur] ${form.judul}`);
    const body = encodeURIComponent(
      `Nama: ${form.nama}\nEmail: ${form.email}\nKategori: ${form.kategori}\n\nJudul Fitur:\n${form.judul}\n\nDeskripsi:\n${form.deskripsi}\n\nKenapa fitur ini penting:\n${form.alasan}`
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
          Request Terkirim!
        </h2>
        <p style={{ color: "var(--n-500)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 380, margin: "0 auto 1.5rem" }}>
          Email klienmu sudah terbuka dengan detail fitur yang kamu request. Kirim email tersebut ke{" "}
          <strong style={{ color: "var(--b-800)" }}>halo@bannana.id</strong> — kami baca setiap masukan!
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => { setForm(empty); setSubmitted(false); }}>
          <i className="fa-solid fa-rotate-left" /> Request Fitur Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row" style={{ marginBottom: ".875rem" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="ft-nama">Nama</label>
          <input
            id="ft-nama" name="nama" className="input"
            placeholder="Nama kamu"
            value={form.nama} onChange={handleChange} required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ft-email">Email</label>
          <input
            id="ft-email" name="email" type="email" className="input"
            placeholder="email@contoh.com"
            value={form.email} onChange={handleChange} required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="ft-judul">Judul Fitur</label>
        <input
          id="ft-judul" name="judul" className="input"
          placeholder="Nama fitur yang kamu usulkan..."
          value={form.judul} onChange={handleChange} required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="ft-kategori">Kategori</label>
        <select id="ft-kategori" name="kategori" className="input" value={form.kategori} onChange={handleChange}>
          <option value="ui-ux">UI / UX</option>
          <option value="blok-baru">Blok Baru</option>
          <option value="integrasi">Integrasi (platform lain)</option>
          <option value="analytics">Analytics</option>
          <option value="monetisasi">Monetisasi</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="ft-deskripsi">Deskripsi Fitur</label>
        <textarea
          id="ft-deskripsi" name="deskripsi" className="input textarea"
          style={{ minHeight: 110 }}
          placeholder="Jelaskan fitur yang kamu inginkan secara detail. Bagaimana cara kerjanya? Seperti apa tampilannya?"
          value={form.deskripsi} onChange={handleChange} required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="ft-alasan">Kenapa Fitur Ini Penting?</label>
        <textarea
          id="ft-alasan" name="alasan" className="input textarea"
          style={{ minHeight: 90 }}
          placeholder="Masalah apa yang fitur ini selesaikan? Siapa yang paling butuh fitur ini?"
          value={form.alasan} onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn-submit">
        <i className="fa-solid fa-paper-plane" /> Kirim Request Fitur
      </button>
    </form>
  );
}
