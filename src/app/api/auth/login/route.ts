import { AuthService } from "@/lib/services/AuthService";
import { loginSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { checkRateLimit, rateLimitedResponse } from "@/lib/utils/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(`login:${ip}`, 5, 60_000)) {
    return rateLimitedResponse("Terlalu banyak percobaan login. Tunggu 1 menit.");
  }
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
