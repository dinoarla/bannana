"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn btn-ghost btn-sm"
      style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem", cursor: "pointer" }}
    >
      <i className={`fa-solid ${copied ? "fa-check" : "fa-link"}`} />
      {copied ? "Tersalin!" : "Salin Link"}
    </button>
  );
}
