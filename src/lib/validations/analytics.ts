import { z } from "zod";

export const trackSchema = z.object({
  pageId: z.string(),
  blockId: z.string().optional(),
  event: z.enum(["view", "click"])
});
