"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form key={state?.ts} action={action} className="card mt-6 space-y-4 p-6">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="label" htmlFor="email">이메일</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" defaultValue={state?.values?.email} />
      </div>
      <div>
        <label className="label" htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" autoFocus={!!state?.error} />
      </div>
      {state?.error && <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-semibold text-danger" role="alert">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "확인 중…" : "로그인"}</button>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" disabled className="btn bg-[#FEE500] text-[#191600]" title="카카오 앱 키 발급 후 연결">카카오 로그인</button>
        <button type="button" disabled className="btn bg-[#03C75A] text-white" title="네이버 앱 키 발급 후 연결">네이버 로그인</button>
      </div>
      <p className="text-center text-[13px] text-muted">소셜 로그인은 카카오·네이버 개발자 앱 등록 후 활성화됩니다.</p>
      <div className="flex justify-between text-[15px]">
        <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand">회원가입</Link>
        <Link href="/orders/lookup" className="text-muted">비회원 주문조회</Link>
      </div>
    </form>
  );
}
