import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "linear-gradient(160deg,var(--b-50),#fff)", textAlign: "center" }}>
      <div>
        <div style={{ fontSize: "5rem", marginBottom: "1rem", display: "inline-block", animation: "bannana-wiggle 2s ease-in-out infinite" }}>🍌</div>
        <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(3rem,8vw,6rem)", fontWeight: 700, color: "var(--b-900)", margin: "0 0 .5rem" }}>404</h1>
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", color: "var(--b-700)", marginBottom: "1rem" }}>Halaman nggak ketemu!</h2>
        <p className="muted" style={{ maxWidth: 380, margin: "0 auto 2rem" }}>
          Sepertinya halaman yang kamu cari sudah dipindah, dihapus, atau memang tidak pernah ada.
        </p>
        <div style={{ display: "flex", gap: ".875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">Balik ke Beranda</Link>
          <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
