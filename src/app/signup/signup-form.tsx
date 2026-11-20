"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";

export function SignupForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signup, undefined);
  const [biz, setBiz] = useState(false);
  const v = state?.values ?? {};
  return (
    <form key={state?.ts} action={action} className="card mt-6 space-y-4 p-6">
      <input type="hidden" name="next" value={next} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="input" defaultValue={v.email} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="password">비밀번호 (8자 이상)</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="name">이름</label>
          <input id="name" name="name" autoComplete="name" required className="input" defaultValue={v.name} />
        </div>
        <div>
          <label className="label" htmlFor="phone">휴대폰</label>
          <input id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" required className="input" defaultValue={v.phone} />
        </div>
      </div>
      <label className="flex items-center gap-3 font-semibold">
        <input type="checkbox" name="isBusiness" className="h-5 w-5 accent-[var(--brand)]" checked={biz} onChange={(e) => setBiz(e.target.checked)} />
        사업자 회원 (영농법인·기업·기관)
      </label>
      {biz && (
        <div>
          <label className="label" htmlFor="businessNo">사업자등록번호</label>
          <input id="businessNo" name="businessNo" inputMode="numeric" placeholder="000-00-00000" className="input" defaultValue={v.businessNo} />
        </div>
      )}
      <fieldset className="space-y-2 rounded-2xl bg-surface-2 p-4 text-[15px]">
        <label className="flex gap-3"><input type="checkbox" name="terms" required className="h-5 w-5 accent-[var(--brand)]" /> <span>[필수] <Link href="/terms" className="underline">이용약관</Link> 동의</span></label>
        <label className="flex gap-3"><input type="checkbox" name="privacy" required className="h-5 w-5 accent-[var(--brand)]" /> <span>[필수] <Link href="/privacy" className="underline">개인정보 수집·이용</Link> 동의 (이메일, 이름, 휴대폰 · 회원 관리 · 탈퇴 시까지)</span></label>
        <label className="flex gap-3"><input type="checkbox" name="marketing" className="h-5 w-5 accent-[var(--brand)]" /> <span>[선택] 신제품·지원사업 소식 수신</span></label>
      </fieldset>
      {state?.error && <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-semibold text-danger" role="alert">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "가입 중…" : "가입하기"}</button>
      <p className="text-center text-[15px] text-muted">이미 회원이신가요? <Link href="/login" className="font-semibold text-brand">로그인</Link></p>
    </form>
  );
}
