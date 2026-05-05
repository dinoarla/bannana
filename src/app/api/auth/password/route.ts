import { assertSessionUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { prisma } from "@/lib/db/client";
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

    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!fullUser || !(await verifyPassword(input.currentPassword, fullUser.passwordHash))) {
      throw errors.unauthorized("Password lama salah.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(input.newPassword) },
    });

    return ok({ changed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
