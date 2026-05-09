import type { Metadata } from "next/types";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "bannana.id — satu link, semua tempat 🍌",
  description: "Platform link-in-bio yang simple, cepat, dan bisa dikostumasi sepuasnya. Cocok buat affiliator, kreator, influencer, freelancer — siapa aja!",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "bannana.id",
    description: "Satu link, semua tempat.",
    images: ["/og-default.svg"]
  }
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
