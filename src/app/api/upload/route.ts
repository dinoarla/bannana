import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { errors } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/errorHandler";
import { UploadService } from "@/lib/services/UploadService";
import { ok } from "@/lib/utils/response";

export async function POST(request: Request) {
  try {
    await verifyCsrf();
    await assertSessionUser();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw errors.validation("File wajib dikirim.");
    return ok(await new UploadService().createUploadPlaceholder(file));
  } catch (error) {
    return handleApiError(error);
  }
}
