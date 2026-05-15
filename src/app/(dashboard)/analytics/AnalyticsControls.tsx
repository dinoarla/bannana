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
      className="anl-page-select"
    >
      {pages.map((p) => (
        <option key={p.id} value={p.id}>{p.title}</option>
      ))}
      <option value="">Semua Halaman</option>
    </select>
  );
}
