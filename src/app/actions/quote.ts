"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db, schema } from "@/db";
import { encrypt } from "@/lib/crypto";
import { makeOrderNo } from "@/lib/pricing";
import { getSession } from "@/lib/session";

const QuoteInput = z.object({
  customerType: z.enum(["개인 농가", "영농법인·기업농", "지자체·공공기관", "가정·취미 원예"]),
  crop: z.string().trim().min(1).max(40),
  areaM2: z.coerce.number().int().min(1).max(10_000_000),
  greenhouseType: z.enum(["단동 비닐", "연동 비닐", "유리온실", "신축 예정", "기타"]),
  needs: z.array(z.string().max(30)).min(1).max(10),
  region: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(30),
  phone: z.string().trim().regex(/^[0-9\-+ ]{9,16}$/),
  email: z.union([z.literal(""), z.string().trim().email().max(100)]),
  message: z.string().trim().max(2000).optional(),
  privacyAgree: z.literal(true),
});

export type QuoteResult = { ok: true; quoteNo: string } | { ok: false; error: string };

export async function submitQuote(input: unknown): Promise<QuoteResult> {
  const parsed = QuoteInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "입력값을 확인해 주세요. 필수 항목과 개인정보 동의가 필요합니다." };
  const v = parsed.data;
  const session = await getSession();
  const quoteNo = makeOrderNo("QT", new Date(), randomBytes(3).toString("hex"));
  await db.insert(schema.quotes).values({
    quoteNo,
    userId: session?.uid ?? null,
    customerType: v.customerType,
    crop: v.crop,
    areaM2: v.areaM2,
    greenhouseType: v.greenhouseType,
    needs: v.needs,
    region: v.region,
    name: v.name,
    phoneEnc: encrypt(v.phone),
    email: v.email || null,
    message: v.message || null,
  });
  return { ok: true, quoteNo };
}
