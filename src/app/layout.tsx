import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import type { Viewport } from "next/dist/lib/metadata/types/metadata-interface";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F59E0B",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "bannana.id — Satu Link, Semua Tempat 🍌", template: "%s | bannana.id" },
  description: "Platform link-in-bio yang simple, cepat, dan bisa dikostumasi sepuasnya. Cocok buat affiliator, kreator, influencer, freelancer — siapa aja!",
  keywords: ["link in bio", "bannana id", "link page", "bio link", "kreator konten", "influencer"],
  authors: [{ name: "bannana.id" }],
  creator: "bannana.id",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    siteName: "bannana.id",
    title: "bannana.id — Satu Link, Semua Tempat",
    description: "Buat halaman link-in-bio dalam hitungan menit. Gratis selamanya.",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "bannana.id" }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bannana.id — Satu Link, Semua Tempat",
    description: "Platform link-in-bio gratis untuk kreator Indonesia.",
    images: ["/og-default.svg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
