"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadTossPayments, ANONYMOUS, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { useCart } from "@/components/cart";
import { createOrder } from "@/app/actions/order";
import { calcTotals, won } from "@/lib/pricing";

type U = { id: string; name: string; email: string; isBusiness: boolean } | null;

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

export function CheckoutForm({ user }: { user: U }) {
  const { lines, ready } = useCart();
  const t = calcTotals(lines);
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [widgetError, setWidgetError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    zip: "",
    addr1: "",
    addr2: "",
    memo: "",
    taxInvoice: false,
    businessNo: "",
    agree: false,
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  // 결제위젯 렌더링 (한 번만)
  useEffect(() => {
    if (!ready || lines.length === 0 || widgetsRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const toss = await loadTossPayments(clientKey);
        const widgets = toss.widgets({ customerKey: user ? `u_${user.id.replace(/-/g, "")}` : ANONYMOUS });
        await widgets.setAmount({ currency: "KRW", value: calcTotals(lines).total });
        await Promise.all([
          widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
          widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
        ]);
        if (!cancelled) {
          widgetsRef.current = widgets;
          setWidgetReady(true);
        }
      } catch (e) {
        if (!cancelled) setWidgetError(e instanceof Error ? e.message : "결제위젯을 불러오지 못했습니다.");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 위젯은 최초 1회만 렌더링하고 금액은 아래 효과에서 갱신
  }, [ready]);

  useEffect(() => {
    if (widgetReady && widgetsRef.current) widgetsRef.current.setAmount({ currency: "KRW", value: t.total });
  }, [t.total, widgetReady]);

  const valid =
    f.name && /\S+@\S+\.\S+/.test(f.email) && /^[0-9\-+ ]{9,16}$/.test(f.phone) && /^\d{5}$/.test(f.zip) && f.addr1 && f.agree &&
    (!f.taxInvoice || /^\d{3}-?\d{2}-?\d{5}$/.test(f.businessNo));

  async function pay() {
    setError("");
    setSubmitting(true);
    try {
      const r = await createOrder({ ...f, lines: lines.map((l) => ({ productId: l.productId, qty: l.qty })) });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      const w = widgetsRef.current;
      if (!w) {
        setError("결제위젯이 준비되지 않았습니다.");
        return;
      }
      // 서버가 계산한 금액으로 다시 맞춘 뒤 결제 요청
      await w.setAmount({ currency: "KRW", value: r.amount });
      const origin = window.location.origin;
      await w.requestPayment({
        orderId: r.orderNo,
        orderName: r.orderName,
        successUrl: `${origin}/checkout/success`,
        failUrl: `${origin}/checkout/fail`,
        customerEmail: f.email,
        customerName: f.name,
        customerMobilePhone: f.phone.replace(/\D/g, ""),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (!/취소|cancel/i.test(msg)) setError(msg || "결제를 진행하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return <div className="card mt-6 h-[480px] animate-pulse" />;
  if (lines.length === 0)
    return (
      <div className="card mt-6 p-10 text-center">
        <p className="text-muted">주문할 상품이 없습니다.</p>
        <Link href="/products" className="btn-primary mt-4">제품 보러 가기</Link>
      </div>
    );

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {!user && (
          <p className="card flex flex-wrap items-center justify-between gap-2 p-4 text-[15px]">
            비회원으로 주문합니다. 주문번호와 이메일로 조회할 수 있습니다.
            <Link href="/login?next=/checkout" className="font-semibold text-brand">로그인하고 주문</Link>
          </p>
        )}
        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-bold">주문자·배송 정보</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="받는 분" value={f.name} onChange={(v) => set("name", v)} autoComplete="name" />
            <Field id="phone" label="휴대폰" value={f.phone} onChange={(v) => set("phone", v)} autoComplete="tel" inputMode="tel" placeholder="010-0000-0000" />
            <Field id="email" label="이메일 (주문 확인용)" value={f.email} onChange={(v) => set("email", v)} autoComplete="email" type="email" />
            <Field id="zip" label="우편번호" value={f.zip} onChange={(v) => set("zip", v.replace(/\D/g, "").slice(0, 5))} autoComplete="postal-code" inputMode="numeric" placeholder="5자리" />
          </div>
          <Field id="addr1" label="주소" value={f.addr1} onChange={(v) => set("addr1", v)} autoComplete="address-line1" placeholder="도로명 주소" />
          <Field id="addr2" label="상세 주소" value={f.addr2} onChange={(v) => set("addr2", v)} autoComplete="address-line2" />
          <Field id="memo" label="배송 메모 (선택)" value={f.memo} onChange={(v) => set("memo", v)} placeholder="예: 농장 창고 앞에 놓아주세요" />
          <p className="text-[13px] text-muted">우편번호 검색(다음 우편번호 서비스)은 운영 배포 시 연결합니다.</p>
        </section>

        <section className="card space-y-3 p-6">
          <label className="flex items-center gap-3 font-semibold">
            <input type="checkbox" className="h-5 w-5 accent-[var(--brand)]" checked={f.taxInvoice} onChange={(e) => set("taxInvoice", e.target.checked)} />
            세금계산서 발행 요청 (사업자)
          </label>
          {f.taxInvoice && <Field id="bizno" label="사업자등록번호" value={f.businessNo} onChange={(v) => set("businessNo", v)} placeholder="000-00-00000" inputMode="numeric" />}
        </section>

        <section className="card overflow-hidden p-2 sm:p-4">
          <h2 className="px-4 pt-3 text-lg font-bold">결제 수단</h2>
          {widgetError && <p className="m-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{widgetError}</p>}
          <div id="payment-method" />
          <div id="agreement" />
        </section>
      </div>

      <aside className="card h-fit space-y-3 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">주문 상품 {lines.length}건</h2>
        <ul className="space-y-2 text-[15px]">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">{l.name} × {l.qty}</span>
              <span className="shrink-0 tabular-nums">{won(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-line pt-3 text-[15px]">
          <div className="flex justify-between"><span className="text-muted">상품 금액</span><span className="tabular-nums">{won(t.itemsTotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted">배송비</span><span className="tabular-nums">{t.shippingFee ? won(t.shippingFee) : "무료"}</span></div>
          <div className="flex justify-between pt-2 text-lg font-extrabold"><span>총 결제 금액</span><span className="tabular-nums">{won(t.total)}</span></div>
        </div>
        <label className="flex items-start gap-3 rounded-2xl bg-surface-2 p-3 text-[14px]">
          <input type="checkbox" className="mt-0.5 h-5 w-5 accent-[var(--brand)]" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} />
          <span>
            [필수] 주문 내용 확인 및 <Link href="/privacy" className="underline">개인정보 수집·이용</Link> (이름, 연락처, 주소 · 주문·배송 목적 · 5년 보관), <Link href="/terms" className="underline">이용약관</Link>에 동의합니다.
          </span>
        </label>
        {error && <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-semibold text-danger" role="alert">{error}</p>}
        <button className="btn-primary w-full py-4 text-base" disabled={!valid || !widgetReady || submitting} onClick={pay}>
          {submitting ? "결제 진행 중…" : `${won(t.total)} 결제하기`}
        </button>
        {!clientKey.startsWith("live") && <p className="text-center text-[12px] text-muted">테스트 결제 모드 · 실제 출금되지 않습니다</p>}
      </aside>
    </div>
  );
}

function Field({ id, label, value, onChange, ...rest }: { id: string; label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
    </div>
  );
}
