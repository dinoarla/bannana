import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/utils/hash";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword("Bannana@2025");

  const user = await prisma.user.upsert({
    where: { email: "halo@bannana.id" },
    update: {},
    create: {
      email: "halo@bannana.id",
      username: "andi_kreasi",
      passwordHash,
      emailVerified: new Date(),
      profile: {
        create: {
          displayName: "Andi Pratama",
          bio: "Halo! Aku host di @designtalks, founder startup marketing, & suka bantu UMKM tampil keren online.",
          avatarIcon: "User",
          tags: ["Design", "Startup", "Podcast", "Marketing"],
          socialLinks: [
            { label: "Instagram", url: "https://instagram.com/andi_kreasi", icon: "Instagram", color: "#E1306C" },
            { label: "YouTube", url: "https://youtube.com/@andi_kreasi", icon: "Youtube", color: "#FF0000" }
          ]
        }
      }
    }
  });

  const page = await prisma.page.upsert({
    where: { slug: "andi_kreasi" },
    update: {},
    create: {
      userId: user.id,
      title: "Link Utama",
      slug: "andi_kreasi",
      theme: "classic",
      isPublished: true,
      viewCount: 12432,
      uniqueVisitors: 847
    }
  });

  const existingBlocks = await prisma.block.count({ where: { pageId: page.id } });
  if (existingBlocks === 0) {
    await prisma.block.createMany({
      data: [
        { pageId: page.id, type: "HEADER", title: "Halo! Selamat datang di bannana-ku", position: 1, config: { subtitle: "Semua link favoritku ada di sini" } },
        { pageId: page.id, type: "LINK", title: "Portfolio Terbaru 2026", url: "https://andi.design/portfolio", position: 2, clickCount: 1240, config: { subtitle: "Lihat semua karya & project terbaikku", icon: "★", bg: "var(--b-100)", color: "var(--b-700)" } },
        { pageId: page.id, type: "LINK", title: "YouTube Channel", url: "https://youtube.com/@andi_kreasi", position: 3, clickCount: 980, config: { subtitle: "Tutorial desain & marketing mingguan", icon: "▶", bg: "#FEE2D5", color: "#C05621" } },
        { pageId: page.id, type: "DIVIDER", title: null, position: 4, config: {} },
        { pageId: page.id, type: "LINK", title: "Hubungi Aku - Kolaborasi", url: "mailto:halo@andi.design", position: 5, clickCount: 267, config: { subtitle: "Terbuka untuk project & partnership", icon: "✉", bg: "#E0E7FF", color: "#4338CA" } }
      ]
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
