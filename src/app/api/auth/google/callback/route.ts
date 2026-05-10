import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/lib/services/AuthService";
import { createSession } from "@/lib/auth/session";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://bannana.id";

function redirect(path: string) {
  return NextResponse.redirect(new URL(path, BASE_URL));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !state) return redirect("/login?error=google_cancelled");

  const jar = await cookies();
  const storedState = jar.get("google_oauth_state")?.value;
  jar.delete("google_oauth_state");

  if (!storedState || storedState !== state) return redirect("/login?error=oauth_state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return redirect("/login?error=google_not_configured");

  try {
    const redirectUri = `${BASE_URL}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    if (!tokenData.access_token) return redirect("/login?error=google_token");

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json() as { email?: string; name?: string; sub?: string };

    if (!googleUser.email) return redirect("/login?error=google_no_email");

    const user = await new AuthService().loginOrCreateGoogle({
      email: googleUser.email,
      name: googleUser.name ?? googleUser.email.split("@")[0],
    });

    await createSession(user.id);
    return redirect("/dashboard");
  } catch {
    return redirect("/login?error=google_failed");
  }
}
