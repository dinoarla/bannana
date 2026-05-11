export const dynamic = "force-dynamic";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { getSessionUser } from "@/lib/auth/session";
import { PricingContent } from "./PricingContent";

export const metadata: Metadata = {
  title: "Harga — bannana.id",
  description: "Mulai gratis selamanya atau upgrade ke Pro dengan Rp 15.000/bulan. Halaman tak terbatas, analytics lengkap, dan lebih banyak fitur.",
  openGraph: {
    title: "Paket & Harga — bannana.id",
    description: "Gratis atau Pro. Pilih yang cocok buat kamu.",
  },
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const user = await getSessionUser();
  return <PricingContent isLoggedIn={!!user} />;
}
