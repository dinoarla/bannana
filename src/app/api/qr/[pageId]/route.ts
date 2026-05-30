import QRCode from "qrcode";
import { assertSessionUser } from "@/lib/auth/session";
import { errors } from "@/lib/errors/AppError";
import { PageService } from "@/lib/services/PageService";

type Context = { params: Promise<{ pageId: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bannana.id";
    const url = `${baseUrl}/${page.slug}`;

    const buffer = await QRCode.toBuffer(url, {
      type: "png",
      width: 400,
      margin: 2,
      color: { dark: "#1C1409", light: "#FFFFFF" },
    });

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=300",
        "Content-Disposition": `inline; filename="qr-${page.slug}.png"`,
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
