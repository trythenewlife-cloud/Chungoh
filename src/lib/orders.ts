import "server-only";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { cancelPayment, confirmPayment } from "@/lib/toss";

// 서버 전용: 결제 취소 + 재고 복구. 호출하는 쪽에서 권한을 먼저 확인한다.
export async function cancelOrderInternal(o: schema.Order, reason: string): Promise<{ ok: boolean; error?: string }> {
  if (o.status === "pending") {
    await db.update(schema.orders).set({ status: "cancelled", cancelReason: reason }).where(eq(schema.orders.id, o.id));
    return { ok: true };
  }
  if (o.status !== "paid") return { ok: false, error: "배송 준비가 시작된 주문은 고객센터로 문의해 주세요." };
  if (!o.paymentKey) return { ok: false, error: "결제 정보가 없습니다." };
  const r = await cancelPayment(o.paymentKey, reason);
  if (!r.ok) return { ok: false, error: r.message };
  await db.transaction(async (tx) => {
    await tx.update(schema.orders).set({ status: "cancelled", cancelReason: reason }).where(eq(schema.orders.id, o.id));
    const items = await tx.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, o.id));
    for (const it of items) {
      await tx
        .update(schema.products)
        .set({ stock: sql`${schema.products.stock} + ${it.qty}` })
        .where(eq(schema.products.id, it.productId));
    }
  });
  return { ok: true };
}

export type ConfirmResult = { ok: true; order: schema.Order } | { ok: false; error: string };

// 결제 승인: 주문 금액 검증 → 토스 승인 → 결제완료 처리·재고 차감
export async function confirmOrderPayment(orderNo: string, paymentKey: string, amount: number): Promise<ConfirmResult> {
  const [o] = await db.select().from(schema.orders).where(eq(schema.orders.orderNo, orderNo));
  if (!o) return { ok: false, error: "주문을 찾을 수 없습니다." };
  // 새로고침 등으로 다시 들어온 경우
  if (o.status === "cancelled") return { ok: false, error: "취소된 주문입니다." };
  if (o.status !== "pending") return { ok: true, order: o };
  // 금액 위변조 방지: URL의 금액과 DB 주문 금액이 같아야 승인
  if (!paymentKey || amount !== o.total) return { ok: false, error: "결제 금액이 주문 금액과 다릅니다." };

  const r = await confirmPayment(paymentKey, orderNo, amount);
  if (!r.ok) return { ok: false, error: `${r.message} (${r.code})` };

  await db.transaction(async (tx) => {
    await tx
      .update(schema.orders)
      .set({
        status: "paid",
        paymentKey,
        paymentMethod: r.data.method ?? null,
        paidAt: r.data.approvedAt ? new Date(r.data.approvedAt) : sql`now()`,
      })
      .where(eq(schema.orders.id, o.id));
    const items = await tx.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, o.id));
    for (const it of items) {
      await tx
        .update(schema.products)
        .set({ stock: sql`greatest(${schema.products.stock} - ${it.qty}, 0)` })
        .where(eq(schema.products.id, it.productId));
    }
  });
  return { ok: true, order: { ...o, status: "paid" } };
}
