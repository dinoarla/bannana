import { z } from "zod";

export const blockCreateSchema = z.object({
  type: z.enum(["LINK", "HEADER", "SOCIAL", "EMBED", "IMAGE", "DIVIDER", "TEXT", "COUNTDOWN", "FAQ", "CONTACT", "PRODUCT", "BANNER", "MAP", "FORM"]),
  title: z.string().max(140).nullable().optional(),
  url: z.string().max(2048).nullable().optional(),
  config: z.record(z.unknown()).default({})
});

export const blockUpdateSchema = z.object({
  title: z.string().max(140).nullable().optional(),
  url: z.string().max(2048).nullable().optional(),
  isEnabled: z.boolean().optional(),
  config: z.record(z.unknown()).optional()
});

export const reorderSchema = z.array(z.object({
  id: z.string(),
  position: z.number().int().min(1)
}));
