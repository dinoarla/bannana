import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomToken } from "@/lib/utils/hash";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", process.env.NEXTAUTH_URL ?? "https://bannana.id"));
  }

  const state = randomToken(16);
  const jar = await cookies();
  jar.set("google_oauth_state", state, { httpOnly: true, sameSite: "lax", maxAge: 600, path: "/" });

  const redirectUri = `${process.env.NEXTAUTH_URL ?? "https://bannana.id"}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
