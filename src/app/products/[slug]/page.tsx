import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ChevronRight, Truck, ShieldCheck, FileText, ClipboardList } from "lucide-react";
import { db, schema } from "@/db";
import { ProductVisual } from "@/components/product-visual";
import { AddToCart } from "@/components/add-to-cart";
import { categoryLabel } from "@/lib/catalog";
import { won, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <div className="container-x pt-6">
      <Suspense fallback={<div className="mt-6 grid gap-8 md:grid-cols-2"><div className="aspect-[4/3] animate-pulse rounded-3xl bg-surface-2" /><div className="h-80 animate-pulse rounded-3xl bg-surface-2" /></div>}>
        <Detail params={params} />
      </Suspense>
    </div>
  );
}

async function Detail({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const [p] = await db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.slug, slug), eq(schema.products.isActive, true)));
  if (!p) notFound();
  const quote = p.saleType === "quote";

  return (
    <>
      <nav className="flex items-center gap-1 text-sm text-muted" aria-label="경로">
        <Link href="/products" className="hover:text-ink">제품몰</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/products?category=${p.category}`} className="hover:text-ink">{categoryLabel(p.category)}</Link>
      </nav>
      <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductVisual category={p.category} className="rounded-3xl" />
        <div>
          {p.badge && <span className="chip border-brand/20 bg-brand-soft font-semibold text-brand">{p.badge}</span>}
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{p.name}</h1>
          <p className="mt-2 text-lg text-muted">{p.summary}</p>
          <div className="mt-6 text-3xl font-extrabold">{quote ? <span className="text-brand">견적 문의 상품</span> : won(p.price)}</div>
          {quote ? (
            <div className="mt-6 space-y-3">
              <p className="text-muted">온실 규모와 설비 구성에 따라 가격이 달라집니다. 견적을 요청하시면 담당자가 1영업일 안에 연락드립니다.</p>
              <Link href={`/quote?product=${p.slug}`} className="btn-primary w-full sm:w-auto">
                <ClipboardList className="h-4 w-4" /> 이 제품으로 견적 요청
              </Link>
            </div>
          ) : (
            <AddToCart product={{ productId: p.id, slug: p.slug, name: p.name, price: p.price, category: p.category }} stock={p.stock} />
          )}
          <ul className="mt-8 grid gap-3 text-[15px]">
            <li className="flex items-center gap-2"><Truck className="h-5 w-5 text-brand" /> {won(FREE_SHIPPING_THRESHOLD)} 이상 무료배송 · 평일 14시 이전 결제 시 당일 출고</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand" /> 제조사 직판 정품 · 1년 무상 A/S</li>
            <li className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand" /> 사업자 회원 세금계산서 발행</li>
          </ul>
        </div>
      </div>
      <section className="mt-14 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-xl font-bold">제품 설명</h2>
          <p className="mt-3 whitespace-pre-line text-ink/85">{p.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">사양</h2>
          <dl className="card mt-3 divide-y divide-line">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-5 py-3 text-[15px]">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-[12px] text-muted">사양의 (예시) 표기는 데모용 값입니다.</p>
        </div>
      </section>
    </>
  );
}
