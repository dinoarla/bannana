import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email belum valid."),
  username: z.string().min(3, "Username minimal 3 karakter.").regex(/^[a-z0-9_/-]+$/i, "Username hanya boleh huruf, angka, _, -, atau /."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  displayName: z.string().max(80).optional(),
  confirmPassword: z.string().min(8).optional(),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak sama.",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
