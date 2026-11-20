"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { encrypt } from "@/lib/crypto";
import { createSession, destroySession } from "@/lib/session";

// values: 실패 시 입력값을 되돌려 폼에 다시 채움 (React 19는 액션 후 폼을 초기화함). 비밀번호는 제외
export type FormState = { error?: string; values?: Record<string, string>; ts?: number } | undefined;

function keep(fd: FormData, names: string[]) {
  return Object.fromEntries(names.map((n) => [n, String(fd.get(n) ?? "")]));
}
const signupFields = ["email", "name", "phone", "businessNo", "isBusiness"];

// 오픈 리디렉션 방지: 같은 사이트 경로만 허용
function safeNext(v: FormDataEntryValue | null, fallback: string) {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : fallback;
}

const SignupInput = z.object({
  email: z.string().trim().toLowerCase().email().max(100),
  password: z.string().min(8).max(72),
  name: z.string().trim().min(1).max(30),
  phone: z.string().trim().regex(/^[0-9\-+ ]{9,16}$/),
  isBusiness: z.boolean(),
  businessNo: z.string().trim().max(20),
  terms: z.literal(true),
  privacy: z.literal(true),
  marketing: z.boolean(),
});

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = SignupInput.safeParse({
    email: fd.get("email"),
    password: fd.get("password"),
    name: fd.get("name"),
    phone: fd.get("phone"),
    isBusiness: fd.get("isBusiness") === "on",
    businessNo: fd.get("businessNo") ?? "",
    terms: fd.get("terms") === "on",
    privacy: fd.get("privacy") === "on",
    marketing: fd.get("marketing") === "on",
  });
  if (!parsed.success) return { error: "입력값을 확인해 주세요. 비밀번호는 8자 이상, 필수 약관 동의가 필요합니다.", values: keep(fd, signupFields), ts: Date.now() };
  const v = parsed.data;
  if (v.isBusiness && !/^\d{3}-?\d{2}-?\d{5}$/.test(v.businessNo)) return { error: "사업자등록번호 10자리를 입력해 주세요.", values: keep(fd, signupFields), ts: Date.now() };

  const [exists] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, v.email));
  if (exists) return { error: "이미 가입된 이메일입니다.", values: keep(fd, signupFields), ts: Date.now() };

  const [u] = await db
    .insert(schema.users)
    .values({
      email: v.email,
      passwordHash: await bcrypt.hash(v.password, 10),
      name: v.name,
      phoneEnc: encrypt(v.phone),
      isBusiness: v.isBusiness,
      businessNoEnc: v.isBusiness ? encrypt(v.businessNo) : null,
      marketingAgree: v.marketing,
    })
    .returning({ id: schema.users.id, role: schema.users.role });
  await createSession({ uid: u.id, role: u.role });
  redirect(safeNext(fd.get("next"), "/mypage"));
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const [u] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  // 계정 존재 여부를 알려주지 않도록 같은 문구 사용
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return { error: "이메일 또는 비밀번호가 올바르지 않습니다.", values: { email }, ts: Date.now() };
  await createSession({ uid: u.id, role: u.role });
  redirect(safeNext(fd.get("next"), u.role === "admin" ? "/admin" : "/mypage"));
}

export async function logout() {
  await destroySession();
  redirect("/");
}
