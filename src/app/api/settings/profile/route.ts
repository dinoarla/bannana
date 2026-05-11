import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { ok } from "@/lib/utils/response";
import { UserRepository } from "@/lib/db/repositories/UserRepository";
import { z } from "zod";

const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  bio: z.string().max(160).optional(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/, "Username hanya boleh huruf, angka, underscore, strip.").optional(),
  website: z.string().max(500).optional(),
});

export async function PUT(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const input = profileUpdateSchema.parse(await request.json());
    const repo = new UserRepository();

    if (input.username && input.username !== user.username) {
      const existing = await repo.findByUsername(input.username);
      if (existing) throw errors.conflict("Username sudah dipakai.");
    }

    const updated = await repo.updateUsernameAndProfile(user.id, {
      username: input.username,
      displayName: input.displayName,
      bio: input.bio,
      website: input.website,
    });

    if (!updated) throw errors.notFound("User tidak ditemukan.");
    const { passwordHash: _ph, ...safe } = updated;
    return ok(safe);
  } catch (error) {
    return handleApiError(error);
  }
}
