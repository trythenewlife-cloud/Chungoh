"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart";
import { ProductVisual } from "@/components/product-visual";
import { calcTotals, won, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export default function CartPage() {
  const { lines, ready, setQty, remove } = useCart();
  const t = calcTotals(lines);
  const left = FREE_SHIPPING_THRESHOLD - t.itemsTotal;

  return (
    <div className="container-x pt-10">
      <h1 className="text-3xl font-bold tracking-tight">장바구니</h1>
      {!ready ? (
        <div className="card mt-6 h-40 animate-pulse" />
      ) : lines.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-4 p-12 text-center">
          <ShoppingCart className="h-10 w-10 text-muted" />
          <p className="text-muted">장바구니가 비어 있습니다.</p>
          <Link href="/products" className="btn-primary">제품 보러 가기</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={l.productId} className="card flex gap-4 p-3 sm:p-4">
                <Link href={`/products/${l.slug}`} className="w-24 shrink-0 overflow-hidden rounded-2xl sm:w-28">
                  <ProductVisual category={l.category} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${l.slug}`} className="font-bold leading-snug">{l.name}</Link>
                    <button onClick={() => remove(l.productId)} className="rounded-full p-1.5 text-muted hover:bg-surface-2" aria-label={`${l.name} 삭제`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-line">
                      <button className="p-2" onClick={() => setQty(l.productId, l.qty - 1)} aria-label="수량 줄이기"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center font-semibold tabular-nums">{l.qty}</span>
                      <button className="p-2" onClick={() => setQty(l.productId, l.qty + 1)} aria-label="수량 늘리기"><Plus className="h-4 w-4" /></button>
                    </div>
                    <span className="font-extrabold tabular-nums">{won(l.price * l.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="card h-fit space-y-3 p-6 lg:sticky lg:top-24">
            {left > 0 ? (
              <p className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">{won(left)} 더 담으면 무료배송</p>
            ) : (
              <p className="rounded-xl bg-accent/40 px-3 py-2 text-sm font-semibold">무료배송 적용</p>
            )}
            <Row k="상품 금액" v={won(t.itemsTotal)} />
            <Row k="배송비" v={t.shippingFee ? won(t.shippingFee) : "무료"} />
            <div className="border-t border-line pt-3">
              <Row k="결제 예정 금액" v={won(t.total)} strong />
            </div>
            <Link href="/checkout" className="btn-primary w-full">주문하기</Link>
            <p className="text-center text-[13px] text-muted">회원·비회원 모두 주문할 수 있습니다</p>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={strong ? "font-bold" : "text-muted"}>{k}</span>
      <span className={`tabular-nums ${strong ? "text-xl font-extrabold" : "font-semibold"}`}>{v}</span>
    </div>
  );
}
