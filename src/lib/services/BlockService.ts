import type { BlockType } from "@/types";
import { BlockRepository } from "@/lib/db/repositories/BlockRepository";
import { errors } from "@/lib/errors/AppError";
import type { Prisma } from "@prisma/client";

export class BlockService {
  constructor(private readonly blocks = new BlockRepository()) {}

  list(pageId: string) {
    return this.blocks.list(pageId);
  }

  create(pageId: string, input: { type: BlockType; title?: string | null; url?: string | null; config?: Prisma.InputJsonValue }) {
    return this.blocks.create(pageId, input);
  }

  update(id: string, input: { title?: string | null; url?: string | null; isEnabled?: boolean; config?: Prisma.InputJsonValue }) {
    return this.blocks.update(id, input);
  }

  reorder(items: Array<{ id: string; position: number }>) {
    if (!items.length) throw errors.validation("Tidak ada blok untuk diurutkan.");
    return this.blocks.reorder(items);
  }

  delete(id: string) {
    return this.blocks.delete(id);
  }
}
