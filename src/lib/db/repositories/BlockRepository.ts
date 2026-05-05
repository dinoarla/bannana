import { prisma } from "@/lib/db/client";
import type { BlockType } from "@/types";
import type { Prisma } from "@prisma/client";

export class BlockRepository {
  list(pageId: string) {
    return prisma.block.findMany({ where: { pageId }, orderBy: { position: "asc" } });
  }

  async create(pageId: string, input: { type: BlockType; title?: string | null; url?: string | null; config?: Prisma.InputJsonValue }) {
    const count = await prisma.block.count({ where: { pageId } });
    return prisma.block.create({
      data: {
        pageId,
        type: input.type,
        title: input.title ?? defaultTitle(input.type),
        url: input.url,
        position: count + 1,
        config: input.config ?? {}
      }
    });
  }

  update(id: string, data: { title?: string | null; url?: string | null; isEnabled?: boolean; config?: Prisma.InputJsonValue }) {
    return prisma.block.update({ where: { id }, data });
  }

  reorder(items: Array<{ id: string; position: number }>) {
    return prisma.$transaction(items.map((item) => prisma.block.update({ where: { id: item.id }, data: { position: item.position } })));
  }

  delete(id: string) {
    return prisma.block.delete({ where: { id } });
  }

  incrementClick(id: string) {
    return prisma.block.update({ where: { id }, data: { clickCount: { increment: 1 } } });
  }
}

function defaultTitle(type: BlockType) {
  if (type === "HEADER") return "Heading Baru";
  if (type === "DIVIDER") return null;
  if (type === "SOCIAL") return "Sosial Media";
  return "Link Baru";
}
