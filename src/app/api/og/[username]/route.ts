import { db } from "@/lib/db/client";
import { readFileSync } from "fs";
import { join } from "path";

type Params = Promise<{ username: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { username } = await params;

  try {
    const [rows] = await db.query(
      "SELECT p.avatarUrl FROM User u LEFT JOIN Profile p ON p.userId = u.id WHERE u.username = ? LIMIT 1",
      [username]
    );
    const row = (rows as Record<string, unknown>[])[0];
    const avatarUrl = row?.avatarUrl as string | null;

    if (avatarUrl && avatarUrl.startsWith("data:image/")) {
      const [meta, base64] = avatarUrl.split(",");
      const mimeMatch = meta.match(/data:(image\/[a-z+]+);/);
      const mime = mimeMatch?.[1] ?? "image/jpeg";
      const buffer = Buffer.from(base64, "base64");
      return new Response(buffer, {
        headers: {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  } catch {
    // fall through to default
  }

  // Serve og-default.png as fallback
  try {
    const png = readFileSync(join(process.cwd(), "public/og-default.png"));
    return new Response(png, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
