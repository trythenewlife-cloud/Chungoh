import Link from "next/link";
import { Suspense } from "react";
import { desc, eq, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { orderStatusLabel } from "@/lib/catalog";
import { won } from "@/lib/pricing";
import { maskName } from "@/lib/crypto";
import { StatusBadge } from "@/components/status-badge";
import { orderStatuses } from "@/db/schema";
import { AdminSkeleton } from "../skeleton";

export default function AdminOrders({ searchParams }: PageProps<"/admin/orders">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <List searchParams={searchParams} />
    </Suspense>
  );
}

async function List({ searchParams }: Pick<PageProps<"/admin/orders">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = orderStatuses.find((s) => s === sp.status);
  const rows = await db
    .select()
    .from(schema.orders)
    .where(status ? eq(schema.orders.status, status) : ne(schema.orders.status, "pending"))
    .orderBy(desc(schema.orders.createdAt))
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">주문</h1>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Link href="/admin/orders" className={`chip shrink-0 ${!status ? "border-brand text-brand" : ""}`}>전체(결제대기 제외)</Link>
        {orderStatuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`chip shrink-0 ${status === s ? "border-brand text-brand" : ""}`}>{orderStatusLabel[s]}</Link>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[15px]">
          <thead className="border-b border-line text-sm text-muted">
            <tr><th className="p-3">주문번호</th><th>상품</th><th>주문자</th><th className="text-right">금액</th><th className="p-3">상태</th><th>일시</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted">주문이 없습니다</td></tr>}
            {rows.map((o) => (
              <tr key={o.id}>
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand">{o.orderNo}</Link></td>
                <td className="max-w-56 truncate">{o.orderName}</td>
                <td>{maskName(o.ordererName)}{o.userId ? "" : " (비회원)"}</td>
                <td className="text-right tabular-nums">{won(o.total)}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="text-sm text-muted">{o.createdAt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
