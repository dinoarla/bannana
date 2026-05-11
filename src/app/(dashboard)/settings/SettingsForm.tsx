"use client";

import { useState, useRef, useEffect } from "react";

type SocialLink = { label: string; url: string; icon: string; color?: string };
type Props = { csrfToken: string; username: string; email: string; displayName: string; bio: string; avatarUrl: string; website: string; socialLinks: SocialLink[]; initialTab?: string };

export function SettingsForm({ csrfToken, username, email, displayName, bio, avatarUrl, website, socialLinks, initialTab }: Props) {
  const VALID_TABS = ["profil", "akun", "notif", "langganan", "integrasi", "bahaya"];
  const [section, setSection] = useState(initialTab && VALID_TABS.includes(initialTab) ? initialTab : "profil");

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
        {section === "profil" && <ProfilPanel csrfToken={csrfToken} username={username} displayName={displayName} bio={bio} avatarUrl={avatarUrl} website={website} socialLinks={socialLinks} />}
        {section === "akun" && <AkunPanel csrf={csrf()} email={email} />}
        {section === "notif" && <NotifPanel csrfToken={csrfToken} />}
        {section === "langganan" && <LanggananPanel csrfToken={csrfToken} />}
        {section === "integrasi" && <IntegrasiPanel csrfToken={csrfToken} />}
        {section === "bahaya" && <BahayaPanel csrfToken={csrfToken} username={username} />}
      </div>
    </div>
  );
}

const BIO_MAX = 160;

const SOCIAL_PLATFORMS = [
  { key: "Instagram", label: "Instagram",  fa: "fa-brands fa-instagram", color: "#E1306C", placeholder: "https://instagram.com/username" },
  { key: "Twitter",   label: "X / Twitter", fa: "fa-brands fa-x-twitter",  color: "#000000", placeholder: "https://x.com/username" },
  { key: "Youtube",   label: "YouTube",     fa: "fa-brands fa-youtube",    color: "#FF0000", placeholder: "https://youtube.com/@channel" },
  { key: "LinkedIn",  label: "LinkedIn",    fa: "fa-brands fa-linkedin",   color: "#0A66C2", placeholder: "https://linkedin.com/in/username" },
  { key: "TikTok",    label: "TikTok",      fa: "fa-brands fa-tiktok",     color: "#000000", placeholder: "https://tiktok.com/@username" },
  { key: "Facebook",  label: "Facebook",    fa: "fa-brands fa-facebook",   color: "#1877F2", placeholder: "https://facebook.com/username" },
] as const;

