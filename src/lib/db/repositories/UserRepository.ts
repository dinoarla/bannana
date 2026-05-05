import { prisma } from "@/lib/db/client";

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, include: { profile: true } });
  }

  create(input: { email: string; username: string; passwordHash: string; displayName?: string }) {
    return prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash: input.passwordHash,
        profile: {
          create: {
            displayName: input.displayName ?? input.username,
            bio: "Satu link, semua tempat.",
            avatarIcon: "User",
            tags: ["Creator"],
            socialLinks: []
          }
        },
        pages: {
          create: {
            title: "Link Utama",
            slug: input.username,
            theme: "classic",
            isPublished: true,
            blocks: {
              create: [
                {
                  type: "HEADER",
                  title: "Halo! Selamat datang di bannana-ku",
                  position: 1,
                  config: { subtitle: "Semua link favoritku ada di sini" }
                }
              ]
            }
          }
        }
      },
      include: { profile: true, pages: true }
    });
  }
}
