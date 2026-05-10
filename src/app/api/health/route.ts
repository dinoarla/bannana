import { NextResponse } from "next/server";
import { parseDbUrl } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.DATABASE_URL = process.env.DATABASE_URL ? "ok" : "MISSING";
  checks.NEXTAUTH_URL  = process.env.NEXTAUTH_URL  ? "ok" : "MISSING";
  checks.CSRF_SECRET   = process.env.CSRF_SECRET   ? "ok" : "MISSING";

  const rawUrl = process.env.DATABASE_URL ?? "";
  checks.db_url_length = String(rawUrl.trim().length);

  try {
    const config = parseDbUrl(rawUrl);
    checks.db_host = config.host as string;
    checks.db_user = config.user as string;
    checks.db_database = config.database as string;

    const mysql = await import("mysql2/promise");
    const conn = await mysql.createConnection({ ...config, connectTimeout: 5000 });
    await conn.query("SELECT 1");
    await conn.end();
    checks.database = "ok";
  } catch (e) {
    checks.database = `ERROR: ${(e as Error).message}`;
  }

  const allOk = ["DATABASE_URL","NEXTAUTH_URL","CSRF_SECRET","database"].every((k) => checks[k] === "ok");
  return NextResponse.json({ status: allOk ? "ok" : "degraded", checks });
}
