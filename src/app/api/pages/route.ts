import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { PageService } from "@/lib/services/PageService";
import { created, ok } from "@/lib/utils/response";
import { pageCreateSchema } from "@/lib/validations/page";

export async function GET() {
  try {
    const user = await assertSessionUser();
    return ok(await new PageService().list(user.id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const input = pageCreateSchema.parse(await request.json());
    return created(await new PageService().create(user.id, input));
  } catch (error) {
    return handleApiError(error);
  }
}
