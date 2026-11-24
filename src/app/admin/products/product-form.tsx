"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveProduct } from "@/app/actions/admin";
import { categories } from "@/lib/catalog";
import type { Product } from "@/db/schema";

export function ProductForm({ p }: { p?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const specs = p ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : "";
  // 저장 실패 시 서버가 돌려준 입력값을 우선 사용
  const sv = state?.values;
  const d = (k: string, fallback: string | number | undefined) => (sv ? sv[k] ?? "" : fallback);
  return (
    <form key={state?.ts} action={action} className="card space-y-4 p-6">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="상품명" name="name" defaultValue={d("name", p?.name)} required />
        <F label="슬러그 (URL)" name="slug" defaultValue={d("slug", p?.slug)} placeholder="codm-81024" required />
        <div>
          <label className="label" htmlFor="category">분류</label>
          <select id="category" name="category" defaultValue={d("category", p?.category ?? "opener")} className="input">
            {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="saleType">판매 방식</label>
          <select id="saleType" name="saleType" defaultValue={d("saleType", p?.saleType ?? "buy")} className="input">
            <option value="buy">바로 결제</option>
            <option value="quote">견적 문의</option>
          </select>
        </div>
        <F label="가격 (원)" name="price" type="number" min={0} defaultValue={d("price", p?.price ?? 0)} />
        <F label="재고" name="stock" type="number" min={0} defaultValue={d("stock", p?.stock ?? 0)} />
        <F label="배지 (선택)" name="badge" defaultValue={d("badge", p?.badge ?? "")} placeholder="인기, 신제품" />
        <F label="정렬 순서 (작을수록 앞)" name="sort" type="number" defaultValue={d("sort", p?.sort ?? 100)} />
      </div>
      <F label="한 줄 요약" name="summary" defaultValue={d("summary", p?.summary)} required />
      <div>
        <label className="label" htmlFor="description">상세 설명</label>
        <textarea id="description" name="description" defaultValue={d("description", p?.description)} className="input min-h-32" />
      </div>
      <div>
        <label className="label" htmlFor="specs">사양 (한 줄에 &quot;항목: 값&quot;)</label>
        <textarea id="specs" name="specs" defaultValue={d("specs", specs)} className="input min-h-32 font-mono text-sm" placeholder={"전원: DC 24V\n보증: 1년"} />
      </div>
      <label className="flex items-center gap-3 font-semibold">
        <input type="checkbox" name="isActive" defaultChecked={sv ? sv.isActive === "on" : (p?.isActive ?? true)} className="h-5 w-5 accent-[var(--brand)]" /> 쇼핑몰에 노출
      </label>
      <p className="text-[13px] text-muted">상품 사진 업로드는 Supabase Storage 연결 후 추가됩니다. 지금은 분류별 그래픽이 표시됩니다.</p>
      {state?.error && <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-semibold text-danger" role="alert">{state.error}</p>}
      <div className="flex gap-3">
        <button className="btn-primary" disabled={pending}>{pending ? "저장 중…" : "저장"}</button>
        <Link href="/admin/products" className="btn-ghost">목록</Link>
      </div>
    </form>
  );
}

function F({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} className="input" {...rest} />
    </div>
  );
}
