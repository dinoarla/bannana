import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/utils/hash";
import crypto from "crypto";

const prisma = new PrismaClient();

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function main() {
  const passwordHash = await hashPassword("Bannana@2025");

  // ── Users ─────────────────────────────────────────────────────────────────

  const user1 = await prisma.user.upsert({
    where: { email: "halo@bannana.id" },
    update: {},
    create: {
      email: "halo@bannana.id",
      username: "andi_kreasi",
      passwordHash,
      emailVerified: new Date(),
      role: "USER",
      profile: {
        create: {
          displayName: "Andi Pratama",
          bio: "Halo! Aku host di @designtalks, founder startup marketing, & suka bantu UMKM tampil keren online.",
          avatarIcon: "User",
          tags: ["Design", "Startup", "Podcast", "Marketing"],
          socialLinks: [
            { label: "Instagram", url: "https://instagram.com/andi_kreasi", icon: "Instagram", color: "#E1306C" },
            { label: "YouTube", url: "https://youtube.com/@andi_kreasi", icon: "Youtube", color: "#FF0000" },
            { label: "Twitter", url: "https://twitter.com/andi_kreasi", icon: "Twitter", color: "#1DA1F2" }
          ]
        }
      }
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: "admin@bannana.id" },
    update: {},
    create: {
      email: "admin@bannana.id",
      username: "admin_bannana",
      passwordHash,
      emailVerified: new Date(),
      role: "ADMIN",
      profile: {
        create: {
          displayName: "bannana Admin",
          bio: "Platform admin account.",
          avatarIcon: "Shield",
          tags: ["Admin"],
          socialLinks: []
        }
      }
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: "sasa@example.com" },
    update: {},
    create: {
      email: "sasa@example.com",
      username: "sasa_writes",
      passwordHash,
      emailVerified: new Date(),
      role: "USER",
      profile: {
        create: {
          displayName: "Sasa Maharani",
          bio: "Penulis & content creator. Berbagi cerita, tips menulis, dan rekomendasi buku.",
          avatarIcon: "PenLine",
          tags: ["Menulis", "Buku", "Content"],
          socialLinks: [
            { label: "Instagram", url: "https://instagram.com/sasa_writes", icon: "Instagram", color: "#E1306C" },
            { label: "TikTok", url: "https://tiktok.com/@sasa_writes", icon: "Music", color: "#010101" }
          ]
        }
      }
    }
  });

  // ── Pages ─────────────────────────────────────────────────────────────────

  const page1 = await prisma.page.upsert({
    where: { slug: "andi_kreasi" },
    update: {},
    create: {
      userId: user1.id,
      title: "Link Utama",
      slug: "andi_kreasi",
      theme: "classic",
      isPublished: true,
      viewCount: 12432,
      uniqueVisitors: 847
    }
  });

  const page2 = await prisma.page.upsert({
    where: { slug: "andi-podcast" },
    update: {},
    create: {
      userId: user1.id,
      title: "Podcast & Konten",
      slug: "andi-podcast",
      theme: "night",
      isPublished: true,
      viewCount: 3201,
      uniqueVisitors: 298
    }
  });

  const page3 = await prisma.page.upsert({
    where: { slug: "sasa-writes" },
    update: {},
    create: {
      userId: user3.id,
      title: "Sasa's Corner",
      slug: "sasa-writes",
      theme: "vanilla",
      isPublished: true,
      viewCount: 5890,
      uniqueVisitors: 412
    }
  });

  // draft page — tests isPublished: false UI state
  await prisma.page.upsert({
    where: { slug: "andi-draft" },
    update: {},
    create: {
      userId: user1.id,
      title: "Halaman Baru (Draft)",
      slug: "andi-draft",
      theme: "blueberry",
      isPublished: false,
      viewCount: 0,
      uniqueVisitors: 0
    }
  });

  // ── Blocks for page1 — covers all 6 block types ───────────────────────────

  const existingBlocks1 = await prisma.block.count({ where: { pageId: page1.id } });
  if (existingBlocks1 === 0) {
    await prisma.block.createMany({
      data: [
        {
          pageId: page1.id, type: "HEADER", position: 1,
          title: "Halo! Selamat datang 👋",
          config: { subtitle: "Semua link favoritku ada di sini", align: "center" }
        },
        {
          pageId: page1.id, type: "SOCIAL", position: 2,
          title: "Temukan aku di",
          config: {
            socials: [
              { label: "Instagram", url: "https://instagram.com/andi_kreasi", icon: "Instagram", color: "#E1306C" },
              { label: "YouTube", url: "https://youtube.com/@andi_kreasi", icon: "Youtube", color: "#FF0000" },
              { label: "Twitter", url: "https://twitter.com/andi_kreasi", icon: "Twitter", color: "#1DA1F2" }
            ]
          }
        },
        {
          pageId: page1.id, type: "LINK", position: 3,
          title: "Portfolio Terbaru 2026", url: "https://andi.design/portfolio",
          clickCount: 1240,
          config: { subtitle: "Lihat semua karya & project terbaikku", icon: "★", bg: "var(--b-100)", color: "var(--b-700)" }
        },
        {
          pageId: page1.id, type: "LINK", position: 4,
          title: "YouTube Channel", url: "https://youtube.com/@andi_kreasi",
          clickCount: 980,
          config: { subtitle: "Tutorial desain & marketing mingguan", icon: "▶", bg: "#FEE2D5", color: "#C05621" }
        },
        {
          pageId: page1.id, type: "IMAGE", position: 5,
          title: "Banner Kelas Desain",
          config: {
            imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600",
            subtitle: "Kelas desain online batch 3 — daftar sekarang!"
          }
        },
        {
          pageId: page1.id, type: "EMBED", position: 6,
          title: "Episode Terbaru Podcast", url: "https://open.spotify.com/episode/example",
          clickCount: 154,
          config: { subtitle: "Dengarkan episode terbaru Design Talks" }
        },
        {
          pageId: page1.id, type: "DIVIDER", position: 7,
          title: null, config: {}
        },
        {
          pageId: page1.id, type: "LINK", position: 8,
          title: "Hubungi Aku — Kolaborasi", url: "mailto:halo@andi.design",
          clickCount: 267,
          config: { subtitle: "Terbuka untuk project & partnership", icon: "✉", bg: "#E0E7FF", color: "#4338CA" }
        }
      ]
    });
  }

  // ── Blocks for page2 ──────────────────────────────────────────────────────

  const existingBlocks2 = await prisma.block.count({ where: { pageId: page2.id } });
  if (existingBlocks2 === 0) {
    await prisma.block.createMany({
      data: [
        {
          pageId: page2.id, type: "HEADER", position: 1,
          title: "Design Talks Podcast 🎙️",
          config: { subtitle: "Episode tentang desain, startup & kreativitas", align: "center" }
        },
        {
          pageId: page2.id, type: "LINK", position: 2,
          title: "Spotify", url: "https://spotify.com/show/designtalks",
          clickCount: 430,
          config: { subtitle: "Dengarkan di Spotify", icon: "🎵", bg: "#1DB954", color: "#ffffff" }
        },
        {
          pageId: page2.id, type: "LINK", position: 3,
          title: "Apple Podcasts", url: "https://podcasts.apple.com/designtalks",
          clickCount: 210,
          config: { subtitle: "Dengarkan di Apple Podcasts", icon: "🎙", bg: "#8B5CF6", color: "#ffffff" }
        },
        {
          pageId: page2.id, type: "DIVIDER", position: 4,
          title: null, config: {}
        },
        {
          pageId: page2.id, type: "LINK", position: 5,
          title: "Newsletter Mingguan", url: "https://andi.design/newsletter",
          clickCount: 89,
          config: { subtitle: "Tips desain & marketing tiap Senin", icon: "📬", bg: "#DBEAFE", color: "#1E40AF" }
        }
      ]
    });
  }

  // ── Blocks for page3 (Sasa) ───────────────────────────────────────────────

  const existingBlocks3 = await prisma.block.count({ where: { pageId: page3.id } });
  if (existingBlocks3 === 0) {
    await prisma.block.createMany({
      data: [
        {
          pageId: page3.id, type: "HEADER", position: 1,
          title: "Hi! Aku Sasa 📖",
          config: { subtitle: "Penulis, pembaca buku, & content creator", align: "center" }
        },
        {
          pageId: page3.id, type: "SOCIAL", position: 2,
          title: "Ikuti aku",
          config: {
            socials: [
              { label: "Instagram", url: "https://instagram.com/sasa_writes", icon: "Instagram", color: "#E1306C" },
              { label: "TikTok", url: "https://tiktok.com/@sasa_writes", icon: "Music", color: "#010101" }
            ]
          }
        },
        {
          pageId: page3.id, type: "LINK", position: 3,
          title: "Blog & Artikel", url: "https://sasawrites.com",
          clickCount: 720,
          config: { subtitle: "Baca tulisan & review buku terbaru", icon: "✍️", bg: "#FEF9C3", color: "#78350F" }
        },
        {
          pageId: page3.id, type: "LINK", position: 4,
          title: "Goodreads — Buku Favoritku", url: "https://goodreads.com/sasa_writes",
          clickCount: 340,
          config: { subtitle: "Lihat daftar bacaan & review bukuku", icon: "📚", bg: "#F3E8FF", color: "#6B21A8" }
        },
        {
          pageId: page3.id, type: "IMAGE", position: 5,
          title: "Book of the Month",
          config: {
            imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
            subtitle: "Buku favorit bulan ini"
          }
        },
        {
          pageId: page3.id, type: "LINK", position: 6,
          title: "TikTok BookTok", url: "https://tiktok.com/@sasa_writes",
          clickCount: 190,
          config: { subtitle: "Video book review pendek & seru", icon: "🎬", bg: "#F0FDF4", color: "#15803D" }
        }
      ]
    });
  }

  // ── Analytics (30 days of view + click events for page1) ─────────────────

  const analyticsCount = await prisma.analytics.count({ where: { pageId: page1.id } });
  if (analyticsCount === 0) {
    const linkBlocks = await prisma.block.findMany({
      where: { pageId: page1.id, type: { in: ["LINK", "EMBED"] } }
    });

    const referrers = ["https://instagram.com", "https://twitter.com", "https://google.com", null, null];
    const devices   = ["mobile", "mobile", "mobile", "desktop", "desktop", "tablet"];
    const countries = ["ID", "ID", "ID", "MY", "SG", "US"];

    const rows: {
      pageId: string; blockId: string | null; event: string;
      referrer: string | null; userAgent: string | null;
      country: string | null; device: string | null; createdAt: Date;
    }[] = [];

    for (let day = 30; day >= 0; day--) {
      const ts = () => new Date(daysAgo(day).getTime() - Math.random() * 86_400_000);
      const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

      // 20–100 page views per day
      const views = Math.floor(Math.random() * 80) + 20;
      for (let v = 0; v < views; v++) {
        rows.push({ pageId: page1.id, blockId: null, event: "view", referrer: pick(referrers), userAgent: "Mozilla/5.0", country: pick(countries), device: pick(devices), createdAt: ts() });
      }

      // 0–15 clicks per link block per day
      for (const block of linkBlocks) {
        const clicks = Math.floor(Math.random() * 15);
        for (let c = 0; c < clicks; c++) {
          rows.push({ pageId: page1.id, blockId: block.id, event: "click", referrer: pick(referrers), userAgent: "Mozilla/5.0", country: pick(countries), device: pick(devices), createdAt: ts() });
        }
      }
    }

    // batch insert in chunks of 200
    for (let i = 0; i < rows.length; i += 200) {
      await prisma.analytics.createMany({ data: rows.slice(i, i + 200) });
    }
  }

  // ── Sessions ──────────────────────────────────────────────────────────────

  await prisma.session.upsert({
    where: { tokenHash: sha256("seed-session-user1") },
    update: {},
    create: {
      userId: user1.id,
      tokenHash: sha256("seed-session-user1"),
      csrfToken: sha256("seed-csrf-user1"),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.session.upsert({
    where: { tokenHash: sha256("seed-session-user3") },
    update: {},
    create: {
      userId: user3.id,
      tokenHash: sha256("seed-session-user3"),
      csrfToken: sha256("seed-csrf-user3"),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  });

  // ── API Keys ──────────────────────────────────────────────────────────────

  await prisma.apiKey.upsert({
    where: { keyHash: sha256("seed-apikey-user1") },
    update: {},
    create: {
      userId: user1.id,
      name: "Integrasi Zapier",
      keyHash: sha256("seed-apikey-user1"),
      scopes: ["analytics:read", "pages:read"],
      lastUsedAt: daysAgo(2)
    }
  });

  // ── Audit Logs ────────────────────────────────────────────────────────────

  const auditCount = await prisma.auditLog.count({ where: { userId: user1.id } });
  if (auditCount === 0) {
    await prisma.auditLog.createMany({
      data: [
        { userId: user1.id, action: "user.register",   metadata: { email: "halo@bannana.id" },                    createdAt: daysAgo(30) },
        { userId: user1.id, action: "page.create",     metadata: { slug: "andi_kreasi" },                         createdAt: daysAgo(29) },
        { userId: user1.id, action: "page.publish",    metadata: { slug: "andi_kreasi", isPublished: true },       createdAt: daysAgo(28) },
        { userId: user1.id, action: "block.create",    metadata: { type: "LINK", title: "Portfolio Terbaru" },     createdAt: daysAgo(27) },
        { userId: user1.id, action: "page.create",     metadata: { slug: "andi-podcast" },                        createdAt: daysAgo(14) },
        { userId: user1.id, action: "profile.update",  metadata: { fields: ["bio", "tags"] },                     createdAt: daysAgo(7)  },
        { userId: user1.id, action: "page.update",     metadata: { slug: "andi_kreasi", fields: ["title"] },      createdAt: daysAgo(3)  },
        { userId: user1.id, action: "apikey.create",   metadata: { name: "Integrasi Zapier" },                    createdAt: daysAgo(2)  },
        { userId: user1.id, action: "user.login",      metadata: { ip: "127.0.0.1" },                             createdAt: daysAgo(1)  }
      ]
    });
  }

  console.log("✅ Seed selesai!\n");
  console.log("Akun tersedia (password: Bannana@2025):");
  console.log("  halo@bannana.id    → user biasa  (andi_kreasi)");
  console.log("  admin@bannana.id   → admin        (admin_bannana)");
  console.log("  sasa@example.com   → user biasa  (sasa_writes)");
  console.log("\nHalaman publik:");
  console.log("  /andi_kreasi   classic theme, published, 8 blok, analytics 30 hari");
  console.log("  /andi-podcast  night theme,   published, 5 blok");
  console.log("  /sasa-writes   vanilla theme, published, 6 blok");
  console.log("  /andi-draft    blueberry,     draft (tidak terlihat publik)");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
