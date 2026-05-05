"use client";

import useSWRLike from "./useSWRLike";
import type { PublicBlock } from "@/types";

export function useBlocks(pageId: string) {
  return useSWRLike<PublicBlock[]>(pageId ? `/api/pages/${pageId}/blocks` : null);
}
