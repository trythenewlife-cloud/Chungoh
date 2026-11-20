"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "co_cart_v1";

// 장바구니는 브라우저에만 저장. 가격은 결제 직전에 서버가 DB 값으로 다시 계산한다.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 저장소 값은 마운트 후에만 읽을 수 있음
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.productId === line.productId);
      if (found) return prev.map((l) => (l.productId === line.productId ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...prev, { ...line, qty }];
    });
  }, []);

  const setQty = useCallback((productId: number, qty: number) => {
    setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l)));
  }, []);

  const remove = useCallback((productId: number) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, ready, count: lines.reduce((s, l) => s + l.qty, 0), add, setQty, remove, clear }),
    [lines, ready, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
