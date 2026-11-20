"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart, type CartLine } from "./cart";
import { won } from "@/lib/pricing";

export function AddToCart({ product, stock }: { product: Omit<CartLine, "qty">; stock: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = stock <= 0;
  const max = Math.min(99, stock);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-surface-2 p-3">
        <div className="flex items-center rounded-full border border-line bg-surface">
          <button className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="수량 줄이기" disabled={soldOut}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-bold tabular-nums" aria-live="polite">{qty}</span>
          <button className="p-3" onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label="수량 늘리기" disabled={soldOut}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted">합계</div>
          <div className="text-xl font-extrabold tabular-nums">{won(product.price * qty)}</div>
        </div>
      </div>
      <p className="text-sm text-muted">{soldOut ? "품절된 상품입니다." : `재고 ${stock}개`}</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="btn-ghost"
          disabled={soldOut}
          onClick={() => {
            add(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
          }}
        >
          {added ? <Check className="h-4 w-4 text-brand" /> : <ShoppingCart className="h-4 w-4" />}
          {added ? "담았습니다" : "장바구니"}
        </button>
        <button
          className="btn-primary"
          disabled={soldOut}
          onClick={() => {
            add(product, qty);
            router.push("/cart");
          }}
        >
          바로 구매
        </button>
      </div>
    </div>
  );
}
