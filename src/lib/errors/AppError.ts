export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errors = {
  validation: (message = "Input tidak valid.") => new AppError("VALIDATION_ERROR", message, 400),
  unauthorized: (message = "Belum login.") => new AppError("UNAUTHORIZED", message, 401),
  forbidden: (message = "Akses ditolak.") => new AppError("FORBIDDEN", message, 403),
  notFound: (message = "Data tidak ditemukan.") => new AppError("NOT_FOUND", message, 404),
  conflict: (message = "Data sudah dipakai.") => new AppError("CONFLICT", message, 409),
  internal: (message = "Ada yang error, maaf ya.") => new AppError("INTERNAL_ERROR", message, 500)
};
