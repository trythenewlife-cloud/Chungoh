import Link from "next/link";
import { Suspense } from "react";
import { and, desc, eq, gte, lte, sql, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { won } from "@/lib/pricing";
import { quoteStatusLabel } from "@/lib/catalog";
import { StatusBadge } from "@/components/status-badge";
import { AdminSkeleton } from "./skeleton";

export default function AdminHome() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d30 = new Date(now.getTime() - 30 * 86400_000);
  const paidStatuses = sql`${schema.orders.status} in ('paid','preparing','shipping','delivered')`;

  const [[today], [month], [newQuotes], [toShip], recent, quotes, lowStock] = await Promise.all([
    db.select({ sum: sql<number>`coalesce(sum(${schema.orders.total}),0)::int`, n: sql<number>`count(*)::int` }).from(schema.orders).where(and(paidStatuses, gte(schema.orders.paidAt, start))),
    db.select({ sum: sql<number>`coalesce(sum(${schema.orders.total}),0)::int`, n: sql<number>`count(*)::int` }).from(schema.orders).where(and(paidStatuses, gte(schema.orders.paidAt, d30))),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.quotes).where(eq(schema.quotes.status, "new")),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.orders).where(sql`${schema.orders.status} in ('paid','preparing')`),
    db.select().from(schema.orders).where(ne(schema.orders.status, "pending")).orderBy(desc(schema.orders.createdAt)).limit(6),
    db.select().from(schema.quotes).orderBy(desc(schema.quotes.createdAt)).limit(5),
    db.select().from(schema.products).where(and(eq(schema.products.saleType, "buy"), eq(schema.products.isActive, true), lte(schema.products.stock, 10))).limit(5),
  ]);

  const kpis = [
    { l: "오늘 매출", v: won(today.sum), s: `${today.n}건` },
    { l: "최근 30일 매출", v: won(month.sum), s: `${month.n}건` },
    { l: "출고 대기", v: `${toShip.n}건`, s: "결제완료·배송준비", href: "/admin/orders?status=paid" },
    { l: "신규 견적", v: `${newQuotes.n}건`, s: "연락 필요", href: "/admin/quotes?status=new" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => {
          const body = (
            <>
              <div className="text-sm text-muted">{k.l}</div>
              <div className="mt-1 text-2xl font-extrabold tabular-nums">{k.v}</div>
              <div className="text-[13px] text-muted">{k.s}</div>
            </>
          );
          return k.href ? <Link key={k.l} href={k.href} className="card p-5 hover:border-brand">{body}</Link> : <div key={k.l} className="card p-5">{body}</div>;
        })}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex justify-between"><h2 className="font-bold">최근 주문</h2><Link href="/admin/orders" className="text-sm text-brand">전체</Link></div>
          <ul className="mt-3 divide-y divide-line">
            {recent.length === 0 && <li className="py-6 text-center text-muted">주문이 없습니다</li>}
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                  <span className="min-w-0 truncate">{o.orderName}</span>
                  <span className="flex shrink-0 items-center gap-2"><span className="tabular-nums">{won(o.total)}</span><StatusBadge status={o.status} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <div className="flex justify-between"><h2 className="font-bold">최근 견적 요청</h2><Link href="/admin/quotes" className="text-sm text-brand">전체</Link></div>
          <ul className="mt-3 divide-y divide-line">
            {quotes.length === 0 && <li className="py-6 text-center text-muted">견적 요청이 없습니다</li>}
            {quotes.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                <span className="min-w-0 truncate">{q.region} · {q.crop} · {q.areaM2.toLocaleString()}㎡</span>
                <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-0.5 text-sm font-semibold text-brand">{quoteStatusLabel[q.status]}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-bold">재고 10개 이하</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {lowStock.length === 0 && <li className="text-muted">없음</li>}
            {lowStock.map((p) => (
              <li key={p.id}><Link href={`/admin/products/${p.id}`} className="chip border-warn/30 text-warn">{p.name} · {p.stock}개</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
