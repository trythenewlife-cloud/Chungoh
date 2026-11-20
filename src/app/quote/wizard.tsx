"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ArrowLeft, ArrowRight, Tractor, Building2, Landmark, Flower2 } from "lucide-react";
import { submitQuote } from "@/app/actions/quote";

const customerTypes = [
  { v: "개인 농가", Icon: Tractor },
  { v: "영농법인·기업농", Icon: Building2 },
  { v: "지자체·공공기관", Icon: Landmark },
  { v: "가정·취미 원예", Icon: Flower2 },
] as const;
const ghTypes = ["단동 비닐", "연동 비닐", "유리온실", "신축 예정", "기타"] as const;
const needOptions = ["자동개폐기", "개폐기 컨트롤 박스", "양액제어", "복합환경제어", "센서·원격 모니터링", "온실 신축·시공", "A/S·점검", "지원사업 상담"];
const productNeed: Record<string, string> = {
  "climate-controller": "복합환경제어",
  "nutrient-system": "양액제어",
  "greenhouse-build": "온실 신축·시공",
};

export function QuoteWizard() {
  const sp = useSearchParams();
  const pre = productNeed[sp.get("product") ?? ""];
  const [step, setStep] = useState(0);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [f, setF] = useState({
    customerType: "" as string,
    crop: "",
    areaM2: "",
    greenhouseType: "" as string,
    needs: pre ? [pre] : ([] as string[]),
    region: "",
    name: "",
    phone: "",
    email: "",
    message: "",
    privacyAgree: false,
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const valid = [
    !!f.customerType && !!f.crop && Number(f.areaM2) > 0,
    !!f.greenhouseType && f.needs.length > 0,
    !!f.region && !!f.name && /^[0-9\-+ ]{9,16}$/.test(f.phone) && f.privacyAgree,
  ];

  if (done) {
    return (
      <div className="card mt-8 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold">견적 요청이 접수되었습니다</h2>
        <p className="mt-2 text-muted">접수번호 <b className="text-ink">{done}</b> · 담당자가 곧 연락드립니다.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/products" className="btn-ghost">제품 둘러보기</Link>
          <Link href="/" className="btn-primary">홈으로</Link>
        </div>
      </div>
    );
  }

  const labels = ["온실 정보", "필요 설비", "연락처"];

  return (
    <div className="card mt-8 p-5 sm:p-8">
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="진행 단계">
        {labels.map((l, i) => (
          <li key={l} className="space-y-2">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-surface-2"}`} />
            <span className={`text-sm font-semibold ${i === step ? "text-ink" : "text-muted"}`}>{i + 1}. {l}</span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-6">
          <fieldset>
            <legend className="label">고객 유형</legend>
            <div className="grid grid-cols-2 gap-3">
              {customerTypes.map(({ v, Icon }) => (
                <button type="button" key={v} onClick={() => set("customerType", v)} aria-pressed={f.customerType === v}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold transition ${f.customerType === v ? "border-brand bg-brand-soft" : "border-line hover:bg-surface-2"}`}>
                  <Icon className="h-6 w-6 text-brand" /> {v}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="crop">재배 작물</label>
              <input id="crop" className="input" placeholder="예: 딸기, 토마토" value={f.crop} onChange={(e) => set("crop", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="area">온실 면적 (㎡)</label>
              <input id="area" className="input" inputMode="numeric" placeholder="예: 3300 (약 1,000평)" value={f.areaM2} onChange={(e) => set("areaM2", e.target.value.replace(/\D/g, ""))} />
              {Number(f.areaM2) > 0 && <p className="mt-1 text-sm text-muted">약 {Math.round(Number(f.areaM2) / 3.3058).toLocaleString()}평</p>}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <fieldset>
            <legend className="label">온실 형태</legend>
            <div className="flex flex-wrap gap-2">
              {ghTypes.map((g) => (
                <button type="button" key={g} onClick={() => set("greenhouseType", g)} aria-pressed={f.greenhouseType === g}
                  className={`rounded-full border px-4 py-2.5 font-semibold ${f.greenhouseType === g ? "border-brand bg-brand text-brand-ink" : "border-line hover:bg-surface-2"}`}>
                  {g}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label">필요한 설비 (여러 개 선택)</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {needOptions.map((n) => {
                const on = f.needs.includes(n);
                return (
                  <button type="button" key={n} aria-pressed={on} onClick={() => set("needs", on ? f.needs.filter((x) => x !== n) : [...f.needs, n])}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left font-medium ${on ? "border-brand bg-brand-soft" : "border-line hover:bg-surface-2"}`}>
                    <span className={`grid h-5 w-5 place-items-center rounded-md border ${on ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>{on && <Check className="h-3.5 w-3.5" />}</span>
                    {n}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">이름 (담당자)</label>
              <input id="name" className="input" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="phone">휴대폰</label>
              <input id="phone" className="input" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="region">지역</label>
              <input id="region" className="input" placeholder="예: 충남 논산" value={f.region} onChange={(e) => set("region", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="email">이메일 (선택)</label>
              <input id="email" className="input" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="msg">추가 요청사항 (선택)</label>
            <textarea id="msg" className="input min-h-28" value={f.message} onChange={(e) => set("message", e.target.value)} />
          </div>
          <label className="flex items-start gap-3 rounded-2xl bg-surface-2 p-4 text-[15px]">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--brand)]" checked={f.privacyAgree} onChange={(e) => set("privacyAgree", e.target.checked)} />
            <span>
              <b>[필수] 개인정보 수집·이용 동의</b>
              <br />
              <span className="text-muted">수집 항목: 이름, 휴대폰, 지역, 이메일 · 목적: 견적 상담 · 보유 기간: 상담 종료 후 1년. 동의를 거부할 수 있으며, 거부 시 견적 상담이 제한됩니다. <Link href="/privacy" className="underline">전문 보기</Link></span>
            </span>
          </label>
        </div>
      )}

      {error && <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger" role="alert">{error}</p>}

      <div className="mt-8 flex justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" /> 이전
        </button>
        {step < 2 ? (
          <button type="button" className="btn-primary" disabled={!valid[step]} onClick={() => setStep((s) => s + 1)}>
            다음 <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            disabled={!valid[2] || pending}
            onClick={() =>
              start(async () => {
                setError("");
                const r = await submitQuote(f);
                if (r.ok) setDone(r.quoteNo);
                else setError(r.error);
              })
            }
          >
            {pending ? "접수 중…" : "견적 요청하기"}
          </button>
        )}
      </div>
    </div>
  );
}
