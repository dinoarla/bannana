"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PageActions({ pageId, isPublished }: { pageId: string; isPublished: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function csrf() {
    return document.cookie
      .split("; ")
      .find((r) => r.startsWith("bid_csrf="))
      ?.split("=")[1] ?? "";
  }

  async function togglePublish() {
    setLoading(true);
    try {
      await fetch(`/api/pages/${pageId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": decodeURIComponent(csrf()) },
        body: JSON.stringify({ publish: !isPublished }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function deletePage() {
    if (!confirm("Hapus halaman ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setLoading(true);
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": decodeURIComponent(csrf()) },
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: ".5rem" }}>
      <button
        onClick={togglePublish}
        disabled={loading}
        style={{
          flex: 1, height: 33, borderRadius: 9, fontSize: ".75rem", fontWeight: 700,
          border: "1.5px solid var(--n-200)", cursor: "pointer",
          background: isPublished ? "#FEF2F2" : "#D1FAE5",
          color: isPublished ? "#B91C1C" : "#065F46",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        }}
      >
        <i className={`fa-solid ${isPublished ? "fa-eye-slash" : "fa-globe"}`} />
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={deletePage}
        disabled={loading}
        style={{
          width: 33, height: 33, flexShrink: 0, borderRadius: 9,
          background: "#FEF2F2", color: "#B91C1C", border: "1.5px solid #FECDD3",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <i className="fa-solid fa-trash" />
      </button>
    </div>
  );
}
