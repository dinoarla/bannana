"use client";

import { useState } from "react";

export function ShareFab({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof navigator.share !== "undefined") {
      navigator.share({ title: `${name} — bannana.id`, url: location.href });
    } else {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button className="share-fab" onClick={share} title="Bagikan halaman ini">
      <i className={`fa-solid ${copied ? "fa-check" : "fa-share-nodes"}`} />
    </button>
  );
}
