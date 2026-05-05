export class UploadService {
  async createUploadPlaceholder(file: File) {
    return {
      fileName: file.name,
      size: file.size,
      url: "/og-default.svg",
      note: "Adapter siap diganti ke Cloudflare R2 untuk production."
    };
  }
}
