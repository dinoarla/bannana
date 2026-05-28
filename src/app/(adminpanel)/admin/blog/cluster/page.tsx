import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import Link from "next/link";
import { ClusterGenerator } from "./ClusterGenerator";

export const dynamic = "force-dynamic";

export const metadata = { title: "Generator Topik — Admin bannana.id" };

export default async function ClusterPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [rows] = await db.query("SELECT role FROM User WHERE id = ? LIMIT 1", [user.id]);
  const r = (rows as Record<string, unknown>[])[0];
  if (r?.role !== "ADMIN") redirect("/dashboard");

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <Link href="/admin/blog" style={{ color: "var(--n-500)", fontSize: ".85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: ".35rem" }}>
          <i className="fa-solid fa-arrow-left" /> Blog &amp; Cerita
        </Link>
        <span style={{ color: "var(--n-300)" }}>/</span>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🧩</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "var(--n-900)" }}>Generator Klaster Topik</h1>
            <p style={{ margin: 0, fontSize: ".85rem", color: "var(--n-500)" }}>
              Generate 15 ide artikel SEO-friendly dalam 3 klaster: edukasi, konversi, dan cerita
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--n-200)", borderRadius: "var(--r-2xl)", padding: "1.75rem" }}>
        <ClusterGenerator />
      </div>
    </main>
  );
}
