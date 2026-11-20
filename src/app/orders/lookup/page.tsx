"use client";

import { useState, useTransition } from "react";
import { lookupOrder, type LookupResult } from "@/app/actions/order";
import { orderStatusLabel } from "@/lib/catalog";
import { won } from "@/lib/pricing";

export default function LookupPage() {
  const [pending, start] = useTransition();
  const [res, setRes] = useState<LookupResult | null>(null);

  return (
    <div className="container-x max-w-md pt-14">
      <h1 className="text-3xl font-bold tracking-tight">비회원 주문조회</h1>
      <form
        className="card mt-6 space-y-4 p-6"
        action={(fd) => start(async () => setRes(await lookupOrder(String(fd.get("orderNo")), String(fd.get("email")))))}
      >
        <div>
          <label className="label" htmlFor="orderNo">주문번호</label>
          <input id="orderNo" name="orderNo" required className="input" placeholder="CO20261120-XXXXXXXX" />
        </div>
        <div>
          <label className="label" htmlFor="email">주문 시 입력한 이메일</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <button className="btn-primary w-full" disabled={pending}>{pending ? "조회 중…" : "조회하기"}</button>
      </form>
      {res && !res.ok && <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger" role="alert">{res.error}</p>}
      {res?.ok && (
        <div className="card mt-4 space-y-2 p-6 text-[15px]">
          <div className="flex justify-between"><span className="text-muted">상태</span><b>{orderStatusLabel[res.order.status]}</b></div>
          <div className="flex justify-between"><span className="text-muted">주문자</span><span>{res.order.ordererName}</span></div>
          <div className="flex justify-between"><span className="text-muted">주문일</span><span>{new Date(res.order.createdAt).toLocaleDateString("ko-KR")}</span></div>
          <ul className="border-t border-line pt-2">
            {res.order.items.map((i) => <li key={i.name} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{won(i.price * i.qty)}</span></li>)}
          </ul>
          <div className="flex justify-between border-t border-line pt-2 font-extrabold"><span>합계</span><span>{won(res.order.total)}</span></div>
          {res.order.trackingNo && <p className="text-muted">송장 {res.order.carrier} {res.order.trackingNo}</p>}
        </div>
      )}
    </div>
  );
}
