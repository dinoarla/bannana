import { prisma } from "@/lib/db/client";

export class PageRepository {
  listByUser(userId: string) {
    return prisma.page.findMany({
      where: { userId },
      include: { blocks: { orderBy: { position: "asc" } } },
      orderBy: { updatedAt: "desc" }
    });
  }

  findById(id: string) {
    return prisma.page.findUnique({
      where: { id },
      include: { blocks: { orderBy: { position: "asc" } }, user: { include: { profile: true } } }
    });
  }

  findPublicByUsername(username: string) {
    return prisma.page.findFirst({
      where: { user: { username }, isPublished: true },
      include: {
        blocks: { where: { isEnabled: true }, orderBy: { position: "asc" } },
        user: { include: { profile: true } }
      }
    });
  }

  findBySlug(slug: string) {
    return prisma.page.findUnique({ where: { slug } });
  }

  create(userId: string, input: { title: string; slug: string }) {
    return prisma.page.create({
      data: {
        userId,
        title: input.title,
        slug: input.slug,
        theme: "classic",
        blocks: {
          create: {
            type: "HEADER",
            title: "Heading Baru",
            position: 1,
            config: { subtitle: "Tulis sapaan singkat di sini" }
          }
        }
      },
      include: { blocks: { orderBy: { position: "asc" } } }
    });
  }

  update(id: string, data: { title?: string; slug?: string; theme?: string; customCss?: string; isPublished?: boolean }) {
    return prisma.page.update({
      where: { id },
      data,
      include: { blocks: { orderBy: { position: "asc" } } }
    });
  }

  delete(id: string) {
    return prisma.page.delete({ where: { id } });
  }

  incrementView(id: string) {
    return prisma.page.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  }
}
