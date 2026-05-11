import { assertSessionUser } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";
import { sha256 } from "@/lib/utils/hash";
import { cookies } from "next/headers";
import { verifyCsrf } from "@/lib/csrf/token";

export async function GET() {
  try {
    const user = await assertSessionUser();
    const [rows] = await db.query(
      "SELECT id, createdAt, expiresAt FROM Session WHERE userId = ? AND expiresAt > NOW() ORDER BY createdAt DESC",
      [user.id]
    );
    const jar = await cookies();
    const currentToken = jar.get(SESSION_COOKIE)?.value;
    const currentHash = currentToken ? sha256(currentToken) : null;

    const [allRows] = await db.query(
      "SELECT id, tokenHash, createdAt, expiresAt FROM Session WHERE userId = ? AND expiresAt > NOW() ORDER BY createdAt DESC",
      [user.id]
    );

    const sessions = (allRows as Record<string, unknown>[]).map((s) => ({
      id: s.id as string,
      createdAt: s.createdAt as Date,
      expiresAt: s.expiresAt as Date,
      isCurrent: s.tokenHash === currentHash,
    }));

    return ok(sessions);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { sessionId } = await request.json() as { sessionId: string };
    await db.query("DELETE FROM Session WHERE id = ? AND userId = ?", [sessionId, user.id]);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
