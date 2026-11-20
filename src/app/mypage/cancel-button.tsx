"use client";

import { useTransition } from "react";
import { cancelMyOrder } from "@/app/actions/order";

export function CancelButton({ orderNo }: { orderNo: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      className="font-semibold text-danger underline-offset-4 hover:underline disabled:opacity-50"
      disabled={pending}
      onClick={() => {
        if (!confirm("주문을 취소하고 결제를 환불할까요?")) return;
        start(async () => {
          const r = await cancelMyOrder(orderNo);
          if (!r.ok) alert(r.error);
        });
      }}
    >
      {pending ? "취소 중…" : "주문 취소"}
    </button>
  );
}
