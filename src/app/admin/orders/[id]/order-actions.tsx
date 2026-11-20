"use client";

import { useActionState, useState, useTransition } from "react";
import { updateOrder, adminCancelOrder } from "@/app/actions/admin";
import { orderStatusLabel } from "@/lib/catalog";

const carriers = ["CJ대한통운", "한진택배", "롯데택배", "우체국택배", "로젠택배", "화물 직배송"];

export function OrderActions({ id, status, carrier, trackingNo }: { id: string; status: string; carrier: string; trackingNo: string }) {
  const [state, action, pending] = useActionState(updateOrder, undefined);
  const [cancelPending, start] = useTransition();
  const [cancelMsg, setCancelMsg] = useState("");
  const editable = status !== "pending" && status !== "cancelled";

  if (!editable) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form action={action} className="card space-y-3 p-5">
        <h2 className="font-bold">상태·송장</h2>
        <input type="hidden" name="id" value={id} />
        <div className="grid gap-3 sm:grid-cols-3">
          <select name="status" defaultValue={status} className="input" aria-label="주문 상태">
            {(["paid", "preparing", "shipping", "delivered"] as const).map((s) => <option key={s} value={s}>{orderStatusLabel[s]}</option>)}
          </select>
          <select name="carrier" defaultValue={carrier || carriers[0]} className="input" aria-label="택배사">
            {carriers.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input name="trackingNo" defaultValue={trackingNo} placeholder="송장번호" className="input" aria-label="송장번호" />
        </div>
        {state?.error && <p className="text-sm font-semibold text-danger" role="alert">{state.error}</p>}
        {state?.ok && <p className="text-sm font-semibold text-brand">저장했습니다.</p>}
        <button className="btn-primary" disabled={pending}>{pending ? "저장 중…" : "저장"}</button>
      </form>
      {(status === "paid" || status === "preparing") && (
        <div className="card space-y-3 p-5">
          <h2 className="font-bold">결제 취소·환불</h2>
          <p className="text-[15px] text-muted">토스페이먼츠로 전액 환불하고 재고를 되돌립니다.</p>
          <button
            className="btn border border-danger/30 text-danger hover:bg-danger/10"
            disabled={cancelPending}
            onClick={() => {
              const reason = prompt("취소 사유를 입력하세요", "재고 부족");
              if (reason === null) return;
              start(async () => {
                const r = await adminCancelOrder(id, reason);
                setCancelMsg(r.ok ? "취소했습니다." : r.error ?? "실패");
              });
            }}
          >
            {cancelPending ? "취소 중…" : "결제 취소"}
          </button>
          {cancelMsg && <p className="text-sm font-semibold">{cancelMsg}</p>}
        </div>
      )}
    </div>
  );
}
