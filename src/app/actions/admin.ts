"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireAdmin, logAdmin } from "@/lib/session";
import { cancelOrderInternal } from "@/lib/orders";
import { orderStatuses, quoteStatuses } from "@/db/schema";

export type AdminState = { error?: string; ok?: boolean; values?: Record<string, string>; ts?: number } | undefined;

const ProductInput = z.object({
  id: z.coerce.number().int().optional(),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,60}$/, "슬러그는 영문 소문자, 숫자, - 만 사용"),
  name: z.string().trim().min(1).max(80),
  category: z.enum(["opener", "controller", "nutrient", "sensor", "parts", "system"]),
  summary: z.string().trim().min(1).max(160),
  description: z.string().trim().max(5000),
  price: z.coerce.number().int().min(0).max(100_000_000),
  saleType: z.enum(["buy", "quote"]),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  badge: z.string().trim().max(20),
  sort: z.coerce.number().int().min(0).max(10000),
  isActive: z.boolean(),
  specs: z.string().max(3000),
});

// 사양 입력 형식: 한 줄에 "항목: 값"
function parseSpecs(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

export async function saveProduct(_: AdminState, fd: FormData): Promise<AdminState> {
  const admin = await requireAdmin();
  const parsed = ProductInput.safeParse({
    id: fd.get("id") || undefined,
    slug: fd.get("slug"),
    name: fd.get("name"),
    category: fd.get("category"),
    summary: fd.get("summary"),
    description: fd.get("description") ?? "",
    price: fd.get("price"),
    saleType: fd.get("saleType"),
    stock: fd.get("stock"),
    badge: fd.get("badge") ?? "",
    sort: fd.get("sort") ?? 100,
    isActive: fd.get("isActive") === "on",
    specs: fd.get("specs") ?? "",
  });
  // 실패 시 입력값을 돌려줘 폼에 다시 채움
  const values = Object.fromEntries([...fd.entries()].filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, String(v)]));
  const fail = (error: string): AdminState => ({ error, values, ts: Date.now() });
  if (!parsed.success) return fail(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" / "));
  const { id, specs, badge, ...v } = parsed.data;
  const row = { ...v, badge: badge || null, specs: parseSpecs(specs) };

  const [dup] = await db.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.slug, v.slug));
  if (dup && dup.id !== id) return fail("같은 슬러그의 상품이 이미 있습니다.");

  if (id) {
    await db.update(schema.products).set(row).where(eq(schema.products.id, id));
    await logAdmin(admin.id, "product.update", String(id));
  } else {
    const [p] = await db.insert(schema.products).values(row).returning({ id: schema.products.id });
    await logAdmin(admin.id, "product.create", String(p.id));
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function toggleProduct(id: number, isActive: boolean) {
  const admin = await requireAdmin();
  await db.update(schema.products).set({ isActive }).where(eq(schema.products.id, id));
  await logAdmin(admin.id, isActive ? "product.show" : "product.hide", String(id));
  revalidatePath("/admin/products");
}

const OrderUpdate = z.object({
  id: z.string().uuid(),
  status: z.enum(orderStatuses),
  carrier: z.string().trim().max(30),
  trackingNo: z.string().trim().max(40),
});

export async function updateOrder(_: AdminState, fd: FormData): Promise<AdminState> {
  const admin = await requireAdmin();
  const parsed = OrderUpdate.safeParse({
    id: fd.get("id"),
    status: fd.get("status"),
    carrier: fd.get("carrier") ?? "",
    trackingNo: fd.get("trackingNo") ?? "",
  });
  if (!parsed.success) return { error: "입력값 오류" };
  const v = parsed.data;
  const [o] = await db.select().from(schema.orders).where(eq(schema.orders.id, v.id));
  if (!o) return { error: "주문 없음" };
  if (v.status === "cancelled") return { error: "취소는 아래 '결제 취소' 버튼을 사용하세요." };
  if (o.status === "cancelled" || o.status === "pending") return { error: "결제되지 않았거나 취소된 주문은 상태를 바꿀 수 없습니다." };
  if (v.status === "shipping" && !v.trackingNo) return { error: "배송중으로 바꾸려면 송장번호가 필요합니다." };
  await db
    .update(schema.orders)
    .set({ status: v.status, carrier: v.carrier || null, trackingNo: v.trackingNo || null })
    .where(eq(schema.orders.id, v.id));
  await logAdmin(admin.id, `order.status.${v.status}`, o.orderNo);
  revalidatePath(`/admin/orders/${v.id}`);
  return { ok: true };
}

export async function adminCancelOrder(id: string, reason: string): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  const [o] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
  if (!o) return { ok: false, error: "주문 없음" };
  // 관리자는 배송 준비 단계까지 환불 가능하도록 paid로 간주해 처리
  const target = o.status === "preparing" ? { ...o, status: "paid" as const } : o;
  const r = await cancelOrderInternal(target, String(reason).slice(0, 100) || "판매자 취소");
  if (r.ok) await logAdmin(admin.id, "order.cancel", o.orderNo);
  revalidatePath(`/admin/orders/${id}`);
  return r;
}

const QuoteUpdate = z.object({
  id: z.string().uuid(),
  status: z.enum(quoteStatuses),
  adminMemo: z.string().trim().max(2000),
});

export async function updateQuote(_: AdminState, fd: FormData): Promise<AdminState> {
  const admin = await requireAdmin();
  const parsed = QuoteUpdate.safeParse({ id: fd.get("id"), status: fd.get("status"), adminMemo: fd.get("adminMemo") ?? "" });
  if (!parsed.success) return { error: "입력값 오류" };
  const v = parsed.data;
  await db.update(schema.quotes).set({ status: v.status, adminMemo: v.adminMemo || null }).where(eq(schema.quotes.id, v.id));
  await logAdmin(admin.id, `quote.${v.status}`, v.id);
  revalidatePath("/admin/quotes");
  return { ok: true };
}
