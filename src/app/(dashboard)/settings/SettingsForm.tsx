"use client";

import { useState, useRef } from "react";

type Props = { csrfToken: string; username: string; email: string; displayName: string; bio: string; avatarUrl: string; website: string };

export function SettingsForm({ csrfToken, username, email, displayName, bio, avatarUrl, website }: Props) {
  const [section, setSection] = useState("profil");

  function csrf(): HeadersInit {
    return { "Content-Type": "application/json", "X-CSRF-Token": csrfToken };
  }

  return (
    <div className="settings-layout">
      {/* SIDE NAV */}
      <div className="set-nav">
        {[
          { id: "profil", ico: "fa-solid fa-user", label: "Profil" },
          { id: "akun", ico: "fa-solid fa-shield-halved", label: "Akun & Keamanan" },
          { id: "notif", ico: "fa-solid fa-bell", label: "Notifikasi" },
          { id: "langganan", ico: "fa-solid fa-crown", label: "Langganan" },
          { id: "integrasi", ico: "fa-solid fa-plug", label: "Integrasi" },
          { id: "bahaya", ico: "fa-solid fa-triangle-exclamation", label: "Danger Zone", danger: true },
        ].map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); setSection(item.id); }}
            className={`set-nav-item${section === item.id ? " active" : ""}`}
            style={item.danger && section !== item.id ? { color: "var(--danger-600)" } : undefined}
          >
            <i className={item.ico} /> {item.label}
          </a>
        ))}
      </div>

      {/* PANELS */}
      <div className="set-panel">
        {section === "profil" && <ProfilPanel csrfToken={csrfToken} username={username} displayName={displayName} bio={bio} avatarUrl={avatarUrl} website={website} />}
        {section === "akun" && <AkunPanel csrf={csrf()} email={email} />}
        {section === "notif" && <NotifPanel />}
        {section === "langganan" && <LanggananPanel />}
        {section === "integrasi" && <IntegrasiPanel />}
        {section === "bahaya" && <BahayaPanel />}
      </div>
    </div>
  );
}

const BIO_MAX = 160;

