"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { submitAsRequest } from "@/app/actions/as";
import { asIssueTypes } from "@/lib/catalog";

export function AsForm() {
  const [state, action, pending] = useActionState(submitAsRequest, undefined);

  if (state?.ok) {
    return (
      <div className="card mt-8 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand" strokeWidth={1.5} />
        <h2 className="mt-4 text-2xl font-bold">A/S 접수가 완료됐습니다</h2>
        <p className="mt-2 text-muted">접수번호 <b className="text-ink">{state.requestNo}</b></p>
        <p className="mt-1 text-sm text-muted">회원이면 마이페이지에서 진행 상태를 볼 수 있습니다.</p>
        <Link href="/" className="btn-ghost mt-6">홈으로</Link>
      </div>
    );
  }

  const v = state?.values ?? {};
  return (
    <form action={action} className="card mt-8 space-y-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">이름</label>
          <input id="name" name="name" className="input" autoComplete="name" required maxLength={30} defaultValue={v.name} />
        </div>
        <div>
          <label className="label" htmlFor="phone">휴대폰</label>
          <input id="phone" name="phone" className="input" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" required defaultValue={v.phone} />
        </div>
        <div>
          <label className="label" htmlFor="region">지역</label>
          <input id="region" name="region" className="input" placeholder="예: 충남 논산" required maxLength={40} defaultValue={v.region} />
        </div>
        <div>
          <label className="label" htmlFor="productModel">제품 모델명 (선택)</label>
          <input id="productModel" name="productModel" className="input" placeholder="예: CODM 81024" maxLength={40} defaultValue={v.productModel} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="issueType">증상 유형</label>
        <select id="issueType" name="issueType" className="input" required defaultValue={v.issueType ?? ""}>
          <option value="" disabled>선택해 주세요</option>
          {asIssueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="message">증상 설명</label>
        <textarea id="message" name="message" className="input min-h-32" required minLength={5} maxLength={2000}
          placeholder="예: 측면 개폐기가 내림은 되는데 올림이 안 됩니다. 설치 2019년." defaultValue={v.message} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex items-start gap-3 rounded-2xl bg-surface-2 p-4 text-[15px]">
        <input type="checkbox" name="privacyAgree" required className="mt-1 h-5 w-5 accent-[var(--brand)]" />
        <span>
          <b>[필수] 개인정보 수집·이용 동의</b>
          <br />
          <span className="text-muted">수집 항목: 이름, 휴대폰, 지역 · 목적: A/S 접수와 연락 · 보유 기간: 처리 완료 후 1년. 동의를 거부할 수 있으며, 거부 시 온라인 A/S 접수가 제한됩니다. <Link href="/privacy" className="underline">전문 보기</Link></span>
        </span>
      </label>
      {state && !state.ok && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger" role="alert">{state.error}</p>}
      <button className="btn-primary w-full sm:w-auto" disabled={pending}>{pending ? "접수 중…" : "A/S 신청하기"}</button>
    </form>
  );
}
