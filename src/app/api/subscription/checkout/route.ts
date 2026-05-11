import { assertSessionUser } from "@/lib/auth/session";
import { verifyCsrf } from "@/lib/csrf/token";
import { handleApiError } from "@/lib/errors/errorHandler";
import { ok } from "@/lib/utils/response";
import { db } from "@/lib/db/client";
import { z } from "zod";

const checkoutSchema = z.object({
  billingCycle: z.enum(["monthly", "yearly"]),
});

const PRICES = { monthly: 15000, yearly: 150000 };
const LABELS = { monthly: "bannana.id Pro — Bulanan", yearly: "bannana.id Pro — Tahunan" };

export async function POST(request: Request) {
  try {
    await verifyCsrf();
    const user = await assertSessionUser();
    const { billingCycle } = checkoutSchema.parse(await request.json());

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    if (!serverKey) {
      return Response.json({ success: false, error: { message: "Payment gateway belum dikonfigurasi." } }, { status: 503 });
    }

    const orderId = `SUB-${user.id.slice(0, 8)}-${Date.now()}`;
    const amount = PRICES[billingCycle];
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const payload = {
      transaction_details: { order_id: orderId, gross_amount: amount },
      item_details: [{ id: `PRO_${billingCycle.toUpperCase()}`, price: amount, quantity: 1, name: LABELS[billingCycle] }],
      customer_details: { email: user.email },
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL ?? "https://bannana.id"}/settings?tab=langganan&status=success`,
      },
    };

    const res = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json() as { token?: string; redirect_url?: string; error_messages?: string[] };
    if (!data.token) {
      return Response.json({ success: false, error: { message: data.error_messages?.[0] ?? "Gagal membuat transaksi." } }, { status: 502 });
    }

    await db.query(
      `INSERT INTO Subscription (id, userId, plan, billingCycle, status, midtransOrderId, createdAt, updatedAt)
       VALUES (?, ?, 'pro', ?, 'pending', ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE billingCycle=VALUES(billingCycle), status='pending', midtransOrderId=VALUES(midtransOrderId), updatedAt=NOW()`,
      [crypto.randomUUID(), user.id, billingCycle, orderId]
    );

    return ok({ snapToken: data.token, clientKey: process.env.MIDTRANS_CLIENT_KEY ?? "", isProduction });
  } catch (error) {
    return handleApiError(error);
  }
}
