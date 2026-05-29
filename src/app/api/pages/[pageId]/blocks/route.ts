import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { errors } from "@/lib/errors/AppError";
import { BlockService } from "@/lib/services/BlockService";
import { PageService } from "@/lib/services/PageService";
import { db } from "@/lib/db/client";
import { created, ok } from "@/lib/utils/response";
import { blockCreateSchema } from "@/lib/validations/block";

type Context = { params: Promise<{ pageId: string }> };

const FREE_BLOCK_LIMIT = 10;

export async function GET(_request: Request, context: Context) {
  try {
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();
    return ok(await new BlockService().list(pageId));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: Context) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { pageId } = await context.params;

    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();

    let isPro = false;
    try {
      const [subRows] = await db.query(
        "SELECT plan, status FROM Subscription WHERE userId = ? AND status = 'active' LIMIT 1",
        [user.id]
      );
      const sub = (subRows as Record<string, unknown>[])[0];
      isPro = sub?.plan === "pro";
    } catch { /* Subscription table may not exist yet */ }

    if (!isPro) {
      const [countRows] = await db.query(
        "SELECT COUNT(*) as c FROM Block WHERE pageId = ?",
        [pageId]
      );
      const count = Number((countRows as Record<string, unknown>[])[0]?.c ?? 0);
      if (count >= FREE_BLOCK_LIMIT) {
        throw errors.forbidden(`Paket Gratis hanya bisa ${FREE_BLOCK_LIMIT} blok. Upgrade ke Pro untuk blok tak terbatas.`);
      }
    }

    const input = blockCreateSchema.parse(await request.json());
    return created(await new BlockService().create(pageId, { ...input, config: input.config as Record<string, unknown> }));
  } catch (error) {
    return handleApiError(error);
  }
}
