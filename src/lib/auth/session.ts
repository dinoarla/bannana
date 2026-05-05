import { cookies } from "next/headers";
import { prisma } from "@/lib/db/client";
import { errors } from "@/lib/errors/AppError";
import { randomToken, sha256 } from "@/lib/utils/hash";

export const SESSION_COOKIE = "bid_session";
export const CSRF_COOKIE = "bid_csrf";

export async function createSession(userId: string) {
  const rawToken = randomToken();
  const csrfToken = randomToken(24);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: sha256(rawToken),
      csrfToken,
      expiresAt
    }
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, rawToken, { httpOnly: true, sameSite: "lax", path: "/", expires: expiresAt, secure: process.env.NODE_ENV === "production" });
  jar.set(CSRF_COOKIE, csrfToken, { httpOnly: false, sameSite: "lax", path: "/", expires: expiresAt, secure: process.env.NODE_ENV === "production" });
  return csrfToken;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  jar.delete(SESSION_COOKIE);
  jar.delete(CSRF_COOKIE);
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: { include: { profile: true } } }
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function assertSessionUser() {
  const user = await getSessionUser();
  if (!user) throw errors.unauthorized("Silakan login dulu.");
  return user;
}
