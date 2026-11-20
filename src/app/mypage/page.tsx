import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { desc, eq, inArray } from "drizzle-orm";
import { LogOut } from "lucide-react";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { quoteStatusLabel } from "@/lib/catalog";
import { StatusBadge } from "@/components/status-badge";
import { won } from "@/lib/pricing";
import { CancelButton } from "./cancel-button";

export const metadata: Metadata = { title: "마이페이지" };

export default function MyPage() {
  return (
    <div className="container-x pt-10">
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <Content />
      </Suspense>
    </div>
  );
}

async function Content() {
  const user = await requireUser("/mypage");
  const orders = await db.select().from(schema.orders).where(eq(schema.orders.userId, user.id)).orderBy(desc(schema.orders.createdAt)).limit(30);
  const items = orders.length
    ? await db.select().from(schema.orderItems).where(inArray(schema.orderItems.orderId, orders.map((o) => o.id)))
    : [];
  const quotes = await db.select().from(schema.quotes).where(eq(schema.quotes.userId, user.id)).orderBy(desc(schema.quotes.createdAt)).limit(20);
  const visible = orders.filter((o) => o.status !== "pending");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{user.isBusiness ? "사업자 회원" : "일반 회원"}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{user.name}님, 반갑습니다</h1>
          <p className="text-muted">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.role === "admin" && <Link href="/admin" className="btn-primary">관리자</Link>}
          <form action={logout}><button className="btn-ghost"><LogOut className="h-4 w-4" /> 로그아웃</button></form>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">주문 내역</h2>
        {visible.length === 0 ? (
          <p className="card mt-3 p-8 text-center text-muted">주문 내역이 없습니다. <Link href="/products" className="font-semibold text-brand">제품 보러 가기</Link></p>
        ) : (
          <ul className="mt-3 space-y-3">
            {visible.map((o) => (
              <li key={o.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-muted">{o.createdAt.toLocaleDateString("ko-KR")} · {o.orderNo}</div>
                  <StatusBadge status={o.status} />
                </div>
                <ul className="mt-3 space-y-1 text-[15px]">
                  {items.filter((i) => i.orderId === o.id).map((i) => (
                    <li key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span className="tabular-nums">{won(i.price * i.qty)}</span></li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                  <span className="font-extrabold">{won(o.total)}</span>
                  <div className="flex items-center gap-3 text-sm">
                    {o.trackingNo && <span className="text-muted">{o.carrier} {o.trackingNo}</span>}
                    {o.status === "paid" && <CancelButton orderNo={o.orderNo} />}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">견적 요청</h2>
        {quotes.length === 0 ? (
          <p className="card mt-3 p-8 text-center text-muted">견적 요청 내역이 없습니다. <Link href="/quote" className="font-semibold text-brand">견적 요청하기</Link></p>
        ) : (
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {quotes.map((q) => (
              <li key={q.id} className="card p-5">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{q.quoteNo}</span>
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">{quoteStatusLabel[q.status]}</span>
                </div>
                <p className="mt-2 font-semibold">{q.crop} · {q.areaM2.toLocaleString()}㎡ · {q.greenhouseType}</p>
                <p className="text-sm text-muted">{q.needs.join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
