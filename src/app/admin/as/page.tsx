import Link from "next/link";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { decrypt } from "@/lib/crypto";
import { asStatusLabel } from "@/lib/catalog";
import { asStatuses } from "@/db/schema";
import { AdminSkeleton } from "../skeleton";
import { AsEditor } from "./as-editor";

export default function AdminAs({ searchParams }: PageProps<"/admin/as">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <List searchParams={searchParams} />
    </Suspense>
  );
}

async function List({ searchParams }: Pick<PageProps<"/admin/as">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = asStatuses.find((s) => s === sp.status);
  const rows = await db
    .select()
    .from(schema.asRequests)
    .where(status ? eq(schema.asRequests.status, status) : undefined)
    .orderBy(desc(schema.asRequests.createdAt))
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">A/S 신청</h1>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Link href="/admin/as" className={`chip shrink-0 ${!status ? "border-brand text-brand" : ""}`}>전체</Link>
        {asStatuses.map((s) => (
          <Link key={s} href={`/admin/as?status=${s}`} className={`chip shrink-0 ${status === s ? "border-brand text-brand" : ""}`}>{asStatusLabel[s]}</Link>
        ))}
      </div>
      {rows.length === 0 && <p className="card p-8 text-center text-muted">A/S 신청이 없습니다</p>}
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="card grid gap-4 p-5 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="font-semibold text-ink">{r.requestNo}</span>
                <span>{r.createdAt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}</span>
                <span className="chip">{r.issueType}</span>
              </div>
              <p className="mt-2 text-lg font-bold">{r.region}{r.productModel && <> · {r.productModel}</>}</p>
              <p className="mt-2 whitespace-pre-line rounded-xl bg-surface-2 p-3 text-[15px]">{r.message}</p>
              <p className="mt-2 text-[15px]">
                {r.name} · <a className="font-semibold text-brand" href={`tel:${decrypt(r.phoneEnc)}`}>{decrypt(r.phoneEnc)}</a>
              </p>
            </div>
            <AsEditor id={r.id} status={r.status} memo={r.adminMemo ?? ""} />
          </li>
        ))}
      </ul>
    </div>
  );
}
