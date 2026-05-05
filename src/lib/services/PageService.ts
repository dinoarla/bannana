import { PageRepository } from "@/lib/db/repositories/PageRepository";
import { errors } from "@/lib/errors/AppError";
import { slugify } from "@/lib/utils/slug";

export class PageService {
  constructor(private readonly pages = new PageRepository()) {}

  list(userId: string) {
    return this.pages.listByUser(userId);
  }

  async get(id: string) {
    const page = await this.pages.findById(id);
    if (!page) throw errors.notFound("Halaman tidak ditemukan.");
    return page;
  }

  async create(userId: string, input: { title: string; slug?: string }) {
    const slug = slugify(input.slug ?? input.title);
    if (await this.pages.findBySlug(slug)) throw errors.conflict("Slug sudah dipakai.");
    return this.pages.create(userId, { title: input.title, slug });
  }

  async update(id: string, input: { title?: string; slug?: string; theme?: string; customCss?: string; isPublished?: boolean }) {
    if (input.slug && await this.pages.findBySlug(slugify(input.slug))) {
      throw errors.conflict("Slug sudah dipakai.");
    }
    return this.pages.update(id, { ...input, slug: input.slug ? slugify(input.slug) : undefined });
  }

  publish(id: string, publish: boolean) {
    return this.pages.update(id, { isPublished: publish });
  }

  delete(id: string) {
    return this.pages.delete(id);
  }
}
