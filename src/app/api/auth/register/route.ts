import { AuthService } from "@/lib/services/AuthService";
import { registerSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { created } from "@/lib/utils/response";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { queueVerificationEmail } from "@/lib/utils/emailVerification";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const user = await new AuthService().register(input);
    const csrfToken = await createSession(user.id);
    queueVerificationEmail(user.id, user.email, sendVerificationEmail).catch(() => {});
    return created({ user: sanitizeUser(user), csrfToken });
  } catch (error) {
    return handleApiError(error);
  }
}

function sanitizeUser<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
