import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <section className="card" style={{ maxWidth: 520, textAlign: "center" }}>
        <div className="prof-avatar" aria-hidden>✓</div>
        <h1 className="page-title">Verifikasi email</h1>
        <p className="page-subtitle">Alur email production disiapkan untuk Resend. Setelah token valid, `emailVerified` akan diisi di database.</p>
        <Link className="btn btn-primary" href="/dashboard">Lanjut ke dashboard</Link>
      </section>
    </main>
  );
}