function ProfilPanel({ csrfToken, username, displayName, bio, avatarUrl: initialAvatarUrl, website: initialWebsite, socialLinks: initialSocialLinks }: {
  csrfToken: string; username: string; displayName: string; bio: string; avatarUrl: string; website: string; socialLinks: SocialLink[];
}) {
  const nameParts = displayName.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" "));
  const [usernameVal, setUsernameVal] = useState(username);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [bioVal, setBioVal] = useState(bio);
  const [websiteVal, setWebsiteVal] = useState(initialWebsite);
  const [socialVals, setSocialVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of SOCIAL_PLATFORMS) init[p.key] = "";
    for (const sl of initialSocialLinks) { if (sl.icon && sl.url) init[sl.icon] = sl.url; }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setWebsiteVal(initialWebsite); }, [initialWebsite]);
  useEffect(() => {
    setSocialVals(() => {
      const init: Record<string, string> = {};
      for (const p of SOCIAL_PLATFORMS) init[p.key] = "";
      for (const sl of initialSocialLinks) { if (sl.icon && sl.url) init[sl.icon] = sl.url; }
      return init;
    });
  }, [initialSocialLinks]);

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
          socialLinks: SOCIAL_PLATFORMS
            .filter((p) => socialVals[p.key]?.trim())
            .map((p) => ({ label: p.label, url: socialVals[p.key].trim(), icon: p.key, color: p.color })),
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
          <div className="field-full">
            <label className="form-lbl">Website / URL Utama</label>
            <input
              className="form-inp"
              type="url"
              placeholder="https://..."
              value={websiteVal}
              onChange={(e) => setWebsiteVal(e.target.value)}
            />
          </div>

          {/* Social Links */}
          <div className="field-full" style={{ marginBottom: 0 }}>
            <label className="form-lbl">Link Social Media</label>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {SOCIAL_PLATFORMS.map((p) => (
                <div key={p.key} style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--n-100)", display: "flex", alignItems: "center", justifyContent: "center", color: p.color, flexShrink: 0 }}>
                    <i className={p.fa} />
                  </div>
                  <input
                    className="form-inp"
                    type="url"
                    placeholder={p.placeholder}
                    value={socialVals[p.key] ?? ""}
                    onChange={(e) => setSocialVals((prev) => ({ ...prev, [p.key]: e.target.value }))}
                    style={{ marginBottom: 0 }}
                  />
                </div>
              ))}
            </div>
            <div className="form-hint">Masukkan URL lengkap. Kosongkan untuk menyembunyikan ikon.</div>
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
  type SessionRow = { id: string; createdAt: string; expiresAt: string; isCurrent: boolean };
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  useEffect(() => {
    fetch("/api/settings/sessions").then((r) => r.json()).then((j) => { if (j.success) setSessions(j.data); }).catch(() => {});
  }, []);

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

  async function revokeSession(id: string) {
    if (!confirm("Akhiri sesi ini?")) return;
    await fetch("/api/settings/sessions", { method: "DELETE", headers: csrf as RequestInit["headers"], body: JSON.stringify({ sessionId: id }) });
    setSessions((prev) => prev.filter((s) => s.id !== id));
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
            {sessions.length === 0 ? (
              <div style={{ fontSize: ".84rem", color: "var(--n-400)" }}>Memuat sesi...</div>
            ) : sessions.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: ".875rem", background: s.isCurrent ? "var(--b-50)" : "var(--n-50)", border: `1.5px solid ${s.isCurrent ? "var(--b-200)" : "var(--n-200)"}`, borderRadius: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: s.isCurrent ? "var(--b-100)" : "var(--n-100)", display: "flex", alignItems: "center", justifyContent: "center", color: s.isCurrent ? "var(--b-700)" : "var(--n-500)" }}><i className="fa-solid fa-desktop" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--n-800)" }}>{s.isCurrent ? "Sesi saat ini" : "Sesi aktif"}</div>
                  <div style={{ fontSize: ".72rem", color: "var(--n-500)" }}>Mulai: {new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                {s.isCurrent
                  ? <span style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--success-600)", display: "flex", alignItems: "center", gap: 4 }}><i className="fa-solid fa-circle" style={{ fontSize: ".4rem" }} /> Ini perangkat kamu</span>
                  : <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger-600)" }} onClick={() => revokeSession(s.id)}><i className="fa-solid fa-xmark" /> Akhiri</button>
                }
              </div>
            ))}
          </div>
        </div>
        <div className="set-footer"><span /></div>
      </div>
    </>
  );
}

function NotifPanel({ csrfToken }: { csrfToken: string }) {
  const [prefs, setPrefs] = useState({ emailWeekly: true, alertHighClick: true, productUpdates: false, tipsTutorial: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings/notifications").then((r) => r.json()).then((j) => { if (j.success) setPrefs(j.data); }).finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/notifications", { method: "PUT", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify(prefs) });
      const json = await res.json();
      if (json.success) { setMsg("Preferensi disimpan ✓"); setTimeout(() => setMsg(""), 2500); }
    } finally { setSaving(false); }
  }

  const items = [
    { key: "emailWeekly" as const, title: "Notifikasi Email", desc: "Terima ringkasan mingguan performa halamanmu via email." },
    { key: "alertHighClick" as const, title: "Alert Klik Tinggi", desc: "Dapat notifikasi kalau ada lonjakan kunjungan lebih dari 2x." },
    { key: "productUpdates" as const, title: "Update Produk", desc: "Dapat info fitur baru, update sistem, dan promo bannana.id." },
    { key: "tipsTutorial" as const, title: "Tips & Tutorial", desc: "Email berisi tips untuk meningkatkan performa link page kamu." },
  ];

  return (
    <div className="set-card">
      <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-bell" /> Preferensi Notifikasi</div></div>
      <div className="set-card-body">
        {loading ? <div style={{ fontSize: ".84rem", color: "var(--n-400)" }}>Memuat preferensi...</div> : items.map((item) => (
          <div key={item.key} className="toggle-setting">
            <div className="ts-left"><div className="ts-title">{item.title}</div><div className="ts-desc">{item.desc}</div></div>
            <div className={`toggle${prefs[item.key] ? "" : " off"}`} onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))} />
          </div>
        ))}
        {msg && <div style={{ background: "#D1FAE5", borderRadius: 8, padding: ".5rem .875rem", fontSize: ".84rem", color: "#065F46", marginTop: ".875rem" }}><i className="fa-solid fa-check" /> {msg}</div>}
      </div>
      <div className="set-footer"><span /><button className="btn btn-primary btn-sm" onClick={save} disabled={saving || loading}><i className="fa-solid fa-check" /> {saving ? "Menyimpan…" : "Simpan Preferensi"}</button></div>
    </div>
  );
}

