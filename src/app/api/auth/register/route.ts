import { AuthService } from "@/lib/services/AuthService";
import { registerSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { created } from "@/lib/utils/response";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { queueVerificationEmail } from "@/lib/utils/emailVerification";
import { checkRateLimit, rateLimitedResponse } from "@/lib/utils/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(`register:${ip}`, 3, 600_000)) {
    return rateLimitedResponse("Terlalu banyak pendaftaran dari IP ini. Tunggu 10 menit.");
  }
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