function ProfilPanel({ csrfToken, username, displayName, bio, avatarUrl: initialAvatarUrl, website: initialWebsite }: {
  csrfToken: string; username: string; displayName: string; bio: string; avatarUrl: string; website: string;
}) {
  const nameParts = displayName.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" "));
  const [usernameVal, setUsernameVal] = useState(username);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [bioVal, setBioVal] = useState(bio);
  const [websiteVal, setWebsiteVal] = useState(initialWebsite);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleUsernameChange(val: string) {
    setUsernameVal(val);
    setUsernameStatus("idle");
    if (val === username || val.length < 3) return;
    if (checkTimer.current) clearTimeout(checkTimer.current);
    setUsernameStatus("checking");
    checkTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/settings/check-username?u=${encodeURIComponent(val)}`);
        const json = await res.json();
        setUsernameStatus(json.data?.available ? "available" : "taken");
      } catch { setUsernameStatus("idle"); }
    }, 500);
  }

  function openFilePicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    // Must append to DOM for Safari compatibility
    input.style.display = "none";
    document.body.appendChild(input);
    input.onchange = async () => {
      document.body.removeChild(input);
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 5_000_000) {
        setErr("Ukuran file terlalu besar. Maksimal 5MB.");
        setTimeout(() => setErr(""), 4000);
        return;
      }
      setUploadingAvatar(true);
      setErr("");
      try {
        const dataUrl = await resizeToDataUrl(file, 400, 400);
        // Client-side size guard before hitting the API
        const base64 = dataUrl.split(",")[1] ?? "";
        const compressedBytes = Math.ceil((base64.length * 3) / 4);
        if (compressedBytes > 300_000) {
          setErr("Foto terlalu besar setelah dikompres (maks. 300KB). Gunakan foto dengan resolusi lebih rendah.");
          setTimeout(() => setErr(""), 5000);
          return;
        }
        const res = await fetch("/api/settings/avatar", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
          body: JSON.stringify({ dataUrl }),
        });
        const json = await res.json();
        if (!json.success) {
          setErr(json.error?.message ?? "Gagal upload foto.");
          setTimeout(() => setErr(""), 4000);
          return;
        }
        setAvatarUrl(json.data.avatarUrl);
        setMsg("Foto profil diperbarui!");
        setTimeout(() => setMsg(""), 3000);
      } catch {
        setErr("Terjadi kesalahan saat memproses foto. Coba lagi.");
        setTimeout(() => setErr(""), 4000);
      } finally {
        setUploadingAvatar(false);
      }
    };
    input.click();
  }

  async function deleteAvatar() {
    if (!avatarUrl) return;
    setUploadingAvatar(true);
    try {
      const res = await fetch("/api/settings/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify({ dataUrl: null }),
      });
      const json = await res.json();
      if (json.success) { setAvatarUrl(""); setMsg("Foto dihapus."); setTimeout(() => setMsg(""), 2500); }
    } finally { setUploadingAvatar(false); }
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (usernameStatus === "taken") {
      setErr("Username sudah dipakai, pilih yang lain.");
      setTimeout(() => setErr(""), 4000);
      return;
    }
    setSaving(true);
    setErr("");
    const combined = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify({
          displayName: combined || undefined,
          bio: bioVal,
          username: usernameVal !== username ? usernameVal : undefined,
          website: websiteVal || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) { setErr(json.error?.message ?? "Gagal menyimpan."); setTimeout(() => setErr(""), 4000); return; }
      setMsg("Profil tersimpan!"); setTimeout(() => setMsg(""), 3000);
    } catch {
      setErr("Gagal terhubung ke server. Coba lagi.");
      setTimeout(() => setErr(""), 4000);
    } finally { setSaving(false); }
  }

  const usernameHintContent = () => {
    if (usernameStatus === "checking") return <span style={{ color: "var(--n-400)" }}><i className="fa-solid fa-spinner fa-spin" /> Mengecek ketersediaan...</span>;
    if (usernameStatus === "taken") return <span style={{ color: "#DC2626" }}><i className="fa-solid fa-xmark" /> Username sudah dipakai</span>;
    if (usernameStatus === "available") return <span style={{ color: "#059669" }}><i className="fa-solid fa-check" /> Username tersedia</span>;
    return <><i className="fa-solid fa-globe" /> bannana.id/<strong>{usernameVal || "..."}</strong> — <a href={`/${usernameVal}`} target="_blank">lihat halaman publik</a></>;
  };

  return (
    <div className="set-card">
      <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-user" /> Informasi Profil</div></div>
      <div className="set-card-body">
        <form onSubmit={save} id="profil-form">
          {/* Avatar */}
          <div className="avatar-section">
            <div className="avatar-big" style={{ overflow: "hidden", padding: 0 }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <i className="fa-solid fa-user" />}
            </div>
            <div className="avatar-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={openFilePicker} disabled={uploadingAvatar}>
                {uploadingAvatar ? <><i className="fa-solid fa-spinner fa-spin" /> Mengupload…</> : <><i className="fa-solid fa-upload" /> Upload Foto</>}
              </button>
              {avatarUrl && (
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: "var(--danger-600)", borderColor: "#FECDD3" }} onClick={deleteAvatar} disabled={uploadingAvatar}>
                  <i className="fa-solid fa-trash" /> Hapus Foto
                </button>
              )}
              <span>Format: JPG, PNG, WebP. Maks. 5MB.</span>
            </div>
          </div>

          {/* Nama Depan + Belakang */}
          <div className="field-row">
            <div>
              <label className="form-lbl">Nama Depan</label>
              <input className="form-inp" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="form-lbl">Nama Belakang</label>
              <input className="form-inp" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          {/* Username */}
          <div className="field-full">
            <label className="form-lbl">Username</label>
            <input
              className="form-inp"
              type="text"
              value={usernameVal}
              onChange={(e) => handleUsernameChange(e.target.value)}
              style={usernameStatus === "taken" ? { borderColor: "#DC2626" } : usernameStatus === "available" ? { borderColor: "#059669" } : undefined}
            />
            <div className="form-hint">{usernameHintContent()}</div>
          </div>

          {/* Bio */}
          <div className="field-full">
            <label className="form-lbl" style={{ display: "flex", justifyContent: "space-between" }}>
              Bio Singkat
              <span style={{ fontWeight: 400, color: bioVal.length > BIO_MAX ? "#DC2626" : "var(--n-400)" }}>
                {bioVal.length}/{BIO_MAX}
              </span>
            </label>
            <textarea
              className="form-inp form-ta"
              value={bioVal}
              onChange={(e) => { if (e.target.value.length <= BIO_MAX) setBioVal(e.target.value); }}
              maxLength={BIO_MAX}
            />
            <div className="form-hint">Tampil di halaman profil publik kamu. Maks. {BIO_MAX} karakter.</div>
          </div>

          {/* Website */}
          <div className="field-full" style={{ marginBottom: 0 }}>
            <label className="form-lbl">Website / URL Utama</label>
            <input
              className="form-inp"
              type="url"
              placeholder="https://..."
              value={websiteVal}
              onChange={(e) => setWebsiteVal(e.target.value)}
            />
          </div>

          {err && <div style={{ background: "var(--danger-100)", border: "1.5px solid #FECDD3", borderRadius: 10, padding: ".75rem 1rem", fontSize: ".84rem", color: "var(--danger-700)", marginTop: "1rem" }}><i className="fa-solid fa-triangle-exclamation" /> {err}</div>}
          {msg && <div style={{ background: "#D1FAE5", border: "1.5px solid #6EE7B7", borderRadius: 10, padding: ".75rem 1rem", fontSize: ".84rem", color: "#065F46", marginTop: "1rem" }}><i className="fa-solid fa-check" /> {msg}</div>}
        </form>
      </div>
      <div className="set-footer">
        <span>Perubahan akan langsung tampil di halaman publikmu.</span>
        <button type="submit" form="profil-form" className="btn btn-primary btn-sm" disabled={saving || usernameStatus === "taken"}>
          <i className="fa-solid fa-check" /> {saving ? "Menyimpan…" : "Simpan Profil"}
        </button>
      </div>
    </div>
  );
}

function AkunPanel({ csrf, email }: { csrf: HeadersInit; email: string }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const np = fd.get("newPassword") as string;
    const cp = fd.get("confirmPassword") as string;
    if (np !== cp) { setErr("Password baru tidak cocok."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/password", { method: "PUT", headers: csrf as RequestInit["headers"], body: JSON.stringify({ currentPassword: fd.get("currentPassword"), newPassword: np }) });
      const json = await res.json();
      if (!json.success) { setErr(json.error?.message ?? "Gagal."); return; }
      setMsg("Password berhasil diganti ✓"); (e.target as HTMLFormElement).reset();
    } finally { setSaving(false); setTimeout(() => { setMsg(""); setErr(""); }, 3500); }
  }

  return (
    <>
      <div className="set-card">
        <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-envelope" /> Email &amp; Password</div></div>
        <div className="set-card-body">
          <div className="field-full">
            <label className="form-lbl">Alamat Email</label>
            <input className="form-inp" type="email" defaultValue={email} readOnly />
            <div className="form-hint"><i className="fa-solid fa-circle-check" style={{ color: "var(--success-600)" }} /> Email sudah terverifikasi</div>
          </div>
          <div className="field-full" style={{ borderTop: "1px solid var(--n-100)", paddingTop: "1rem", marginTop: ".25rem", marginBottom: 0 }}>
            <div style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--b-900)", marginBottom: "1rem" }}>Ganti Password</div>
            <form onSubmit={changePassword} id="pw-form">
              <label className="form-lbl">Password Saat Ini</label>
              <input className="form-inp" name="currentPassword" type="password" placeholder="••••••••" style={{ marginBottom: ".875rem" }} required />
              <label className="form-lbl">Password Baru</label>
              <input className="form-inp" name="newPassword" type="password" placeholder="Min. 8 karakter" style={{ marginBottom: ".875rem" }} required minLength={8} />
              <label className="form-lbl">Konfirmasi Password Baru</label>
              <input className="form-inp" name="confirmPassword" type="password" placeholder="Ulangi password baru" required minLength={8} />
              {err && <div style={{ background: "var(--danger-100)", borderRadius: 8, padding: ".5rem .875rem", fontSize: ".84rem", color: "var(--danger-700)", marginTop: ".875rem" }}>{err}</div>}
              {msg && <div style={{ background: "#D1FAE5", borderRadius: 8, padding: ".5rem .875rem", fontSize: ".84rem", color: "#065F46", marginTop: ".875rem" }}>{msg}</div>}
            </form>
          </div>
        </div>
        <div className="set-footer">
          <span>Kamu akan di-logout dari semua perangkat setelah ganti password.</span>
          <button type="submit" form="pw-form" className="btn btn-primary btn-sm" disabled={saving}><i className="fa-solid fa-check" /> {saving ? "Menyimpan…" : "Simpan Perubahan"}</button>
        </div>
      </div>
      <div className="set-card">
        <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-mobile-screen" /> Sesi Aktif</div></div>
        <div className="set-card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: ".875rem", background: "var(--b-50)", border: "1.5px solid var(--b-200)", borderRadius: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--b-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--b-700)" }}><i className="fa-solid fa-desktop" /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--n-800)" }}>Chrome · Browser saat ini</div><div style={{ fontSize: ".72rem", color: "var(--n-500)" }}>Aktif sekarang</div></div>
              <span style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--success-600)", display: "flex", alignItems: "center", gap: 4 }}><i className="fa-solid fa-circle" style={{ fontSize: ".4rem" }} /> Ini perangkat kamu</span>
            </div>
          </div>
        </div>
        <div className="set-footer"><span /></div>
      </div>
    </>
  );
}

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <div className={`toggle${on ? "" : " off"}`} onClick={() => setOn(!on)} />;
}

function NotifPanel() {
  return (
    <div className="set-card">
      <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-bell" /> Preferensi Notifikasi</div></div>
      <div className="set-card-body">
        {[
          { title: "Notifikasi Email", desc: "Terima ringkasan mingguan performa halamanmu via email.", defaultOn: true },
          { title: "Alert Klik Tinggi", desc: "Dapat notifikasi kalau ada lonjakan kunjungan lebih dari 2x.", defaultOn: true },
          { title: "Update Produk", desc: "Dapat info fitur baru, update sistem, dan promo bannana.id.", defaultOn: false },
          { title: "Tips & Tutorial", desc: "Email berisi tips untuk meningkatkan performa link page kamu.", defaultOn: true },
        ].map((item) => (
          <div key={item.title} className="toggle-setting">
            <div className="ts-left"><div className="ts-title">{item.title}</div><div className="ts-desc">{item.desc}</div></div>
            <Toggle defaultOn={item.defaultOn} />
          </div>
        ))}
      </div>
      <div className="set-footer"><span /><button className="btn btn-primary btn-sm"><i className="fa-solid fa-check" /> Simpan Preferensi</button></div>
    </div>
  );
}

function LanggananPanel() {
  return (
    <div className="set-card">
      <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-crown" /> Paket Langganan</div></div>
      <div className="set-card-body">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div><div style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", fontWeight: 700, color: "var(--b-900)" }}>Pro Plan</div><div style={{ fontSize: ".84rem", color: "var(--n-500)", marginTop: 3 }}>Rp 37.000 / bulan (dibayar tahunan)</div></div>
          <span className="plan-badge"><i className="fa-solid fa-star" /> AKTIF</span>
        </div>
        <div style={{ background: "var(--b-50)", border: "1.5px solid var(--b-200)", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--b-800)", marginBottom: ".625rem" }}><i className="fa-solid fa-circle-info" style={{ marginRight: 5 }} /> Detail Langganan</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", fontSize: ".8rem", color: "var(--n-700)" }}>
            <div><span style={{ color: "var(--n-400)" }}>Periode saat ini</span><br /><strong>1 Jan – 31 Des 2025</strong></div>
            <div><span style={{ color: "var(--n-400)" }}>Renewal berikutnya</span><br /><strong>1 Jan 2026</strong></div>
            <div><span style={{ color: "var(--n-400)" }}>Metode pembayaran</span><br /><strong>GoPay ****1234</strong></div>
            <div><span style={{ color: "var(--n-400)" }}>Total tagihan per tahun</span><br /><strong>Rp 444.000</strong></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button className="btn btn-secondary btn-sm"><i className="fa-solid fa-credit-card" /> Kelola Pembayaran</button>
          <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-file-invoice" /> Riwayat Invoice</button>
          <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }}><i className="fa-solid fa-xmark" /> Cancel Langganan</button>
        </div>
      </div>
    </div>
  );
}

function IntegrasiPanel() {
  return (
    <>
      <div className="set-card">
        <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-plug" /> Akun Terhubung</div></div>
        <div className="set-card-body">
          <div className="connected-row">
            <div className="conn-ico"><i className="fa-brands fa-google" style={{ color: "#EA4335" }} /></div>
            <div><div className="conn-title">Google</div><div className="conn-sub">Belum terhubung</div></div>
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }}><i className="fa-solid fa-plus" /> Hubungkan</button>
          </div>
          <div className="connected-row">
            <div className="conn-ico"><i className="fa-brands fa-github" style={{ color: "var(--n-800)" }} /></div>
            <div><div className="conn-title">GitHub</div><div className="conn-sub">Belum terhubung</div></div>
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }}><i className="fa-solid fa-plus" /> Hubungkan</button>
          </div>
        </div>
      </div>
      <div className="set-card">
        <div className="set-card-head">
          <div className="set-card-title"><i className="fa-solid fa-key" /> API Keys</div>
          <button className="btn btn-primary btn-sm"><i className="fa-solid fa-plus" /> Buat API Key</button>
        </div>
        <div className="set-card-body">
          <div style={{ fontSize: ".84rem", color: "var(--n-600)", marginBottom: "1rem", lineHeight: 1.65 }}>Gunakan API Key untuk mengakses bannana.id API secara programatik. Jaga kerahasiaan API key kamu!</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--n-50)", border: "1.5px solid var(--n-200)", borderRadius: 12, padding: ".875rem" }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--n-800)" }}>My API Key — Read/Write</div><div style={{ fontFamily: "var(--fm)", fontSize: ".75rem", color: "var(--n-500)", marginTop: 2 }}>bna_••••••••••••••••••••Xk3A</div></div>
            <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-eye" /> Tampilkan</button>
            <button className="btn btn-danger btn-sm"><i className="fa-solid fa-trash" /></button>
          </div>
        </div>
      </div>
    </>
  );
}

function resizeToDataUrl(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function BahayaPanel() {
  return (
    <div className={`set-card danger-zone`}>
      <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-triangle-exclamation" /> Danger Zone</div></div>
      <div className="set-card-body">
        <div className="danger-row">
          <div><div className="danger-title">Export Semua Data</div><div className="danger-desc">Download semua data akun, halaman, dan analytics dalam format JSON.</div></div>
          <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-download" /> Export Data</button>
        </div>
        <div className="danger-row">
          <div><div className="danger-title">Nonaktifkan Akun Sementara</div><div className="danger-desc">Semua halaman publikmu akan disembunyikan. Kamu bisa aktifkan lagi kapanpun.</div></div>
          <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-eye-slash" /> Nonaktifkan</button>
        </div>
        <div className="danger-row">
          <div><div className="danger-title">Hapus Akun Permanen</div><div className="danger-desc">Akun dan semua data akan dihapus selamanya. Tindakan ini tidak bisa dibatalkan!</div></div>
          <button className="btn btn-danger btn-sm" onClick={() => alert("Fitur hapus akun akan segera hadir.")}><i className="fa-solid fa-trash" /> Hapus Akun</button>
        </div>
      </div>
    </div>
  );
}
