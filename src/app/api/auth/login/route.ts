import { AuthService } from "@/lib/services/AuthService";
import { loginSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await new AuthService().login(input);
    const csrfToken = await createSession(user.id);
    return ok({ user: sanitizeUser(user), csrfToken });
  } catch (error) {
    return handleApiError(error);
  }
}

function sanitizeUser<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
