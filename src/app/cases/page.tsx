import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { MapPin, Sprout, Ruler } from "lucide-react";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "시공사례" };

export default function CasesPage({ searchParams }: PageProps<"/cases">) {
  return (
    <div className="container-x pt-10">
      <p className="eyebrow">시공사례</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-5xl">전국과 해외의 청오 온실</h1>
      <p className="mt-3 text-muted">아래 사례는 데모용 예시입니다. 실제 시공 사진과 내용으로 교체합니다.</p>
      <Suspense fallback={<div className="mt-8 grid gap-4 md:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-60 animate-pulse rounded-3xl bg-surface-2" />)}</div>}>
        <CaseList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CaseList({ searchParams }: Pick<PageProps<"/cases">, "searchParams">) {
  const sp = await searchParams;
  const region = typeof sp.region === "string" ? sp.region : "";
  const all = await db.select().from(schema.cases).orderBy(desc(schema.cases.year));
  const regions = [...new Set(all.map((c) => c.region))];
  const list = region ? all.filter((c) => c.region === region) : all;

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/cases" className={`rounded-full border px-4 py-2 text-[15px] font-semibold ${!region ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}>전체 {all.length}</Link>
        {regions.map((r) => (
          <Link key={r} href={`/cases?region=${encodeURIComponent(r)}`} className={`rounded-full border px-4 py-2 text-[15px] font-semibold ${region === r ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}>
            {r}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => (
          <article key={c.id} className="card overflow-hidden">
            <div className="relative h-36" style={{ background: `linear-gradient(135deg, hsl(${110 + i * 12} 45% 82%), hsl(${140 + i * 10} 40% 60%))` }}>
              <svg aria-hidden viewBox="0 0 200 80" className="absolute bottom-0 h-full w-full" preserveAspectRatio="none">
                {[0, 1, 2, 3].map((k) => (
                  <path key={k} d={`M${k * 50} 80 Q${k * 50 + 25} 20 ${k * 50 + 50} 80`} fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.8)" />
                ))}
              </svg>
              <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-[13px] font-bold">{c.year}</span>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold">{c.title}</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{c.region}</span>
                <span className="flex items-center gap-1"><Sprout className="h-4 w-4" />{c.crop}</span>
                <span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{c.areaM2.toLocaleString()}㎡</span>
              </div>
              <p className="mt-3 text-[15px]">{c.summary}</p>
              {c.result && <p className="mt-2 rounded-xl bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">{c.result}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.scope.map((s) => <span key={s} className="chip text-[12px]">{s}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
