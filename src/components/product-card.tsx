import Link from "next/link";
import type { Product } from "@/db/schema";
import { ProductVisual } from "./product-visual";
import { categoryLabel } from "@/lib/catalog";
import { won } from "@/lib/pricing";

export function ProductCard({ p }: { p: Product }) {
  const quote = p.saleType === "quote";
  return (
    <Link href={`/products/${p.slug}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(15,60,30,.4)]">
      <div className="relative">
        <ProductVisual category={p.category} />
        {p.badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[12px] font-bold ${quote ? "bg-accent text-accent-ink" : "bg-surface text-brand"}`}>
            {p.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[13px] text-muted">{categoryLabel(p.category)}</span>
        <h3 className="mt-0.5 font-bold leading-snug">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-[14px] text-muted">{p.summary}</p>
        <div className="mt-auto pt-3 text-lg font-extrabold">
          {quote ? <span className="text-brand">견적 문의</span> : won(p.price)}
        </div>
        {!quote && p.stock <= 0 && <span className="text-sm font-semibold text-danger">품절</span>}
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] animate-pulse bg-surface-2" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}
