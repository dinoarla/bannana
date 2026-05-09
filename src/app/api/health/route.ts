import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.DATABASE_URL = process.env.DATABASE_URL ? "ok" : "MISSING";
  checks.NEXTAUTH_URL  = process.env.NEXTAUTH_URL  ? "ok" : "MISSING";
  checks.CSRF_SECRET   = process.env.CSRF_SECRET   ? "ok" : "MISSING";

  try {
    const raw = (process.env.DATABASE_URL ?? "").trim();
    const u = new URL(raw);
    const mysql = await import("mysql2/promise");
    const conn = await mysql.createConnection({
      host: u.hostname,
      port: u.port ? parseInt(u.port, 10) : 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ""),
      connectTimeout: 5000,
    });
    await conn.query("SELECT 1");
    await conn.end();
    checks.database = "ok";
  } catch (e) {
    checks.database = `ERROR: ${(e as Error).message}`;
  }

  const allOk = Object.values(checks).every((v) => v === "ok");
  return NextResponse.json({ status: allOk ? "ok" : "degraded", checks });
}
