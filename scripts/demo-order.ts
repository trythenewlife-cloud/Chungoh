// 데모용: 결제완료 상태의 주문 1건을 만든다 (토스 결제 없이 관리자 화면 확인용)
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { encrypt } from "../src/lib/crypto";

const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(sql, { schema });

async function main() {
  const orderNo = process.argv[2] ?? "CO-DEMO-PAID";
  const [p] = await db.select().from(schema.products).where(eq(schema.products.slug, "codm-8102"));
  await db.delete(schema.orders).where(eq(schema.orders.orderNo, orderNo));
  const [o] = await db
    .insert(schema.orders)
    .values({
      orderNo,
      status: "paid",
      orderName: p.name,
      itemsTotal: p.price * 2,
      shippingFee: 0,
      total: p.price * 2,
      ordererName: "홍길동",
      ordererEmail: "buyer@example.com",
      phoneEnc: encrypt("010-1234-5678"),
      addressEnc: encrypt(JSON.stringify({ zip: "34365", addr1: "대전 대덕구 대화로 1", addr2: "101호" })),
      paymentMethod: "카드 (데모)",
      paidAt: new Date(),
    })
    .returning({ id: schema.orders.id });
  await db.insert(schema.orderItems).values({ orderId: o.id, productId: p.id, name: p.name, price: p.price, qty: 2 });
  console.log(`demo order ${orderNo} created`);
  await sql.end();
}
main();
