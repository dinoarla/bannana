import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { hashPassword, verifyPassword } from "@/lib/utils/hash";
import { z } from "zod";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter."),
});

export async function PUT(request: Request) {
  try {
    const user = await assertSessionUser();
    const input = passwordChangeSchema.parse(await request.json());

    const repo = new UserRepository();
    const fullUser = await repo.findByEmail(user.email);
    if (!fullUser || !(await verifyPassword(input.currentPassword, fullUser.passwordHash))) {
      throw errors.unauthorized("Password lama salah.");
    }

    await repo.updatePassword(user.id, await hashPassword(input.newPassword));
    return ok({ changed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
