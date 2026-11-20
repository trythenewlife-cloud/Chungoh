"use client";

import { useActionState } from "react";
import { updateQuote } from "@/app/actions/admin";
import { quoteStatusLabel } from "@/lib/catalog";

export function QuoteEditor({ id, status, memo }: { id: string; status: string; memo: string }) {
  const [state, action, pending] = useActionState(updateQuote, undefined);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} className="input" aria-label="견적 상태">
        {Object.entries(quoteStatusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <textarea name="adminMemo" defaultValue={memo} placeholder="상담 메모 (내부용)" className="input min-h-20 text-[15px]" aria-label="상담 메모" />
      <div className="flex items-center gap-3">
        <button className="btn-primary py-2" disabled={pending}>{pending ? "저장 중…" : "저장"}</button>
        {state?.ok && <span className="text-sm font-semibold text-brand">저장됨</span>}
        {state?.error && <span className="text-sm font-semibold text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
