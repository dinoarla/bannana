import { db } from "@/lib/db/client";
import { createHash } from "crypto";

function verifySignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string, signature: string): boolean {
  const hash = createHash("sha512").update(`${orderId}${statusCode}${grossAmount}${serverKey}`).digest("hex");
  return hash === signature;
}

export async function POST(request: Request) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
    const body = await request.json() as Record<string, string>;
    const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type } = body;

    if (!verifySignature(order_id, status_code, gross_amount, serverKey, signature_key)) {
      return new Response("Invalid signature", { status: 403 });
    }

    if (!order_id?.startsWith("SUB-")) {
      return new Response("OK", { status: 200 });
    }

    const [rows] = await db.query(
      "SELECT id, userId, billingCycle FROM Subscription WHERE midtransOrderId = ? LIMIT 1",
      [order_id]
    );
    const sub = (rows as Record<string, unknown>[])[0];
    if (!sub) return new Response("Not found", { status: 404 });

    if (transaction_status === "settlement" || transaction_status === "capture") {
      const billingCycle = sub.billingCycle as string;
      const now = new Date();
      const periodEnd = new Date(now);
      if (billingCycle === "yearly") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }
      await db.query(
        "UPDATE Subscription SET status='active', midtransPaymentType=?, currentPeriodStart=?, currentPeriodEnd=?, updatedAt=NOW() WHERE id=?",
        [payment_type ?? null, now, periodEnd, sub.id as string]
      );
    } else if (["deny", "cancel", "expire", "failure"].includes(transaction_status)) {
      await db.query(
        "UPDATE Subscription SET status='expired', updatedAt=NOW() WHERE id=?",
        [sub.id as string]
      );
    }

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
