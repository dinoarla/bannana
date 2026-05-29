"use client";

import { useRouter } from "next/navigation";

type Page = { id: string; title: string };

export function ThemePageSelector({ pages, activePageId }: { pages: Page[]; activePageId: string }) {
  const router = useRouter();

  if (pages.length <= 1) return null;

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/themes?pageId=${e.target.value}`);
  }

  return (
    <select defaultValue={activePageId} onChange={onChange} className="anl-page-select">
      {pages.map((p) => (
        <option key={p.id} value={p.id}>{p.title}</option>
      ))}
    </select>
  );
}
