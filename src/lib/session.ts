import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

const COOKIE = "co_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7일

type SessionPayload = { uid: string; role: "customer" | "admin" };

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be at least 32 chars");
  return new TextEncoder().encode(s);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secret());
    return { uid: payload.uid, role: payload.role };
  } catch {
    return null;
  }
}

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  isBusiness: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const s = await getSession();
  if (!s) return null;
  const [u] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      isBusiness: schema.users.isBusiness,
    })
    .from(schema.users)
    .where(eq(schema.users.id, s.uid));
  return u ?? null;
}

export async function requireUser(next = "/mypage"): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
  return u;
}

// 권한은 쿠키의 role이 아니라 DB의 role로 다시 확인
export async function requireAdmin(): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) redirect("/login?next=/admin");
  if (u.role !== "admin") redirect("/");
  return u;
}

export async function logAdmin(adminId: string, action: string, target?: string) {
  await db.insert(schema.adminLogs).values({ adminId, action, target });
}
