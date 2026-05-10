import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { errors } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/errorHandler";
import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { ok } from "@/lib/utils/response";

const MAX_BYTES = 300_000; // ~300KB for a resized 200x200 image

export async function PUT(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { dataUrl } = await request.json() as { dataUrl?: string };

    if (!dataUrl) {
      await new UserRepository().updateAvatar(user.id, null);
      return ok({ avatarUrl: null });
    }

    if (!dataUrl.startsWith("data:image/")) throw errors.validation("Format gambar tidak valid.");
    const base64Part = dataUrl.split(",")[1] ?? "";
    if (Buffer.byteLength(base64Part, "base64") > MAX_BYTES) {
      throw errors.validation("Ukuran foto maksimal 300KB setelah dikompres.");
    }

    await new UserRepository().updateAvatar(user.id, dataUrl);
    return ok({ avatarUrl: dataUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
