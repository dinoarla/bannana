import type { DbBlockType } from "@/types/db.types";
import { BlockRepository } from "@/lib/db/repositories/BlockRepository";
import { errors } from "@/lib/errors/AppError";

export class BlockService {
  constructor(private readonly blocks = new BlockRepository()) {}

  list(pageId: string) {
    return this.blocks.list(pageId);
  }

  create(pageId: string, input: { type: DbBlockType; title?: string | null; url?: string | null; config?: Record<string, unknown> }) {
    return this.blocks.create(pageId, input);
  }

  update(id: string, input: { title?: string | null; url?: string | null; isEnabled?: boolean; config?: Record<string, unknown> }) {
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
