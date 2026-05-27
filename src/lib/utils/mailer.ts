import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const from = process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? "noreply@bannana.id";
  await transport.sendMail({
    from: `bannana.id <${from}>`,
    to,
    subject: "Verifikasi Email bannana.id",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FFFBEB;border-radius:16px">
        <div style="font-size:2rem;margin-bottom:8px">🍌</div>
        <h2 style="margin:0 0 8px;color:#1C1409">Verifikasi Emailmu</h2>
        <p style="color:#78716C;margin:0 0 24px;line-height:1.6">
          Terima kasih sudah daftar di bannana.id!<br>
          Klik tombol di bawah untuk verifikasi emailmu — link berlaku <strong>24 jam</strong>.
        </p>
        <a href="${verifyUrl}" style="display:inline-block;background:#F59E0B;color:#1C1409;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
          Verifikasi Email Sekarang
        </a>
        <p style="margin:24px 0 0;font-size:12px;color:#A8A29E">
          Kalau kamu tidak mendaftar, abaikan email ini saja.<br>
          Link: <a href="${verifyUrl}" style="color:#F59E0B">${verifyUrl}</a>
        </p>
      </div>
    `,
  });
  return true;
}

export async function sendPaymentReminderEmail(
  to: string,
  opts: { displayName: string; billingCycle: "monthly" | "yearly" | string; checkoutUrl: string }
): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const from = process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? "noreply@bannana.id";
  const isYearly = opts.billingCycle === "yearly";
  const price = isYearly ? "Rp 150.000 / tahun" : "Rp 15.000 / bulan";
  const cycleLabel = isYearly ? "Tahunan" : "Bulanan";

  await transport.sendMail({
    from: `bannana.id <${from}>`,
    to,
    subject: "Lanjutkan pembayaran Pro bannana.id 🍌",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#FFFBEB;border-radius:16px">
        <div style="font-size:2rem;margin-bottom:8px">🍌</div>
        <h2 style="margin:0 0 8px;color:#1C1409">Halo ${opts.displayName}!</h2>
        <p style="color:#78716C;margin:0 0 20px;line-height:1.6">
          Kami melihat kamu sudah memilih paket <strong style="color:#1C1409">bannana.id Pro ${cycleLabel}</strong>,
          tapi pembayarannya belum diselesaikan. Yuk lanjutkan supaya bisa nikmati semua fitur Pro!
        </p>
        <div style="background:#fff;border:1.5px solid #FDE68A;border-radius:12px;padding:16px 20px;margin:0 0 24px">
          <div style="font-size:12px;color:#A8A29E;text-transform:uppercase;letter-spacing:.04em;font-weight:700;margin-bottom:4px">Paket Kamu</div>
          <div style="font-weight:700;color:#1C1409;font-size:1.1rem">Pro ${cycleLabel}</div>
          <div style="color:#D97706;font-weight:700;margin-top:2px">${price}</div>
        </div>
        <a href="${opts.checkoutUrl}" style="display:inline-block;background:#F59E0B;color:#1C1409;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
          Lanjutkan Pembayaran
        </a>
        <p style="margin:24px 0 0;font-size:12px;color:#A8A29E;line-height:1.6">
          Kalau kamu sudah berhasil bayar, abaikan email ini. Pertanyaan? Balas email ini saja.
        </p>
      </div>
    `,
  });
  return true;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const from = process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? "noreply@bannana.id";
  await transport.sendMail({
    from: `bannana.id <${from}>`,
    to,
    subject: "Reset Password bannana.id",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FFFBEB;border-radius:16px">
        <div style="font-size:2rem;margin-bottom:8px">🍌</div>
        <h2 style="margin:0 0 8px;color:#1C1409">Reset Password</h2>
        <p style="color:#78716C;margin:0 0 24px;line-height:1.6">
          Kamu minta reset password untuk akun bannana.id kamu.<br>
          Klik tombol di bawah — link hanya berlaku <strong>1 jam</strong>.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#F59E0B;color:#1C1409;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
          Reset Password Sekarang
        </a>
        <p style="margin:24px 0 0;font-size:12px;color:#A8A29E">
          Kalau kamu tidak meminta ini, abaikan email ini saja.<br>
          Link: <a href="${resetUrl}" style="color:#F59E0B">${resetUrl}</a>
        </p>
      </div>
    `,
  });
  return true;
}