function LanggananPanel({ csrfToken }: { csrfToken: string }) {
  type SubStatus = { plan: string; status: string; billingCycle: string | null; midtransPaymentType: string | null; currentPeriodStart: string | null; currentPeriodEnd: string | null; cancelledAt: string | null };
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/subscription/status").then((r) => r.json()).then((j) => { if (j.success) setSub(j.data); }).finally(() => setLoading(false));
  }, []);

  async function checkout() {
    setPaying(true);
    try {
      const res = await fetch("/api/subscription/checkout", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ billingCycle: cycle }) });
      const json = await res.json();
      if (!json.success) { alert(json.error?.message ?? "Gagal memulai pembayaran."); return; }
      const { snapToken, clientKey, isProduction } = json.data as { snapToken: string; clientKey: string; isProduction: boolean };
      const snapSrc = isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
      if (!document.querySelector(`script[src="${snapSrc}"]`)) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script"); s.src = snapSrc; s.setAttribute("data-client-key", clientKey);
          s.onload = () => resolve(); s.onerror = () => reject();
          document.head.appendChild(s);
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(snapToken, {
        onSuccess: () => { setMsg("Pembayaran berhasil! Halaman akan diperbarui…"); setTimeout(() => window.location.reload(), 2000); },
        onPending: () => { setMsg("Pembayaran sedang diproses. Cek email kamu untuk konfirmasi."); },
        onError: (result: unknown) => { console.error(result); alert("Pembayaran gagal. Silakan coba lagi."); },
        onClose: () => {},
      });
    } catch { alert("Gagal terhubung ke server pembayaran."); }
    finally { setPaying(false); }
  }

  async function cancel() {
    if (!confirm("Yakin ingin membatalkan langganan? Akses Pro akan berakhir di akhir periode.")) return;
    await fetch("/api/subscription/cancel", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken } });
    window.location.reload();
  }

  if (loading) return <div className="set-card"><div className="set-card-body" style={{ color: "var(--n-400)", fontSize: ".84rem" }}>Memuat info langganan...</div></div>;

  const isPro = sub?.plan === "pro" && sub?.status === "active";
  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  return (
    <div className="set-card">
      <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-crown" /> Paket Langganan</div></div>
      <div className="set-card-body">
        {isPro ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div><div style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", fontWeight: 700, color: "var(--b-900)" }}>Pro Plan</div><div style={{ fontSize: ".84rem", color: "var(--n-500)", marginTop: 3 }}>
                {sub?.billingCycle === "yearly" ? "Rp 150.000 / tahun" : "Rp 15.000 / bulan"}
              </div></div>
              <span className="plan-badge"><i className="fa-solid fa-star" /> AKTIF</span>
            </div>
            <div style={{ background: "var(--b-50)", border: "1.5px solid var(--b-200)", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--b-800)", marginBottom: ".625rem" }}><i className="fa-solid fa-circle-info" style={{ marginRight: 5 }} /> Detail Langganan</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", fontSize: ".8rem", color: "var(--n-700)" }}>
                <div><span style={{ color: "var(--n-400)" }}>Periode mulai</span><br /><strong>{fmt(sub?.currentPeriodStart ?? null)}</strong></div>
                <div><span style={{ color: "var(--n-400)" }}>Berlaku hingga</span><br /><strong>{fmt(sub?.currentPeriodEnd ?? null)}</strong></div>
                <div><span style={{ color: "var(--n-400)" }}>Siklus tagihan</span><br /><strong>{sub?.billingCycle === "yearly" ? "Tahunan" : "Bulanan"}</strong></div>
                <div><span style={{ color: "var(--n-400)" }}>Metode bayar</span><br /><strong>{sub?.midtransPaymentType ?? "-"}</strong></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }} onClick={cancel}><i className="fa-solid fa-xmark" /> Cancel Langganan</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div><div style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", fontWeight: 700, color: "var(--b-900)" }}>Gratis</div><div style={{ fontSize: ".84rem", color: "var(--n-500)", marginTop: 3 }}>Paket saat ini</div></div>
              <span style={{ background: "var(--n-100)", color: "var(--n-600)", borderRadius: 9999, padding: "4px 12px", fontSize: ".75rem", fontWeight: 700 }}>FREE</span>
            </div>
            <div style={{ background: "linear-gradient(135deg,var(--b-50),#FFFBEB)", border: "1.5px solid var(--b-200)", borderRadius: 14, padding: "1.25rem", marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, color: "var(--b-900)", marginBottom: "1rem", fontSize: "1rem" }}>🚀 Upgrade ke Pro — perbandingan fitur</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".8rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", color: "var(--n-500)", fontWeight: 600, paddingBottom: ".5rem", width: "55%" }}>Fitur</th>
                    <th style={{ textAlign: "center", color: "var(--n-500)", fontWeight: 600, paddingBottom: ".5rem" }}>Gratis</th>
                    <th style={{ textAlign: "center", color: "var(--b-700)", fontWeight: 700, paddingBottom: ".5rem" }}>Pro ⭐</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Jumlah halaman", free: "1", pro: "Tak terbatas" },
                    { label: "Blok per halaman", free: "10", pro: "Tak terbatas" },
                    { label: "Tema preset", free: "3 tema", pro: "12+ tema" },
                    { label: "Custom CSS", free: false, pro: true },
                    { label: "Analytics dasar", free: true, pro: true },
                    { label: "Retensi data analytics", free: "7 hari", pro: "90 hari" },
                    { label: "Export CSV", free: false, pro: true },
                    { label: "REST API access", free: false, pro: true },
                    { label: "Priority support", free: false, pro: true },
                  ].map((row) => (
                    <tr key={row.label} style={{ borderTop: "1px solid var(--b-100)" }}>
                      <td style={{ padding: ".4rem 0", color: "var(--n-700)" }}>{row.label}</td>
                      <td style={{ textAlign: "center", padding: ".4rem 0" }}>
                        {typeof row.free === "boolean"
                          ? row.free ? <i className="fa-solid fa-check" style={{ color: "var(--success-600)" }} /> : <i className="fa-solid fa-xmark" style={{ color: "var(--n-300)" }} />
                          : <span style={{ color: "var(--n-600)", fontWeight: 500 }}>{row.free}</span>}
                      </td>
                      <td style={{ textAlign: "center", padding: ".4rem 0", background: "rgba(251,191,36,.08)", borderRadius: 4 }}>
                        {typeof row.pro === "boolean"
                          ? row.pro ? <i className="fa-solid fa-check" style={{ color: "var(--b-600)" }} /> : <i className="fa-solid fa-xmark" style={{ color: "var(--n-300)" }} />
                          : <span style={{ color: "var(--b-800)", fontWeight: 700 }}>{row.pro}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: ".75rem", marginBottom: "1rem" }}>
              {(["monthly", "yearly"] as const).map((c) => (
                <button key={c} onClick={() => setCycle(c)} style={{ flex: 1, height: 44, borderRadius: 10, border: `2px solid ${cycle === c ? "var(--b-500)" : "var(--n-200)"}`, background: cycle === c ? "var(--b-500)" : "var(--n-0)", color: cycle === c ? "var(--b-950)" : "var(--n-700)", fontWeight: 700, fontSize: ".84rem", cursor: "pointer" }}>
                  {c === "monthly" ? "Bulanan · Rp 15.000" : "Tahunan · Rp 150.000"}
                  {c === "yearly" && <span style={{ marginLeft: 6, fontSize: ".68rem", background: "#D1FAE5", color: "#065F46", borderRadius: 4, padding: "1px 5px" }}>HEMAT 17%</span>}
                </button>
              ))}
            </div>
            {msg && <div style={{ background: "#D1FAE5", borderRadius: 8, padding: ".75rem", fontSize: ".84rem", color: "#065F46", marginBottom: ".75rem" }}>{msg}</div>}
            <button className="btn btn-primary btn-sm btn-full" onClick={checkout} disabled={paying} style={{ width: "100%", height: 44, borderRadius: 10 }}>
              {paying ? <><i className="fa-solid fa-spinner fa-spin" /> Memproses…</> : <><i className="fa-solid fa-crown" /> Bayar Sekarang</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function IntegrasiPanel({ csrfToken }: { csrfToken: string }) {
  type ApiKeyRow = { id: string; name: string; scopes: string[]; lastUsedAt: string | null; createdAt: string; revokedAt: string | null };
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetch("/api/settings/apikeys").then((r) => r.json()).then((j) => { if (j.success) setKeys(j.data); }).catch(() => {});
  }, []);

  async function createKey() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/settings/apikeys", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ name: newKeyName.trim() }) });
      const json = await res.json();
      if (!json.success) { alert(json.error?.message ?? "Gagal."); return; }
      const { id, name, rawKey, createdAt } = json.data as { id: string; name: string; rawKey: string; createdAt: string };
      setKeys((prev) => [{ id, name, scopes: ["analytics:read", "pages:read"], lastUsedAt: null, createdAt, revokedAt: null }, ...prev]);
      setNewKeyRaw(rawKey);
      setNewKeyName("");
      setShowCreate(false);
    } finally { setCreating(false); }
  }

  async function revokeKey(id: string) {
    if (!confirm("Hapus API key ini?")) return;
    await fetch(`/api/settings/apikeys/${id}`, { method: "DELETE", headers: { "X-CSRF-Token": csrfToken } });
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <>
      <div className="set-card">
        <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-plug" /> Akun Terhubung</div></div>
        <div className="set-card-body">
          <div className="connected-row">
            <div className="conn-ico"><i className="fa-brands fa-google" style={{ color: "#EA4335" }} /></div>
            <div><div className="conn-title">Google</div><div className="conn-sub">Login dengan akun Google</div></div>
            <a href="/api/auth/google" className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }}><i className="fa-brands fa-google" /> Hubungkan</a>
          </div>
        </div>
      </div>
      <div className="set-card">
        <div className="set-card-head">
          <div className="set-card-title"><i className="fa-solid fa-key" /> API Keys</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(!showCreate)}><i className="fa-solid fa-plus" /> Buat API Key</button>
        </div>
        <div className="set-card-body">
          <div style={{ fontSize: ".84rem", color: "var(--n-600)", marginBottom: "1rem", lineHeight: 1.65 }}>Gunakan API Key untuk mengakses bannana.id API secara programatik. Jaga kerahasiaan API key kamu!</div>
          {showCreate && (
            <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem" }}>
              <input className="form-inp" type="text" placeholder="Nama API key..." value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} style={{ marginBottom: 0 }} />
              <button className="btn btn-primary btn-sm" onClick={createKey} disabled={creating}>{creating ? "Membuat…" : "Buat"}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>Batal</button>
            </div>
          )}
          {newKeyRaw && (
            <div style={{ background: "#D1FAE5", border: "1.5px solid #6EE7B7", borderRadius: 10, padding: ".875rem", marginBottom: "1rem", fontSize: ".82rem" }}>
              <div style={{ fontWeight: 700, color: "#065F46", marginBottom: .4 + "rem" }}><i className="fa-solid fa-triangle-exclamation" /> Simpan key ini sekarang — tidak akan ditampilkan lagi!</div>
              <div style={{ fontFamily: "var(--fm)", wordBreak: "break-all", color: "#065F46" }}>{newKeyRaw}</div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: ".5rem" }} onClick={() => { navigator.clipboard.writeText(newKeyRaw); }}><i className="fa-solid fa-copy" /> Salin</button>
            </div>
          )}
          {keys.filter((k) => !k.revokedAt).length === 0 && !newKeyRaw && (
            <div style={{ fontSize: ".84rem", color: "var(--n-400)" }}>Belum ada API key aktif.</div>
          )}
          {keys.filter((k) => !k.revokedAt).map((k) => (
            <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--n-50)", border: "1.5px solid var(--n-200)", borderRadius: 12, padding: ".875rem", marginBottom: ".5rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--n-800)" }}>{k.name}</div>
                <div style={{ fontFamily: "var(--fm)", fontSize: ".75rem", color: "var(--n-500)", marginTop: 2 }}>{(k.scopes ?? []).join(", ")} · Dibuat {new Date(k.createdAt).toLocaleDateString("id-ID")}</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => revokeKey(k.id)}><i className="fa-solid fa-trash" /></button>
            </div>
          ))}
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

