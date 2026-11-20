import { Suspense } from "react";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { decrypt, maskPhone } from "@/lib/crypto";
import { AdminSkeleton } from "../skeleton";

export default function AdminMembers() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <List />
    </Suspense>
  );
}

async function List() {
  await requireAdmin();
  const users = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt)).limit(200);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">회원 {users.length}</h1>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[15px]">
          <thead className="border-b border-line text-sm text-muted">
            <tr><th className="p-3">이름</th><th>이메일</th><th>휴대폰</th><th>구분</th><th>마케팅</th><th>가입일</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3 font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td className="tabular-nums">{u.phoneEnc ? maskPhone(decrypt(u.phoneEnc)) : "-"}</td>
                <td>{u.role === "admin" ? "관리자" : u.isBusiness ? "사업자" : "일반"}</td>
                <td>{u.marketingAgree ? "동의" : "-"}</td>
                <td className="text-sm text-muted">{u.createdAt.toLocaleDateString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-muted">휴대폰 번호는 목록에서 마스킹됩니다.</p>
    </div>
  );
}
