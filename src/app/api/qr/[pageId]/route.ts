import QRCode from "qrcode";
import { assertSessionUser } from "@/lib/auth/session";
import { errors } from "@/lib/errors/AppError";
import { PageService } from "@/lib/services/PageService";

type Context = { params: Promise<{ pageId: string }> };

function escXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET(request: Request, context: Context) {
  try {
    const user = await assertSessionUser();
    const { pageId } = await context.params;
    const page = await new PageService().get(pageId);
    if (page.userId !== user.id) throw errors.forbidden();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bannana.id";
    const url = `${baseUrl}/${page.slug}`;
    const isCard = new URL(request.url).searchParams.get("card") === "1";

    if (!isCard) {
      // Plain PNG for thumbnail preview
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
    }

    // Branded card — generate QR as SVG, embed in styled card
    const qrSvg = await QRCode.toString(url, {
      type: "svg",
      width: 280,
      margin: 1,
      color: { dark: "#1C1409", light: "#FDE68A" },
    });
    const qrDataUrl = `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString("base64")}`;

    const title = escXml(page.title.length > 30 ? page.title.slice(0, 27) + "…" : page.title);
    const slugLine = escXml(`bannana.id/${page.slug}`);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="550" viewBox="0 0 400 550" xmlns="http://www.w3.org/2000/svg">
  <!-- Card background -->
  <rect width="400" height="550" rx="22" fill="#FFFBEB"/>

  <!-- Outer border -->
  <rect x="5" y="5" width="390" height="540" rx="18" fill="none" stroke="#92400E" stroke-width="2.5"/>

  <!-- Inner border -->
  <rect x="13" y="13" width="374" height="524" rx="12" fill="none" stroke="#F59E0B" stroke-width="1.5"/>

  <!-- Header rounded-top bar -->
  <path d="M25,13 L375,13 Q387,13 387,25 L387,86 L13,86 L13,25 Q13,13 25,13 Z" fill="#F59E0B"/>

  <!-- Banana emoji area -->
  <text x="200" y="44" text-anchor="middle" font-family="Arial, sans-serif" font-size="22">🍌</text>

  <!-- SCAN ME text -->
  <text x="200" y="75" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="bold" fill="#1C1409" letter-spacing="3">SCAN ME</text>

  <!-- QR container card -->
  <rect x="26" y="100" width="348" height="316" rx="14" fill="#FDE68A" stroke="#F59E0B" stroke-width="2"/>

  <!-- QR code image -->
  <image x="58" y="108" width="284" height="300" href="${qrDataUrl}"/>

  <!-- Divider -->
  <line x1="26" y1="430" x2="374" y2="430" stroke="#F59E0B" stroke-width="1.5"/>

  <!-- Page title -->
  <text x="200" y="462" text-anchor="middle" font-family="Arial, 'Helvetica Neue', sans-serif" font-size="14" font-weight="700" fill="#1C1409">${title}</text>

  <!-- URL -->
  <text x="200" y="484" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="12" fill="#92400E">${slugLine}</text>

  <!-- Branding footer -->
  <rect x="13" y="505" width="374" height="32" rx="0" fill="#FEF3C7"/>
  <rect x="13" y="505" width="374" height="32" rx="0" fill="none"/>
  <path d="M13,505 L387,505 L387,537 Q387,537 375,537 L25,537 Q13,537 13,537 L13,505 Z" fill="#FEF3C7"/>
  <path d="M25,537 L375,537 Q387,537 387,525 L387,505 L13,505 L13,525 Q13,537 25,537 Z" fill="#FEF3C7"/>
  <text x="200" y="527" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#B45309" font-weight="600">Dibuat dengan bannana.id — gratis selamanya</text>
</svg>`;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "private, max-age=300",
        "Content-Disposition": `attachment; filename="qr-${page.slug}.svg"`,
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
