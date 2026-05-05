import { cookies, headers } from "next/headers";
import { CSRF_COOKIE } from "@/lib/auth/session";
import { errors } from "@/lib/errors/AppError";

export async function verifyCsrf() {
  const jar = await cookies();
  const headerBag = await headers();
  const cookieToken = jar.get(CSRF_COOKIE)?.value;
  const headerToken = headerBag.get("x-csrf-token");
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw errors.forbidden("CSRF token tidak valid.");
  }
}
