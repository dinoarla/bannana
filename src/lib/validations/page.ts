import { z } from "zod";

export const pageCreateSchema = z.object({
  title: z.string().min(1).max(80),
  slug: z.string().min(3).max(80).optional()
});

const socialLinkSchema = z.object({
  icon: z.string().min(1).max(40),
  label: z.string().min(1).max(80),
  url: z.string().url().max(500),
  color: z.string().max(20).optional(),
});

export const pageUpdateSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  bio: z.string().max(300).nullable().optional(),
  slug: z.string().min(3).max(80).optional(),
  theme: z.string().min(1).max(40).optional(),
  customCss: z.string().max(5120).optional(),
  avatarUrl: z.string().max(600000).nullable().optional(),
  isPublished: z.boolean().optional(),
  displayName: z.string().max(100).nullable().optional(),
  website: z.string().url().max(255).nullable().optional(),
  socialLinks: z.array(socialLinkSchema).max(10).nullable().optional(),
});

export const publishSchema = z.object({
  publish: z.boolean()
});
