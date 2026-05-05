import { Eye, Plus } from "lucide-react";
import Link from "next/link";

export function Topbar({ title, publicHref }: { title: string; publicHref?: string }) {
  return (
    <div className="topbar">
      <div className="section-title" style={{ flex: 1 }}>{title}</div>
      <div style={{ display: "flex", gap: ".625rem", alignItems: "center" }}>
        {publicHref && (
          <Link href={publicHref} target="_blank" className="btn btn-ghost btn-sm">
            <Eye size={15} /> Preview
          </Link>
        )}
        <Link href="/pages/new" className="btn btn-primary btn-sm">
          <Plus size={15} /> Halaman Baru
        </Link>
      </div>
    </div>
  );
}
