import { prisma } from "@/lib/db/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  // env vars
  checks.DATABASE_URL    = process.env.DATABASE_URL    ? "ok" : "MISSING";
  checks.NEXTAUTH_URL    = process.env.NEXTAUTH_URL    ? "ok" : "MISSING";
  checks.CSRF_SECRET     = process.env.CSRF_SECRET     ? "ok" : "MISSING";

  // database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch (e) {
    checks.database = `ERROR: ${(e as Error).message}`;
  }

  const allOk = Object.values(checks).every(v => v === "ok");

  return NextResponse.json(
    { status: allOk ? "ok" : "degraded", checks },
    { status: allOk ? 200 : 500 }
  );
}
