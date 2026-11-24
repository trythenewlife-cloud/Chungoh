"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db, schema } from "@/db";
import { encrypt } from "@/lib/crypto";
import { makeOrderNo } from "@/lib/pricing";
import { getSession } from "@/lib/session";
import { asIssueTypes } from "@/lib/catalog";

const AsInput = z.object({
  name: z.string().trim().min(1).max(30),
  phone: z.string().trim().regex(/^[0-9\-+ ]{9,16}$/),
  region: z.string().trim().min(1).max(40),
  productModel: z.string().trim().max(40),
  issueType: z.enum(asIssueTypes),
  message: z.string().trim().min(5).max(2000),
  privacyAgree: z.literal("on"),
  // 봇 차단용 숨김 칸. 사람은 비워 둔다.
  website: z.literal(""),
});

export type AsState = { ok: true; requestNo: string } | { ok: false; error: string; values: Record<string, string> } | undefined;

export async function submitAsRequest(_: AsState, fd: FormData): Promise<AsState> {
  const raw = Object.fromEntries(["name", "phone", "region", "productModel", "issueType", "message", "privacyAgree", "website"].map((k) => [k, String(fd.get(k) ?? "")]));
  const parsed = AsInput.safeParse(raw);
  if (!parsed.success) {
    const values = { ...raw };
    delete values.privacyAgree;
    delete values.website;
    return { ok: false, error: "입력값을 확인해 주세요. 증상은 5자 이상, 개인정보 동의가 필요합니다.", values };
  }
  const v = parsed.data;
  const session = await getSession();
  const requestNo = makeOrderNo("AS", new Date(), randomBytes(3).toString("hex"));
  await db.insert(schema.asRequests).values({
    requestNo,
    userId: session?.uid ?? null,
    name: v.name,
    phoneEnc: encrypt(v.phone),
    region: v.region,
    productModel: v.productModel || null,
    issueType: v.issueType,
    message: v.message,
  });
  return { ok: true, requestNo };
}