function BahayaPanel({ csrfToken, username }: { csrfToken: string; username: string }) {
  const [deactivating, setDeactivating] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function deactivate() {
    if (!confirm("Nonaktifkan akun? Semua halamanmu akan disembunyikan dari publik.")) return;
    setDeactivating(true);
    try {
      await fetch("/api/settings/deactivate", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken } });
      await fetch("/api/auth/logout", { method: "POST", headers: { "X-CSRF-Token": csrfToken } });
      window.location.href = "/login?notice=deactivated";
    } finally { setDeactivating(false); }
  }

  async function deleteAccount() {
    if (deleteInput !== username) { alert("Username tidak cocok."); return; }
    setDeleting(true);
    try {
      const res = await fetch("/api/settings/delete-account", { method: "DELETE", headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify({ confirmation: username }) });
      const json = await res.json();
      if (!json.success) { alert(json.error?.message ?? "Gagal menghapus akun."); return; }
      window.location.href = "/";
    } finally { setDeleting(false); }
  }

  return (
    <div className="set-card danger-zone">
      <div className="set-card-head"><div className="set-card-title"><i className="fa-solid fa-triangle-exclamation" /> Danger Zone</div></div>
      <div className="set-card-body">
        <div className="danger-row">
          <div><div className="danger-title">Export Semua Data</div><div className="danger-desc">Download semua data akun, halaman, dan analytics dalam format JSON.</div></div>
          <a href="/api/settings/export-data" download className="btn btn-ghost btn-sm"><i className="fa-solid fa-download" /> Export Data</a>
        </div>
        <div className="danger-row">
          <div><div className="danger-title">Nonaktifkan Akun Sementara</div><div className="danger-desc">Semua halaman publikmu akan disembunyikan. Kamu bisa aktifkan lagi kapanpun.</div></div>
          <button className="btn btn-ghost btn-sm" onClick={deactivate} disabled={deactivating}><i className="fa-solid fa-eye-slash" /> {deactivating ? "Memproses…" : "Nonaktifkan"}</button>
        </div>
        <div className="danger-row">
          <div><div className="danger-title">Hapus Akun Permanen</div><div className="danger-desc">Akun dan semua data akan dihapus selamanya. Tindakan ini tidak bisa dibatalkan!</div></div>
          <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteModal(true)}><i className="fa-solid fa-trash" /> Hapus Akun</button>
        </div>
        {showDeleteModal && (
          <div style={{ marginTop: "1rem", background: "var(--danger-100)", border: "1.5px solid #FECDD3", borderRadius: 12, padding: "1rem" }}>
            <div style={{ fontSize: ".84rem", color: "var(--danger-700)", marginBottom: ".75rem", fontWeight: 600 }}>Ketik username <strong>{username}</strong> untuk konfirmasi:</div>
            <input className="form-inp" type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder={username} style={{ marginBottom: ".75rem" }} />
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button className="btn btn-danger btn-sm" onClick={deleteAccount} disabled={deleting || deleteInput !== username}>{deleting ? "Menghapus…" : "Hapus Permanen"}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowDeleteModal(false); setDeleteInput(""); }}>Batal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
