import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";
import { sha256, randomToken } from "@/lib/utils/hash";
import { z } from "zod";

export async function GET() {
  try {
    const user = await assertSessionUser();
    const [rows] = await db.query(
      "SELECT id, name, scopes, lastUsedAt, createdAt, revokedAt FROM ApiKey WHERE userId = ? ORDER BY createdAt DESC",
      [user.id]
    );
    const keys = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      name: r.name as string,
      scopes: typeof r.scopes === "string" ? JSON.parse(r.scopes as string) : (r.scopes ?? []),
      lastUsedAt: r.lastUsedAt as Date | null,
      createdAt: r.createdAt as Date,
      revokedAt: r.revokedAt as Date | null,
    }));
    return ok(keys);
  } catch (error) {
    return handleApiError(error);
  }
}

const createSchema = z.object({ name: z.string().min(1).max(64) });

export async function POST(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { name } = createSchema.parse(await request.json());

    const rawKey = `bna_${randomToken(32)}`;
    const id = crypto.randomUUID();
    const now = new Date();
    await db.query(
      "INSERT INTO ApiKey (id, userId, name, keyHash, scopes, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [id, user.id, name, sha256(rawKey), JSON.stringify(["analytics:read", "pages:read"]), now]
    );
    return ok({ id, name, rawKey, createdAt: now });
  } catch (error) {
    return handleApiError(error);
  }
}
