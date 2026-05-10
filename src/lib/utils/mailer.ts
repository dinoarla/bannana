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

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@bannana.id";
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
