// Quick SMTP connection test — run with: node scripts/test-smtp.mjs
import { createTransport } from "nodemailer";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

// Parse .env manually
const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, "")];
    })
);

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } = env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("❌  SMTP_HOST, SMTP_USER, or SMTP_PASS not set in .env");
  process.exit(1);
}

const transporter = createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT ?? "465", 10),
  secure: SMTP_SECURE === "true",
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

console.log(`Testing SMTP: ${SMTP_USER} → ${SMTP_HOST}:${SMTP_PORT} (secure=${SMTP_SECURE})`);

try {
  await transporter.verify();
  console.log("✅  SMTP connection OK");

  await transporter.sendMail({
    from: `bannana.id <${SMTP_FROM ?? SMTP_USER}>`,
    to: SMTP_USER,
    subject: "bannana.id — SMTP Test",
    html: `<p>SMTP berfungsi dengan baik. Test dari script lokal.</p>`,
  });
  console.log(`✅  Test email sent to ${SMTP_USER}`);
} catch (err) {
  console.error("❌  SMTP error:", err.message);
  process.exit(1);
}
