// 배송비 정책 (임시값, 청오 확인 후 변경)
export const FREE_SHIPPING_THRESHOLD = 50_000;
export const SHIPPING_FEE = 4_000;

export type PricedLine = { price: number; qty: number };

export function calcTotals(lines: PricedLine[]) {
  const itemsTotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const shippingFee = itemsTotal === 0 || itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { itemsTotal, shippingFee, total: itemsTotal + shippingFee };
}

export function orderName(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names[0]} 외 ${names.length - 1}건`;
}

export function won(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

// 주문번호: CO + yyyymmdd + 6자리 영숫자 (토스 orderId 규칙: 6~64자 영문/숫자/-/_)
export function makeOrderNo(prefix: "CO" | "QT", now: Date, rand: string): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${prefix}${y}${m}${d}-${rand.toUpperCase()}`;
}
