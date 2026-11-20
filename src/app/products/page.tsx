import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import { Search } from "lucide-react";
import { db, schema } from "@/db";
import { categories } from "@/lib/catalog";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";

export const metadata: Metadata = { title: "제품몰" };

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <div className="container-x pt-10">
      <p className="eyebrow">제품몰</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">부품은 바로 결제, 시스템은 견적으로</h1>
      <p className="mt-2 text-muted">5만원 이상 무료배송 · 사업자 회원 세금계산서 발행</p>
      <Suspense fallback={<ListSkeleton />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function ProductList({ searchParams }: Pick<PageProps<"/products">, "searchParams">) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 50) : "";
  const conds = [eq(schema.products.isActive, true)];
  if (categories.some((c) => c.key === category)) conds.push(eq(schema.products.category, category as never));
  if (q) conds.push(or(ilike(schema.products.name, `%${q}%`), ilike(schema.products.summary, `%${q}%`))!);
  const items = await db.select().from(schema.products).where(and(...conds)).orderBy(asc(schema.products.sort));

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="카테고리">
          <CatLink href="/products" active={!category} label="전체" />
          {categories.map((c) => (
            <CatLink key={c.key} href={`/products?category=${c.key}`} active={category === c.key} label={c.label} />
          ))}
        </div>
        <form action="/products" className="relative md:w-72">
          {category && <input type="hidden" name="category" value={category} />}
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} placeholder="제품명 검색" className="input rounded-full pl-10" aria-label="제품 검색" />
        </form>
      </div>
      {items.length === 0 ? (
        <p className="card mt-8 p-10 text-center text-muted">조건에 맞는 제품이 없습니다.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}

function CatLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-[15px] font-semibold transition ${active ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-ink hover:bg-surface-2"}`}
    >
      {label}
    </Link>
  );
}
