import { PageRepository } from "@/lib/db/repositories/PageRepository";
import { errors } from "@/lib/errors/AppError";

export class PublicPageService {
  constructor(private readonly pages = new PageRepository()) {}

  async getByUsername(username: string) {
    const page = await this.pages.findPublicByUsername(username)
      ?? await this.pages.findPublicBySlug(username);
    if (!page) throw errors.notFound("Halaman publik tidak ditemukan.");
    return page;
  }
}
