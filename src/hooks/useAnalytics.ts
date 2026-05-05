"use client";

import useSWRLike from "./useSWRLike";

export function useAnalytics(pageId: string, range = "30d") {
  return useSWRLike(pageId ? `/api/analytics/${pageId}?range=${range}` : null);
}
