"use client";

import { useRouter } from "next/navigation";

type Page = { id: string; title: string };

export function AnalyticsPageSelector({ pages, activePageId }: { pages: Page[]; activePageId: string }) {
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const url = new URL(location.href);
    url.searchParams.set("pageId", e.target.value);
    router.push(url.toString());
  }

  if (pages.length === 0) return null;

  return (
    <select
      defaultValue={activePageId}
      onChange={onChange}
      style={{ height: 36, border: "1.5px solid var(--n-200)", borderRadius: 9, padding: "0 10px", fontSize: ".84rem", fontFamily: "var(--fb)", color: "var(--n-700)", cursor: "pointer", outline: "none", background: "var(--n-0)" }}
    >
      {pages.map((p) => (
        <option key={p.id} value={p.id}>{p.title}</option>
      ))}
      <option value="">Semua Halaman</option>
    </select>
  );
}
