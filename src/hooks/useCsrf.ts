"use client";

export function useCsrf() {
  const token = typeof document === "undefined"
    ? undefined
    : document.cookie.split("; ").find((item) => item.startsWith("bid_csrf="))?.split("=")[1];
  return token ? decodeURIComponent(token) : undefined;
}
