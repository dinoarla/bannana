import { z } from "zod";

export const pageCreateSchema = z.object({
  title: z.string().min(1).max(80),
  slug: z.string().min(3).max(80).optional()
});

export const pageUpdateSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  slug: z.string().min(3).max(80).optional(),
  theme: z.string().min(1).max(40).optional(),
  customCss: z.string().max(5120).optional(),
  avatarUrl: z.string().max(400000).nullable().optional(),
  isPublished: z.boolean().optional()
});

export const publishSchema = z.object({
  publish: z.boolean()
});
