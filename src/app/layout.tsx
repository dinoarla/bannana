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
  title: { default: "bannana.id — Link in Bio Gratis untuk Indonesia", template: "%s | bannana.id" },
  description: "Buat halaman link in bio profesional dalam 2 menit, gratis selamanya. Cocok untuk kreator konten, UMKM, freelancer, dan affiliator Indonesia.",
  keywords: ["link in bio", "link in bio gratis", "bio link indonesia", "bannana.id", "link page gratis", "linktree alternatif indonesia", "kreator konten", "UMKM"],
  authors: [{ name: "bannana.id" }],
  creator: "bannana.id",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/favicon-32.png",
  },
  openGraph: {
    siteName: "bannana.id",
    title: "bannana.id — Satu Link, Semua Tempat",
    description: "Buat halaman link-in-bio dalam hitungan menit. Gratis selamanya.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "bannana.id" }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bannana.id — Satu Link, Semua Tempat",
    description: "Platform link-in-bio gratis untuk kreator Indonesia.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://bannana.id/#organization",
      "name": "bannana.id",
      "url": "https://bannana.id",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bannana.id/favicon.svg",
        "width": 512,
        "height": 512,
      },
      "description": "Platform link-in-bio gratis untuk kreator konten, UMKM, freelancer, dan affiliator Indonesia.",
      "foundingLocation": { "@type": "Country", "name": "Indonesia" },
    },
    {
      "@type": "WebSite",
      "@id": "https://bannana.id/#website",
      "url": "https://bannana.id",
      "name": "bannana.id",
      "inLanguage": "id-ID",
      "publisher": { "@id": "https://bannana.id/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://bannana.id/{search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://bannana.id/#app",
      "name": "bannana.id",
      "url": "https://bannana.id",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": [
        { "@type": "Offer", "name": "Gratis", "price": "0", "priceCurrency": "IDR" },
        { "@type": "Offer", "name": "Pro Bulanan", "price": "15000", "priceCurrency": "IDR" },
        { "@type": "Offer", "name": "Pro Tahunan", "price": "150000", "priceCurrency": "IDR" },
      ],
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
