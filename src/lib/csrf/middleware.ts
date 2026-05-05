import type { NextRequest } from "next/server";
import { errors } from "@/lib/errors/AppError";

export function assertCsrfRequest(request: NextRequest) {
  const cookieToken = request.cookies.get("bid_csrf")?.value;
  const headerToken = request.headers.get("x-csrf-token");
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw errors.forbidden("CSRF token tidak valid.");
  }
}
