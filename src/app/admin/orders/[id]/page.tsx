import { Suspense } from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireAdmin, logAdmin } from "@/lib/session";
import { decrypt } from "@/lib/crypto";
import { won } from "@/lib/pricing";
import { StatusBadge } from "@/components/status-badge";
import { AdminSkeleton } from "../../skeleton";
import { OrderActions } from "./order-actions";

export default function AdminOrderDetail({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: Pick<PageProps<"/admin/orders/[id]">, "params">) {
  const admin = await requireAdmin();
  const id = (await params).id;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const [o] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
  if (!o) notFound();
  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, o.id));
  // 개인정보 열람 기록
  await logAdmin(admin.id, "order.view_pii", o.orderNo);
  const addr = JSON.parse(decrypt(o.addressEnc)) as { zip: string; addr1: string; addr2: string };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{o.orderNo}</h1>
        <StatusBadge status={o.status} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-bold">주문 상품</h2>
          <ul className="mt-3 space-y-1.5 text-[15px]">
            {items.map((i) => <li key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span className="tabular-nums">{won(i.price * i.qty)}</span></li>)}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-line pt-3 text-[15px]">
            <div className="flex justify-between"><dt className="text-muted">배송비</dt><dd>{won(o.shippingFee)}</dd></div>
            <div className="flex justify-between font-extrabold"><dt>합계</dt><dd>{won(o.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">결제수단</dt><dd>{o.paymentMethod ?? "-"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">결제일시</dt><dd>{o.paidAt?.toLocaleString("ko-KR") ?? "-"}</dd></div>
            {o.cancelReason && <div className="flex justify-between text-danger"><dt>취소 사유</dt><dd>{o.cancelReason}</dd></div>}
          </dl>
        </section>
        <section className="card p-5">
          <h2 className="font-bold">주문자·배송지</h2>
          <dl className="mt-3 space-y-1.5 text-[15px]">
            <div className="flex justify-between gap-4"><dt className="text-muted">이름</dt><dd>{o.ordererName} {o.userId ? "(회원)" : "(비회원)"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">휴대폰</dt><dd>{decrypt(o.phoneEnc)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">이메일</dt><dd>{o.ordererEmail}</dd></div>
            <div className="flex justify-between gap-4"><dt className="shrink-0 text-muted">주소</dt><dd className="text-right">({addr.zip}) {addr.addr1} {addr.addr2}</dd></div>
            {o.memo && <div className="flex justify-between gap-4"><dt className="text-muted">메모</dt><dd>{o.memo}</dd></div>}
            {o.taxInvoice && <div className="flex justify-between gap-4"><dt className="text-muted">세금계산서</dt><dd className="font-semibold">요청 · {decrypt(o.businessNoEnc)}</dd></div>}
          </dl>
          <p className="mt-3 text-[12px] text-muted">이 화면의 개인정보 열람은 관리자 로그에 기록됩니다.</p>
        </section>
      </div>
      <OrderActions id={o.id} status={o.status} carrier={o.carrier ?? ""} trackingNo={o.trackingNo ?? ""} />
    </div>
  );
}
