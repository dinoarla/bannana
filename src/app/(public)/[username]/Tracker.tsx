"use client";
import { useEffect } from "react";

export function Tracker({ pageId }: { pageId: string }) {
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, event: "view" }),
    }).catch(() => {});
  }, [pageId]);
  return null;
}
