<div align="center">

```
██████╗  █████╗ ███╗   ██╗███╗   ██╗ █████╗ ███╗   ██╗ █████╗     ██╗██████╗
██╔══██╗██╔══██╗████╗  ██║████╗  ██║██╔══██╗████╗  ██║██╔══██╗    ██║██╔══██╗
██████╔╝███████║██╔██╗ ██║██╔██╗ ██║███████║██╔██╗ ██║███████║    ██║██║  ██║
██╔══██╗██╔══██║██║╚██╗██║██║╚██╗██║██╔══██║██║╚██╗██║██╔══██║    ██║██║  ██║
██████╔╝██║  ██║██║ ╚████║██║ ╚████║██║  ██║██║ ╚████║██║  ██║    ██║██████╔╝
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝    ╚═╝╚═════╝
```

🍌 **satu link, semua tempat — manis & mudah!** 🍌

🍌 **Product Requirements Document (PRD)** 🍌

[![Next.js](https://img.shields.io/badge/Next.js-15-FBBF24?style=flat-square&logo=next.js&logoColor=black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-F59E0B?style=flat-square&logo=typescript&logoColor=black)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-FCD34D?style=flat-square&logo=tailwindcss&logoColor=black)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma_+_MySQL-5.x-D97706?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![PM2](https://img.shields.io/badge/PM2-Self--Hosted-78350F?style=flat-square&logo=pm2&logoColor=white)](https://pm2.io)
[![License](https://img.shields.io/badge/License-MIT-FBBF24?style=flat-square)](LICENSE)

*Taro semua link favoritmu di satu tempat yang lucu & keren!* ✨

</div>

---

## Daftar Isi

- [Halo, bannana! 🍌](#-halo-bannana-)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Kenapa Prisma + MySQL?](#-kenapa-prisma--mysql)
- [Arsitektur](#-arsitektur)
- [Design System](#-design-system)
  - [Filosofi Desain](#filosofi-desain)
  - [Color Palette](#color-palette)
  - [Typography](#typography)
  - [Spacing & Layout](#spacing--layout)
  - [Border & Radius](#border--radius)
  - [Shadow & Elevation](#shadow--elevation)
  - [Motion & Animation](#motion--animation)
  - [Component Tokens](#component-tokens)
  - [Tema Preset](#tema-preset)
  - [Responsive Breakpoints](#responsive-breakpoints)
  - [Aksesibilitas](#aksesibilitas)
- [Struktur Folder](#-struktur-folder)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Keamanan](#-keamanan)
- [Instalasi & Setup](#-instalasi--setup)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Self-Hosted Deployment](#-self-hosted-deployment)
- [Contributing](#-contributing)
- [Changelog](#-changelog)

---

## 🍌 Halo, bannana!

**bannana.id** adalah platform link-in-bio yang *imut, cepat, dan bisa dikostumasi sepuasnya!* 🎀
Cocok banget buat kreator, influencer, freelancer, atau siapa aja yang pengen punya satu link sakti yang nampung semua.

Gak perlu ribet. Tinggal daftar, taro link, dan share deh~ 🌟

### Fitur Unggulan ✨

| Kategori | Yang Bisa Kamu Lakuin |
|----------|-----------------------|
| ✏️ **Editor** | Drag & drop real-time, live preview desktop/mobile, undo/redo sampai 50 langkah! |
| 🧩 **Blok Konten** | Link, Judul, Sosmed, Embed (YouTube/Spotify/X), Gambar, Divider |
| 🎨 **Themes** | 10+ tema cantik + kustom penuh (font, warna, CSS sendiri sampai 5KB) |
| 📊 **Analytics** | Lihat berapa yang klik, dari mana, pakai HP atau laptop — export CSV juga bisa! |
| 🔐 **Auth** | Login pakai email/password atau Google & GitHub, dilindungi CSRF + rate limit |
| 🔑 **API** | REST API dengan API Key yang bisa di-scope (read/write/analytics) |

---

## 🎬 Demo

```
🌐 Production  : https://bannana.id
🧪 Staging     : https://staging.bannana.id
📖 Storybook   : https://storybook.bannana.id
```

> **Akun Demo — langsung coba!** 🍌
> Email: `halo@bannana.id` | Password: `Bannana@2025`

---

## 🛠 Tech Stack

### Core

```
Runtime      Next.js 15 (standalone output)   Self-hosted Node.js 22+
Language     TypeScript 5.x                   Strict mode aktif
Styling      Tailwind CSS 4 + shadcn/ui        Utility-first + Radix primitives
Database     MySQL 8.x (hosting bawaan)        Langsung pakai DB hosting!
ORM          Prisma 5                          Type-safe queries + migrasi otomatis
Auth         NextAuth.js v5                   JWT strategy + bcrypt
```

### Infrastructure (Self-Hosted)

```
Server       Node.js 22+ + PM2               Process manager, auto-restart, cluster
Web Server   Nginx                            Reverse proxy, SSL termination, gzip
SSL          Let's Encrypt (Certbot)          HTTPS gratis & auto-renew
Database     MySQL 8.x (bawaan hosting)       Pakai yang udah ada, hemat biaya!
Storage      Cloudflare R2                    Avatar & OG image (tetap pakai R2)
Cache        Redis (self-hosted / hosting)     Rate limiting — pasang di server sendiri
Email        Resend + react-email             Transactional email
CDN          Cloudflare (proxy)               Cache statis + DDoS protection gratis
```

### Frontend

```
State        Zustand 5 + Immer               Global editor state + undo/redo
Server State TanStack Query v5               Caching + optimistic updates
Drag & Drop  dnd-kit                         Accessible, keyboard-navigable
Validasi     Zod 3                           Schema-first, inferred types
Animasi      Framer Motion                   Page transitions + block entrance
```

### Testing

```
Unit         Vitest + Testing Library         Repository, Service, Zod schemas
Integration  Vitest + MSW                     API routes + mock service worker
E2E          Playwright                       Happy path + security + editor UX
```

---

## 🍌 Kenapa Prisma + MySQL?

> Pertanyaan bagus! Ini penjelasan singkat biar nggak bingung~

**Prisma itu ORM** — jembatan antara kode TypeScript kamu dan database. Bukan pesaing MySQL, tapi teman baiknya!

```
Tanpa Prisma (raw query):          Dengan Prisma:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const [rows] = await db.query(     const page = await prisma.page.findFirst({
  `SELECT * FROM pages               where: { slug, isPublished: true },
   WHERE slug = ? AND               include: { blocks: { orderBy: { position: 'asc' } } }
   is_published = 1                });
   LIMIT 1`                        // ↑ Type-safe, autocomplete, no typo!
, [slug]);                         // ↑ Kalau field salah, TypeScript langsung error
// ↑ Hasil: any[], error-prone     // ↑ Hasil: Page & { blocks: Block[] }
```

### Perbandingan Lengkap

| Aspek | Prisma + MySQL | Raw mysql2 |
|-------|---------------|-----------|
| **Type safety** | ✅ Full TypeScript — autocomplete & compile error | ❌ Hasil `any[]`, typo baru ketahuan saat runtime |
| **Migrasi schema** | ✅ `prisma migrate dev` — otomatis, ada history | ❌ Tulis ALTER TABLE manual, rawan lupa |
| **Refactor field** | ✅ Rename di schema.prisma → semua ikut berubah | ❌ Cari manual di semua file query |
| **Relasi & join** | ✅ `include: { blocks: true }` — otomatis JOIN | ❌ Tulis JOIN SQL sendiri tiap kali |
| **Seed & testing** | ✅ `prisma db seed` — data sample mudah | ⚠️ Buat script SQL sendiri |
| **Performa** | ✅ Sangat baik, ada connection pooling | ✅ Sedikit lebih cepat (tipis sekali) |
| **Learning curve** | Butuh belajar ~1 hari | Hampir nol (kalau sudah tahu SQL) |
| **Cocok untuk** | Proyek yang berkembang, tim, long-term | Query super custom / legacy project |

### Cara Aktifkan MySQL di Prisma

Cuma ganti **1 baris** di `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"          // ← ganti dari "postgresql" ke "mysql"
  url      = env("DATABASE_URL")
}
```

Format `DATABASE_URL` untuk MySQL:

```bash
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/bannana_db"
```

> **Kesimpulan: tetap pakai Prisma, tinggal ganti provider ke mysql. Dapat semua keuntungan Prisma + hemat karena pakai DB hosting yang sudah ada!** 🍌

---

## 🏗 Arsitektur

### Layer Architecture (Self-Hosted)

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 Client (Browser)                          │
│      React Components → Zustand Store → TanStack Query          │
└────────────────────────────┬────────────────────────────────────┘
                             │  HTTPS (port 443)
┌────────────────────────────▼────────────────────────────────────┐
│                  🔀 Nginx (Reverse Proxy)                       │
│     SSL Termination + Gzip + Static Files + Rate Limit          │
└────────────────────────────┬────────────────────────────────────┘
                             │  HTTP (port 3000, internal)
┌────────────────────────────▼────────────────────────────────────┐
│             🍌 Next.js (Standalone) via PM2                     │
│          App Router + Edge Middleware (CSRF + Auth)             │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   ⚙️ Service Layer                              │
│        AuthService, PageService, BlockService, etc.             │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  🗃 Repository Layer                            │
│     UserRepository, PageRepository, BlockRepository             │
└────────────────────────────┬───────────────────┬───────────────┘
                             │                   │
          ┌──────────────────▼──────┐   ┌────────▼────────────┐
          │  🐬 MySQL 8 (Hosting)  │   │  🔴 Redis (Cache)   │
          │  DB bawaan hosting!    │   │  Rate limiting       │
          └─────────────────────────┘   └─────────────────────┘
```

### Prinsip SOLID

```
S — Single Responsibility   Repository → Service → Handler → Presenter
O — Open/Closed             Strategy pattern untuk block types (BlockFactory + registry)
L — Liskov Substitution     EmailService, FileStorage — concrete class substitutable
I — Interface Segregation   IReadableRepository, IWritableRepository, IDeletableRepository
D — Dependency Inversion    Inject via constructor (server) atau React Context (client)
```

### Block System (Open/Closed Pattern)

```typescript
// Tambah block baru = tambah 1 entry di registry — tanpa ubah core~ 🍌
const blockRegistry = new Map<BlockType, BlockRenderer<BlockConfig>>([
  ['LINK',    new LinkBlockRenderer()],
  ['HEADER',  new HeaderBlockRenderer()],
  ['SOCIAL',  new SocialBlockRenderer()],
  ['EMBED',   new EmbedBlockRenderer()],
  ['IMAGE',   new ImageBlockRenderer()],
  ['DIVIDER', new DividerBlockRenderer()],
  // ['PDF',  new PdfBlockRenderer()],  ← tinggal append!
]);
```

---

## 🎨 Design System

> Ini adalah *single source of truth* untuk semua keputusan visual bannana.id.
> Kalau mau ubah sesuatu, mulainya dari sini ya! 🍌

### Filosofi Desain

bannana.id pake pendekatan **"Sunny & Playful"** — terinspirasi dari estetika kawaii Jepang, zine indie, dan branding modern yang berani & penuh warna. Bukan serius-seriusan, tapi tetap profesional & enak dipake!

**Empat Pilar bannana.id:**

```
1. JOY        Setiap elemen harus bikin senyum. Warna cerah, bentuk yang ramah.
2. BOLDNESS   Kuning itu berani! Jangan takut kontras dan kepribadian yang kuat.
3. CLARITY    Playful bukan berarti berantakan — layout tetap bersih & terbaca.
4. WARMTH     Terasa seperti ngobrol sama teman, bukan baca dokumen formal.
```

---

### Color Palette

> 🍌 Semuanya berbasis **golden yellow** sebagai warna jiwa bannana.id!

#### Brand Colors — The Bannana Yellows 🌟

```css
/* ── Primary Yellow ── */
--color-brand-50:   #FFFBEB;   /* Latar kuning paling tipis */
--color-brand-100:  #FEF3C7;   /* Background card ringan */
--color-brand-200:  #FDE68A;   /* Border aktif, highlight */
--color-brand-300:  #FCD34D;   /* Hover state, secondary accent */
--color-brand-400:  #FBBF24;   /* Secondary action, icon aktif */
--color-brand-500:  #F59E0B;   /* Primary action default  ← MAIN */
--color-brand-600:  #D97706;   /* Primary action hover */
--color-brand-700:  #B45309;   /* Primary action pressed */
--color-brand-800:  #92400E;   /* Dark brown-gold variant */
--color-brand-900:  #78350F;   /* Heading dark / brand dark  ← DARK */
--color-brand-950:  #451A03;   /* Deepest brown */
```

```css
/* ── Accent — Bright Yellow (pair energik) ── */
--color-accent-300: #FEF08A;   /* Neon yellow-lime */
--color-accent-400: #FACC15;   /* Vibrant yellow  ← PAIR */
--color-accent-500: #EAB308;
```

```css
/* ── Warm Coral (kontras yang fun!) ── */
--color-coral-400: #FB923C;
--color-coral-500: #F97316;   /* ← tag, badge, highlight */
--color-coral-600: #EA580C;
```

```css
/* ── Neutral — Warm Cream-Gray (bukan abu dingin!) ── */
--color-neutral-0:   #FFFFFF;
--color-neutral-50:  #FAFAF9;   /* Page background */
--color-neutral-100: #F5F5F4;   /* Card background */
--color-neutral-200: #E7E5E4;   /* Divider, border */
--color-neutral-300: #D6D3D1;   /* Placeholder */
--color-neutral-400: #A8A29E;   /* Muted icon */
--color-neutral-500: #78716C;   /* Secondary text */
--color-neutral-600: #57534E;   /* Body text */
--color-neutral-700: #44403C;   /* Body text emphasis */
--color-neutral-800: #292524;   /* Heading light mode */
--color-neutral-900: #1C1917;   /* Max contrast */
--color-neutral-950: #0C0A09;   /* Near black — warm */
```

#### Semantic Colors

```css
/* Success */ --color-success-600: #16A34A;   --color-success-100: #DCFCE7;
/* Warning */ --color-warning-600: #D97706;   --color-warning-100: #FEF3C7;
/* Danger  */ --color-danger-600:  #E11D48;   --color-danger-100:  #FFE4E6;
/* Info    */ --color-info-600:    #0284C7;   --color-info-50:     #F0F9FF;
```

#### Dark Mode Colors

```css
--color-bg-primary:     #1A1409;   /* Deep warm black */
--color-bg-secondary:   #231A0D;   /* Card dark */
--color-bg-tertiary:    #2E2210;   /* Elevated surface */
--color-text-primary:   #FEF3C7;   /* Kuning krem — heading dark */
--color-text-secondary: #D6D3D1;
--color-text-muted:     #A8A29E;
--color-border-default: #3D2E15;
```

#### Gradient Library 🌈

```css
--gradient-brand:       linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FDE68A 100%);
--gradient-brand-warm:  linear-gradient(135deg, #F97316 0%, #F59E0B 50%, #FACC15 100%);
--gradient-brand-soft:  linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FEFCE8 100%);
--gradient-sunshine:    linear-gradient(160deg, #FEF9C3 0%, #FDE68A 30%, #FBBF24 70%, #F59E0B 100%);

/* Mesh gradient untuk hero */
--gradient-mesh-hero:
  radial-gradient(at 20% 20%, #FDE68A40 0px, transparent 50%),
  radial-gradient(at 80% 10%, #FBBF2430 0px, transparent 50%),
  radial-gradient(at 10% 70%, #F59E0B20 0px, transparent 50%),
  radial-gradient(at 90% 80%, #FCD34D25 0px, transparent 50%);

/* Glassmorphism yellow-tinted */
--gradient-glass:   linear-gradient(135deg, rgba(253,230,138,0.20) 0%, rgba(251,191,36,0.08) 100%);
--glass-backdrop:   blur(20px) saturate(180%);
--glass-border:     1px solid rgba(245, 158, 11, 0.20);
```

#### Panduan Pakai Warna 🍌

```
✅ LAKUKAN INI
  Tombol aksi utama    → brand-500 bg + brand-900 text (kontras tinggi!)
  Tombol sekunder      → brand-100 bg + brand-800 text
  Teks link            → brand-700, hover: brand-900
  Body text            → neutral-700
  Heading              → neutral-900
  Background card      → neutral-0 atau brand-50
  Background halaman   → neutral-50 (warm white)

❌ JANGAN INI
  Teks kuning di background kuning — kontras hancur!
  brand-300 atau lebih muda untuk teks body
  Hardcode hex langsung — pakai CSS variable!
  Warna dingin (biru/abu) sebagai warna dominan bannana.id
```

---

### Typography

#### Font Stack

```css
/* ── Display / Heading — rounded & manja ── */
--font-display: 'Fredoka', 'Nunito', system-ui, sans-serif;
  /*
   Karakter  : Rounded terminals, friendly, playful — nggak kaku sama sekali!
   Digunakan : Hero headline, page title, display text, nama brand
   Weight    : 300 / 400 / 500 / 600 / 700
   Source    : https://fonts.google.com/specimen/Fredoka
   Kenapa?   : Sudut huruf yang bulat = kesan hangat & ramah,
               identik dengan vibe bannana.id
  */

/* ── Body / UI — modern & enak dibaca ── */
--font-body: 'Plus Jakarta Sans', 'Nunito Sans', system-ui, sans-serif;
  /*
   Karakter  : Humanist modern, sedikit playful di ujung-ujungnya
   Digunakan : Body text, label form, deskripsi, caption
   Weight    : 400 / 500 / 600 / 700
   Source    : https://fonts.google.com/specimen/Plus+Jakarta+Sans
   Kenapa?   : Terbaca sempurna di semua ukuran, pairing indah sama Fredoka
  */

/* ── Monospace — kode & slug URL ── */
--font-mono: 'DM Mono', 'JetBrains Mono', monospace;
  /* Digunakan : Kode, slug URL, API key — weight 400 / 500 */
```

#### Font Loading (next/font)

```typescript
// src/app/layout.tsx
import { Fredoka, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
```

#### Type Scale

```css
--text-xs:    0.75rem;    /*  12px — Caption, badge */
--text-sm:    0.875rem;   /*  14px — Label, secondary body */
--text-base:  1rem;       /*  16px — Body text utama */
--text-lg:    1.125rem;   /*  18px — Body lead */
--text-xl:    1.25rem;    /*  20px — Subheading kecil */
--text-2xl:   1.5rem;     /*  24px — Card title */
--text-3xl:   1.875rem;   /*  30px — Section heading */
--text-4xl:   2.25rem;    /*  36px — Page title */
--text-5xl:   3rem;       /*  48px — Hero medium */
--text-6xl:   3.75rem;    /*  60px — Hero large */
--text-7xl:   4.5rem;     /*  72px — Display / hero besar */

/* Line Height */
--leading-tight:   1.25;   --leading-normal:  1.5;   --leading-relaxed: 1.625;

/* Letter Spacing */
--tracking-tight:  -0.02em;   --tracking-normal: 0em;
--tracking-wide:    0.02em;   --tracking-widest: 0.08em;
```

#### Hierarki Tipografi

```
Hero / Display    → Fredoka, text-5xl–7xl, Bold,     tracking-tight
Page Title        → Fredoka, text-3xl–4xl, SemiBold
Section Heading   → Fredoka, text-2xl–3xl, SemiBold
Card Title        → Plus Jakarta Sans, text-xl, SemiBold
Body Text         → Plus Jakarta Sans, text-base, Regular, leading-normal
Caption / Label   → Plus Jakarta Sans, text-sm, Medium
Kode / Slug       → DM Mono, text-sm
Eyebrow Label     → Plus Jakarta Sans, text-xs, Bold, tracking-widest, UPPERCASE
```

---

### Spacing & Layout

```css
/* Base unit: 4px */
--space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem; --space-4: 1rem;
--space-5: 1.25rem; --space-6: 1.5rem;  --space-8: 2rem;    --space-10: 2.5rem;
--space-12: 3rem;   --space-16: 4rem;   --space-20: 5rem;   --space-24: 6rem;
--space-32: 8rem;

/* Container */
--container-sm:  640px;    /* Public link page */
--container-lg:  1024px;   /* Dashboard */
--container-xl:  1280px;   /* Dashboard lebar */
--container-2xl: 1440px;   /* Hero */

/* Z-Index */
--z-dropdown: 100;  --z-sticky: 200;  --z-overlay: 300;
--z-modal:    400;  --z-toast:  500;  --z-tooltip: 600;
```

---

### Border & Radius

```css
/* Radius lebih besar dari konvensi — bikin UI terasa friendly! */
--radius-sm:   0.25rem;   /*  4px */
--radius-md:   0.5rem;    /*  8px  ← default button & input */
--radius-lg:   0.75rem;   /* 12px */
--radius-xl:   1rem;      /* 16px  ← default card */
--radius-2xl:  1.25rem;   /* 20px */
--radius-3xl:  1.75rem;   /* 28px  ← modal */
--radius-4xl:  2.5rem;    /* 40px  ← hero element */
--radius-full: 9999px;    /* pill / avatar / toggle */

/* Border Colors */
--border-subtle:  var(--color-brand-100);
--border-default: var(--color-brand-200);
--border-strong:  var(--color-brand-300);
--border-focus:   var(--color-brand-500);   /* Focus ring kuning */
```

---

### Shadow & Elevation

```css
/* Warm brown/yellow tint — bukan shadow abu! */
--shadow-sm:  0 1px 3px 0 rgba(120,53,15,0.10), 0 1px 2px -1px rgba(120,53,15,0.08);
--shadow-md:  0 4px 6px -1px rgba(120,53,15,0.10), 0 2px 4px -2px rgba(120,53,15,0.08);
--shadow-lg:  0 10px 15px -3px rgba(120,53,15,0.10), 0 4px 6px -4px rgba(120,53,15,0.08);
--shadow-xl:  0 20px 25px -5px rgba(120,53,15,0.12), 0 8px 10px -6px rgba(120,53,15,0.08);

/* Bannana Glow Shadow (kuning keemasan!) */
--shadow-brand-sm: 0 4px 14px 0 rgba(245,158,11,0.30);
--shadow-brand-md: 0 8px 25px 0 rgba(245,158,11,0.35);
--shadow-brand-lg: 0 20px 40px 0 rgba(245,158,11,0.30), 0 0 0 1px rgba(245,158,11,0.12);

/* Sunshine Glow (hero element) */
--shadow-sunshine: 0 0 60px 20px rgba(251,191,36,0.20), 0 20px 40px 0 rgba(245,158,11,0.15);

/* Inner Shadow */
--shadow-inner:       inset 0 2px 4px 0 rgba(120,53,15,0.06);
--shadow-inner-brand: inset 0 2px 8px 0 rgba(245,158,11,0.12);
```

---

### Motion & Animation

```css
/* Duration */
--duration-fast:    100ms;   --duration-normal: 200ms;
--duration-slow:    350ms;   --duration-slower: 500ms;

/* Easing — bannana loves spring! */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* ← FAVORIT! bouncy~ */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
```

```css
/* Entrance blok di public page */
@keyframes bannana-pop-up {
  0%   { opacity: 0; transform: translateY(24px) scale(0.97); }
  60%  { transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes bannana-wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50%       { transform: rotate(3deg); }
}

/* Stagger 70ms per blok */
.block-item {
  animation: bannana-pop-up var(--duration-slow) var(--ease-spring) both;
  animation-delay: calc(var(--block-index, 0) * 70ms);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### Component Tokens

#### Button

```css
.btn-primary {
  background: var(--color-brand-500);  color: var(--color-brand-900);
  border-radius: var(--radius-md);     font-weight: 700;
  box-shadow: var(--shadow-brand-sm);
  transition: background 100ms, box-shadow 100ms, transform 200ms var(--ease-spring);
}
.btn-primary:hover  { background: var(--color-brand-400); transform: translateY(-2px) scale(1.01); }
.btn-primary:active { background: var(--color-brand-600); transform: scale(0.99); }

/* Ukuran: sm(32px) | md(40px) ← default | lg(48px) | xl(56px) */
/* Varian: secondary | ghost | danger | soft */
```

#### Input

```css
.input {
  border: 2px solid var(--color-brand-200);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
}
.input:focus {
  border-color: var(--color-brand-500);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);   /* kuning glow~ */
}
```

#### Card

```css
.card {
  border: 2px solid var(--color-brand-100);   /* border kuning tipis khas bannana */
  border-radius: var(--radius-xl);             /* 16px rounded */
  transition: transform var(--duration-normal) var(--ease-spring);
}
.card:hover { border-color: var(--color-brand-300); transform: translateY(-3px); }

/* Varian: flat | sunny | raised | glass */
```

#### Badge

```css
/* Selalu pill, selalu bold! */
.badge { border-radius: var(--radius-full); padding: 3px 12px; font-weight: 700; }
.badge-brand   { background: var(--color-brand-100);   color: var(--color-brand-800);   }
.badge-sunny   { background: var(--color-brand-400);   color: var(--color-brand-900);   }
.badge-success { background: var(--color-success-100); color: var(--color-success-700); }
.badge-danger  { background: var(--color-danger-100);  color: var(--color-danger-700);  }
```

---

### Tema Preset

| Nama Tema | Deskripsi | Nuansa |
|-----------|-----------|--------|
| 🍌 **Bannana Classic** | Kuning cerah + coklat hangat — tema default! | Light + Playful |
| 🌙 **Bannana Night** | Dark coklat deep + kuning golden glow | Dark + Warm |
| 🍦 **Vanilla Cream** | Putih krem lembut + kuning sangat tipis | Light + Soft |
| 🍑 **Peach Blossom** | Peach-pink hangat + krem manis | Light + Sweet |
| 🍵 **Matcha Latte** | Hijau sage tenang + krem matcha | Light + Natural |
| 🫐 **Blueberry** | Biru navy dalam + aksen kuning kontras | Dark + Bold |
| 🍓 **Strawberry** | Merah marun + krem + highlight kuning | Light + Vibrant |
| 🖤 **Licorice** | Hitam matte + aksen kuning neon | Dark + Minimal |
| 🌈 **Rainbow Sherbet** | Gradient pastel pelangi | Light + Fun |
| ☁️ **Cloud Nine** | Putih bersih + abu sangat tipis | Light + Clean |
| 🎃 **Pumpkin Spice** | Oranye coklat hangat + krem | Light + Cozy |
| ✨ **Glitter Honey** | Gelap mewah + partikel glitter kuning emas | Dark + Glamour |

---

### Responsive Breakpoints

```css
--screen-xs: 480px;  --screen-sm: 640px;  --screen-md: 768px;
--screen-lg: 1024px; --screen-xl: 1280px; --screen-2xl: 1536px;
```

```
📱 Mobile (< 768px)  : Bottom sheet sidebar, FAB kuning, 1 kolom, font scale turun
📟 Tablet (768–1023) : Drawer sidebar, side rail nav, 2 kolom
🖥 Desktop (≥ 1024)  : Split pane editor, full sidebar, 3–4 kolom
```

---

### Aksesibilitas

```
Target: WCAG 2.1 Level AA

Focus Ring  : 3px solid brand-500 (kuning), offset 2px
ARIA        : aria-label, aria-describedby, aria-busy, aria-live
Keyboard    : Tab order logis, Escape tutup modal, Arrow keys editor
Kontras     : Teks di brand-500 → pakai brand-900. Body text min 4.5:1
Emoji       : Dekoratif = aria-hidden="true"
```

---

## 📁 Struktur Folder

```
/
├── prisma/
│   ├── schema.prisma              ← provider = "mysql"
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/login, register, verify-email, forgot-password
│   │   ├── (dashboard)/dashboard, pages/[pageId], settings/*, themes
│   │   ├── (public)/[username]/page.tsx
│   │   ├── api/auth, pages, analytics, upload
│   │   └── layout.tsx + not-found.tsx
│   ├── components/
│   │   ├── ui/                    ← shadcn/ui
│   │   ├── blocks/                ← BlockFactory + 6 renderers
│   │   ├── editor/                ← BlockEditor, DragDropCanvas, PreviewPane
│   │   ├── analytics/
│   │   └── shared/
│   ├── lib/
│   │   ├── db/client.ts + repositories/
│   │   ├── services/              ← 6 service classes
│   │   ├── csrf/token.ts + middleware.ts
│   │   ├── auth/config.ts
│   │   ├── validations/           ← Zod schemas
│   │   ├── errors/AppError.ts + errorHandler.ts
│   │   └── utils/slug, hash, response
│   ├── hooks/useBlocks, useCsrf, useAnalytics
│   ├── stores/editorStore.ts
│   ├── types/index.ts, block.types.ts, api.types.ts
│   └── middleware.ts
├── public/og-default.png + favicon.svg
├── tests/unit/ + integration/ + e2e/
├── ecosystem.config.js            ← Konfigurasi PM2
├── nginx.conf                     ← Konfigurasi Nginx
├── .env.example
├── next.config.ts                 ← output: 'standalone'
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗄 Database Schema

### Prisma + MySQL Setup

```prisma
// prisma/schema.prisma
datasource db {
  provider     = "mysql"           // ← MySQL hosting!
  url          = env("DATABASE_URL")
  relationMode = "prisma"          // Cocok untuk hosting tanpa foreign key support penuh
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  emailVerified DateTime?
  role          Role      @default(USER)
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  profile  Profile?
  pages    Page[]
  sessions Session[]
  auditLogs AuditLog[]
  apiKeys  ApiKey[]
}

model Block {
  id         String    @id @default(cuid())
  pageId     String
  type       BlockType
  title      String?
  url        String?   @db.Text
  position   Int
  isEnabled  Boolean   @default(true)
  config     Json
  clickCount Int       @default(0)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  page      Page        @relation(fields: [pageId], references: [id], onDelete: Cascade)
  analytics Analytics[]

  @@index([pageId, position])
  @@index([pageId, isEnabled])
}

enum BlockType { LINK HEADER SOCIAL EMBED IMAGE DIVIDER }
enum Role      { USER ADMIN }
```

> File lengkap: [`prisma/schema.prisma`](prisma/schema.prisma)

### Catatan MySQL vs PostgreSQL

```
Perbedaan kecil yang perlu diperhatikan saat pakai MySQL:

1. String panjang (URL, bio) → tambahkan @db.Text
2. JSON field              → MySQL 5.7+ support native JSON ✅
3. Enum                    → Prisma handle otomatis di MySQL ✅
4. Case sensitivity        → MySQL default case-insensitive untuk string
5. relationMode = "prisma" → hindari masalah foreign key di beberapa hosting
```

---

## 📡 API Reference

### Endpoints

```http
POST   /api/auth/register          Body: { email, username, password, confirmPassword }
POST   /api/auth/login             Body: { email, password }
DELETE /api/auth/logout

GET    /api/pages                  ?page=1&limit=20
POST   /api/pages                  Body: { title, slug? }
GET    /api/pages/:id
PUT    /api/pages/:id
DELETE /api/pages/:id
POST   /api/pages/:id/publish      Body: { publish: boolean }

GET    /api/pages/:id/blocks
POST   /api/pages/:id/blocks
PUT    /api/pages/:id/blocks/reorder   Body: [{ id, position }]
PUT    /api/pages/:id/blocks/:bid
DELETE /api/pages/:id/blocks/:bid

POST   /api/analytics/track        Body: { pageId, blockId?, event }
GET    /api/analytics/:pageId      ?range=30d|90d

POST   /api/upload                 Form: file (jpeg|png|webp, max 5MB)
```

### Response Format

```typescript
{ "success": true,  "data": T }                                              // ✅
{ "success": false, "error": { "code": string, "message": string } }        // ❌
```

| Code | Status | Arti |
|------|--------|------|
| `VALIDATION_ERROR` | 400 | Input nggak valid |
| `UNAUTHORIZED` | 401 | Belum login |
| `FORBIDDEN` | 403 | CSRF mismatch / bukan punyamu |
| `NOT_FOUND` | 404 | Data nggak ketemu |
| `CONFLICT` | 409 | Username / slug udah kepake |
| `RATE_LIMIT_EXCEEDED` | 429 | Santai dulu~ |
| `INTERNAL_ERROR` | 500 | Ada yang error, maaf ya! |

---

## 🔐 Keamanan

```
CSRF     : Double-Submit Cookie, X-CSRF-Token header, rotasi tiap mutasi
Rate Limit: Redis sliding window — Auth 5/mnt, API 100/mnt, Public 60/mnt
Password : bcrypt salt rounds 12, reset token single-use expire 1 jam
Headers  : X-Frame-Options DENY, HSTS, CSP via Nginx
```

---

## 🚀 Instalasi & Setup

```bash
# 1. Clone & install
git clone https://github.com/yourorg/bannana-id.git
cd bannana-id
pnpm install

# 2. Setup env
cp .env.example .env.local
# ← isi DATABASE_URL dengan kredensial MySQL hosting kamu

# 3. Buat database di hosting (via cPanel / phpMyAdmin)
#    CREATE DATABASE bannana_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. Jalankan migrasi
pnpm prisma migrate deploy
pnpm prisma db seed

# 5. Build
pnpm build

# 6. Jalankan lokal
pnpm start  # atau pakai PM2 — lihat bagian Deployment
```

---

## ⚙️ Environment Variables

```bash
# ── Database MySQL Hosting ──────────────────────────────────────
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/bannana_db"
# Format lengkap jika hosting bukan localhost:
# DATABASE_URL="mysql://user:pass@db.hostingku.com:3306/bannana_db?ssl=true"

# ── Auth ────────────────────────────────────────────────────────
NEXTAUTH_SECRET="generate: openssl rand -base64 32"
NEXTAUTH_URL="https://bannana.id"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# ── Email (Resend) ───────────────────────────────────────────────
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="halo@bannana.id"

# ── Storage (Cloudflare R2) ──────────────────────────────────────
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="bannana-uploads"
R2_PUBLIC_URL="https://cdn.bannana.id"

# ── Rate Limiting (Redis self-hosted) ────────────────────────────
REDIS_URL="redis://localhost:6379"
# Atau pakai Upstash jika tidak mau install Redis sendiri:
# UPSTASH_REDIS_REST_URL=""
# UPSTASH_REDIS_REST_TOKEN=""

# ── Security ────────────────────────────────────────────────────
CSRF_SECRET="generate: openssl rand -base64 32"

# ── App ─────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://bannana.id"
NEXT_PUBLIC_APP_NAME="bannana.id"
NODE_ENV="production"
PORT=3000
```

---

## 🧪 Testing

```bash
pnpm test             # Unit + Integration
pnpm test:watch       # Watch mode
pnpm test:coverage    # Lihat coverage
pnpm test:e2e         # E2E Playwright
pnpm test:e2e --ui    # E2E dengan UI interaktif
```

**Target:** Service layer ≥ 80% | Overall ≥ 60%

---

## 🖥 Self-Hosted Deployment

> Deploy ke VPS / hosting Node.js sendiri — tanpa Vercel! 🍌

### Prasyarat Server

```bash
node --version    # v22+
npm i -g pm2      # Process manager
nginx -v          # Web server & reverse proxy
mysql --version   # v8.x (biasanya sudah ada di hosting)
redis-cli ping    # Redis untuk rate limiting (opsional, lihat alternatif)
```

### Step 1 — Konfigurasi Next.js untuk Standalone

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',       // ← WAJIB untuk self-hosted!
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.bannana.id' },
    ],
  },
};

export default nextConfig;
```

### Step 2 — Build & Siapkan File

```bash
# Di server atau lokal lalu upload
pnpm build

# Struktur hasil build standalone:
# .next/standalone/         ← folder ini yang dijalankan
# .next/static/             ← copy ke standalone/.next/static
# public/                   ← copy ke standalone/public

cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

### Step 3 — Konfigurasi PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'bannana-id',
      script: '.next/standalone/server.js',
      instances: 'max',          // Pakai semua CPU core
      exec_mode: 'cluster',      // Cluster mode untuk multi-core
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file:   './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
```

```bash
# Jalankan dengan PM2
pm2 start ecosystem.config.js

# Simpan agar auto-start saat server reboot
pm2 save
pm2 startup    # ikuti instruksi yang muncul

# Perintah PM2 yang sering dipakai
pm2 status                    # Lihat status semua proses
pm2 logs bannana-id           # Lihat log real-time
pm2 reload bannana-id         # Reload tanpa downtime (zero-downtime!)
pm2 restart bannana-id        # Restart paksa
pm2 monit                     # Dashboard monitoring
```

### Step 4 — Konfigurasi Nginx

```nginx
# /etc/nginx/sites-available/bannana.id
# (atau sesuaikan path sesuai panel hosting)

server {
    listen 80;
    server_name bannana.id www.bannana.id;

    # Redirect HTTP → HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bannana.id www.bannana.id;

    # SSL — Let's Encrypt (isi setelah jalankan certbot)
    ssl_certificate     /etc/letsencrypt/live/bannana.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bannana.id/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options           "DENY"                            always;
    add_header X-Content-Type-Options    "nosniff"                         always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Permissions-Policy        "camera=(), microphone=(), geolocation=()" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;

    # Static files — langsung dari folder, tanpa lewat Node.js
    location /_next/static/ {
        alias /var/www/bannana-id/.next/standalone/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /public/ {
        alias /var/www/bannana-id/.next/standalone/public/;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # Proxy ke Next.js
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        'upgrade';
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Rate limiting Nginx level (lapisan pertama)
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m  rate=100r/m;

    location /api/auth/ {
        limit_req zone=auth burst=3 nodelay;
        proxy_pass http://127.0.0.1:3000;
        # ... proxy headers sama seperti di atas
    }
}
```

```bash
# Aktifkan config & test
sudo ln -s /etc/nginx/sites-available/bannana.id /etc/nginx/sites-enabled/
sudo nginx -t         # Test config — pastikan "syntax is ok"
sudo systemctl reload nginx
```

### Step 5 — SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate sertifikat (otomatis edit nginx.conf!)
sudo certbot --nginx -d bannana.id -d www.bannana.id

# Verifikasi auto-renewal
sudo certbot renew --dry-run

# Cek jadwal auto-renew
sudo systemctl status certbot.timer
```

### Step 6 — Database Migration di Production

```bash
# Jalankan setiap deploy yang ada perubahan schema
cd /var/www/bannana-id
pnpm prisma migrate deploy

# Jika perlu seed ulang (hati-hati di production!)
# pnpm prisma db seed
```

### Step 7 — Script Deploy Otomatis

```bash
#!/bin/bash
# deploy.sh — jalankan setiap mau update

set -e  # Stop jika ada error

echo "🍌 Deploying bannana.id..."

# Pull kode terbaru
git pull origin main

# Install dependencies
pnpm install --frozen-lockfile

# Build Next.js
pnpm build

# Salin static files
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Jalankan migrasi database
pnpm prisma migrate deploy

# Reload PM2 tanpa downtime
pm2 reload bannana-id

echo "✅ Deploy selesai! bannana.id siap~ 🍌"
```

```bash
chmod +x deploy.sh
./deploy.sh
```

### Monitoring & Maintenance

```bash
# Lihat resource usage
pm2 monit

# Lihat log error
pm2 logs bannana-id --err --lines 100

# Backup database MySQL
mysqldump -u USERNAME -p bannana_db > backup_$(date +%Y%m%d).sql

# Cek disk usage
df -h

# Cek memory
free -h

# Restart Nginx
sudo systemctl restart nginx

# Cek status semua service
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql
sudo systemctl status redis   # jika pakai Redis lokal
```

### Perbandingan: Vercel vs Self-Hosted

| Aspek | Vercel | Self-Hosted (Node.js + PM2) |
|-------|--------|----------------------------|
| **Setup** | 1 klik deploy | ~1–2 jam setup awal |
| **Biaya** | $20+/bln (Pro) | Sesuai harga hosting (bisa lebih hemat) |
| **Database** | Neon (serverless) | MySQL bawaan hosting ✅ |
| **Scaling** | Otomatis | Manual (tambah instance PM2) |
| **Cold start** | Ada (serverless) | Tidak ada (proses selalu jalan) |
| **SSL** | Otomatis | Let's Encrypt (gratis, auto-renew) |
| **Deploy** | Git push → auto | `./deploy.sh` atau CI/CD manual |
| **Log** | Vercel dashboard | `pm2 logs` + file log lokal |
| **Kontrol** | Terbatas | Penuh — bisa konfigurasi apa saja |
| **Cocok untuk** | Startup, prototyping | Hosting sendiri, kontrol penuh, hemat biaya |

> **Tips:** Kalau hosting kamu sudah include MySQL, domain, dan cukup RAM (min 1GB) — self-hosted jauh lebih hemat. PM2 cluster mode juga performa-nya bagus banget!

---

## 🤝 Contributing

Seneng banget kalau mau ikut berkontribusi! 💛

### Commit Convention

```
feat:     Fitur baru 🎉      fix:  Bug fix 🐛
perf:     Performa ⚡         test: Tambah test 🧪
refactor: Refactor 🔧         docs: Update docs 📝

Contoh:
  feat(editor): tambah block type PDF
  fix(auth): perbaiki token rotation concurrent login
  chore(deploy): update ecosystem.config.js untuk cluster mode
```

### PR Checklist

```
□ TypeScript strict — no any, no ts-ignore tanpa justifikasi
□ Zod validation untuk semua input/output API
□ Tests untuk logic baru
□ Error handling pakai AppError hierarchy
□ WCAG AA — aria labels, keyboard support
□ Ikutin design system bannana.id 🍌
□ Test di environment self-hosted (bukan asumsi Vercel edge)
```

---

## 📋 Changelog

### v1.0.0 — 2025

- 🍌 Initial release **bannana.id** — manis & production-ready!
- ✅ Auth: email/password + OAuth Google & GitHub
- ✅ Editor drag & drop + live preview
- ✅ 6 block types: Link, Header, Social, Embed, Image, Divider
- ✅ Analytics dashboard + export CSV
- ✅ 12 tema preset + kustom CSS
- ✅ **Self-hosted deployment** — PM2 + Nginx + Let's Encrypt
- ✅ **Prisma + MySQL** — pakai DB bawaan hosting, hemat & type-safe!
- ✅ Design System: Fredoka + Plus Jakarta Sans + Golden Yellow
- ✅ TypeScript strict — 0 `any`, 0 `ts-ignore`
- ✅ WCAG 2.1 AA

---

<div align="center">

🍌 🍌 🍌

**bannana.id** — dibuat dengan cinta, kuning, dan sedikit gila~ 💛

[Dokumentasi](docs/) · [PRD](docs/PRD.md) · [Laporin Bug](issues/) · [Request Fitur](issues/)

*"Satu link buat semua — semanis bannana!"* 🍌

</div>
