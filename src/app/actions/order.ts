"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { encrypt, maskName } from "@/lib/crypto";
import { calcTotals, makeOrderNo, orderName } from "@/lib/pricing";
import { getSession, requireUser } from "@/lib/session";
import { cancelOrderInternal } from "@/lib/orders";
import { revalidatePath } from "next/cache";

const OrderInput = z.object({
  lines: z
    .array(z.object({ productId: z.number().int().positive(), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(30),
  name: z.string().trim().min(1).max(30),
  email: z.string().trim().email().max(100),
  phone: z.string().trim().regex(/^[0-9\-+ ]{9,16}$/),
  zip: z.string().trim().regex(/^\d{5}$/),
  addr1: z.string().trim().min(1).max(200),
  addr2: z.string().trim().max(200),
  memo: z.string().trim().max(200).optional(),
  taxInvoice: z.boolean(),
  businessNo: z.string().trim().max(20).optional(),
  agree: z.literal(true),
});

export type CreateOrderResult =
  | { ok: true; orderNo: string; amount: number; orderName: string }
  | { ok: false; error: string };

// 가격·재고는 클라이언트 값을 믿지 않고 DB에서 다시 계산
export async function createOrder(input: unknown): Promise<CreateOrderResult> {
  const parsed = OrderInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "주문 정보를 확인해 주세요." };
  const v = parsed.data;
  if (v.taxInvoice && !/^\d{3}-?\d{2}-?\d{5}$/.test(v.businessNo ?? "")) {
    return { ok: false, error: "세금계산서 발행에는 사업자등록번호 10자리가 필요합니다." };
  }

  const ids = [...new Set(v.lines.map((l) => l.productId))];
  const rows = await db.select().from(schema.products).where(inArray(schema.products.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r]));
  const priced: { productId: number; name: string; price: number; qty: number }[] = [];
  for (const l of v.lines) {
    const p = byId.get(l.productId);
    if (!p || !p.isActive) return { ok: false, error: "판매가 종료된 상품이 있습니다. 장바구니를 확인해 주세요." };
    if (p.saleType !== "buy") return { ok: false, error: `${p.name}은(는) 견적 문의 상품입니다.` };
    if (p.stock < l.qty) return { ok: false, error: `${p.name} 재고가 부족합니다. (남은 수량 ${p.stock}개)` };
    priced.push({ productId: p.id, name: p.name, price: p.price, qty: l.qty });
  }
  const totals = calcTotals(priced);
  const name = orderName(priced.map((p) => p.name));
  const orderNo = makeOrderNo("CO", new Date(), randomBytes(4).toString("hex"));
  const session = await getSession();

  await db.transaction(async (tx) => {
    const [o] = await tx
      .insert(schema.orders)
      .values({
        orderNo,
        userId: session?.uid ?? null,
        orderName: name,
        ...totals,
        ordererName: v.name,
        ordererEmail: v.email.toLowerCase(),
        phoneEnc: encrypt(v.phone),
        addressEnc: encrypt(JSON.stringify({ zip: v.zip, addr1: v.addr1, addr2: v.addr2 })),
        memo: v.memo || null,
        taxInvoice: v.taxInvoice,
        businessNoEnc: v.taxInvoice && v.businessNo ? encrypt(v.businessNo) : null,
      })
      .returning({ id: schema.orders.id });
    await tx.insert(schema.orderItems).values(priced.map((p) => ({ ...p, orderId: o.id })));
  });

  return { ok: true, orderNo, amount: totals.total, orderName: name };
}

// 결제 후(배송 준비 전)에만 고객이 직접 취소 가능
export async function cancelMyOrder(orderNo: string): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  const [o] = await db
    .select()
    .from(schema.orders)
    .where(and(eq(schema.orders.orderNo, orderNo), eq(schema.orders.userId, user.id)));
  if (!o) return { ok: false, error: "주문을 찾을 수 없습니다." };
  const r = await cancelOrderInternal(o, "고객 요청 취소");
  revalidatePath("/mypage");
  return r;
}

export type LookupResult =
  | {
      ok: true;
      order: {
        orderNo: string;
        status: string;
        orderName: string;
        total: number;
        createdAt: string;
        ordererName: string;
        carrier: string | null;
        trackingNo: string | null;
        items: { name: string; qty: number; price: number }[];
      };
    }
  | { ok: false; error: string };

// 비회원 주문조회: 주문번호 + 주문자 이메일이 모두 맞아야 조회
export async function lookupOrder(orderNo: string, email: string): Promise<LookupResult> {
  const no = String(orderNo).trim().toUpperCase().slice(0, 40);
  const em = String(email).trim().toLowerCase().slice(0, 100);
  if (!no || !em) return { ok: false, error: "주문번호와 이메일을 입력해 주세요." };
  const [o] = await db
    .select()
    .from(schema.orders)
    .where(and(eq(schema.orders.orderNo, no), eq(schema.orders.ordererEmail, em)));
  if (!o) return { ok: false, error: "일치하는 주문이 없습니다." };
  const items = await db
    .select({ name: schema.orderItems.name, qty: schema.orderItems.qty, price: schema.orderItems.price })
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, o.id));
  return {
    ok: true,
    order: {
      orderNo: o.orderNo,
      status: o.status,
      orderName: o.orderName,
      total: o.total,
      createdAt: o.createdAt.toISOString(),
      ordererName: maskName(o.ordererName),
      carrier: o.carrier,
      trackingNo: o.trackingNo,
      items,
    },
  };
}
