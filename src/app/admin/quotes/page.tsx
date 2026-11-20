import Link from "next/link";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { decrypt } from "@/lib/crypto";
import { quoteStatusLabel } from "@/lib/catalog";
import { quoteStatuses } from "@/db/schema";
import { AdminSkeleton } from "../skeleton";
import { QuoteEditor } from "./quote-editor";

export default function AdminQuotes({ searchParams }: PageProps<"/admin/quotes">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <List searchParams={searchParams} />
    </Suspense>
  );
}

async function List({ searchParams }: Pick<PageProps<"/admin/quotes">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = quoteStatuses.find((s) => s === sp.status);
  const rows = await db
    .select()
    .from(schema.quotes)
    .where(status ? eq(schema.quotes.status, status) : undefined)
    .orderBy(desc(schema.quotes.createdAt))
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">견적 요청</h1>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Link href="/admin/quotes" className={`chip shrink-0 ${!status ? "border-brand text-brand" : ""}`}>전체</Link>
        {quoteStatuses.map((s) => (
          <Link key={s} href={`/admin/quotes?status=${s}`} className={`chip shrink-0 ${status === s ? "border-brand text-brand" : ""}`}>{quoteStatusLabel[s]}</Link>
        ))}
      </div>
      {rows.length === 0 && <p className="card p-8 text-center text-muted">견적 요청이 없습니다</p>}
      <ul className="space-y-3">
        {rows.map((q) => (
          <li key={q.id} className="card grid gap-4 p-5 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="font-semibold text-ink">{q.quoteNo}</span>
                <span>{q.createdAt.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}</span>
                <span className="chip">{q.customerType}</span>
              </div>
              <p className="mt-2 text-lg font-bold">{q.region} · {q.crop} · {q.areaM2.toLocaleString()}㎡ ({Math.round(q.areaM2 / 3.3058).toLocaleString()}평) · {q.greenhouseType}</p>
              <p className="mt-1 text-[15px]">필요 설비: {q.needs.join(", ")}</p>
              {q.message && <p className="mt-2 whitespace-pre-line rounded-xl bg-surface-2 p-3 text-[15px]">{q.message}</p>}
              <p className="mt-2 text-[15px]">
                {q.name} · <a className="font-semibold text-brand" href={`tel:${decrypt(q.phoneEnc)}`}>{decrypt(q.phoneEnc)}</a>
                {q.email && <> · {q.email}</>}
              </p>
            </div>
            <QuoteEditor id={q.id} status={q.status} memo={q.adminMemo ?? ""} />
          </li>
        ))}
      </ul>
    </div>
  );
}
