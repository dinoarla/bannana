import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.DATABASE_URL = process.env.DATABASE_URL ? "ok" : "MISSING";
  checks.NEXTAUTH_URL  = process.env.NEXTAUTH_URL  ? "ok" : "MISSING";
  checks.CSRF_SECRET   = process.env.CSRF_SECRET   ? "ok" : "MISSING";

  // Diagnose the raw DATABASE_URL value
  const rawUrl = process.env.DATABASE_URL ?? "";
  checks.db_url_length = String(rawUrl.length);
  checks.db_url_preview = rawUrl.slice(0, 30).replace(/:[^@]+@/, ":***@");

  try {
    // Strip surrounding quotes and whitespace if Hostinger added them
    const clean = rawUrl.trim().replace(/^["']|["']$/g, "");
    const u = new URL(clean);
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

  const allOk = ["DATABASE_URL","NEXTAUTH_URL","CSRF_SECRET","database"].every((k) => checks[k] === "ok");
  return NextResponse.json({ status: allOk ? "ok" : "degraded", checks });
}
