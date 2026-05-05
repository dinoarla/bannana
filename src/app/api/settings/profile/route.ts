import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  bio: z.string().max(300).optional(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/, "Username hanya boleh huruf, angka, underscore, strip.").optional(),
});

export async function PUT(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const input = profileUpdateSchema.parse(await request.json());

    if (input.username && input.username !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username: input.username } });
      if (existing) throw errors.conflict("Username sudah dipakai.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(input.username ? { username: input.username } : {}),
        profile: {
          update: {
            ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
            ...(input.bio !== undefined ? { bio: input.bio } : {}),
          },
        },
      },
      include: { profile: true },
    });

    const { passwordHash: _ph, ...safe } = updatedUser;
    return ok(safe);
  } catch (error) {
    return handleApiError(error);
  }
}
