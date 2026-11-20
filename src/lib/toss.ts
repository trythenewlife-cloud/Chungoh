import "server-only";

// 토스페이먼츠 코어 API (https://docs.tosspayments.com/reference)
const API = "https://api.tosspayments.com/v1";

function authHeader() {
  const key = process.env.TOSS_SECRET_KEY;
  if (!key) throw new Error("TOSS_SECRET_KEY is not set");
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export type TossPayment = {
  paymentKey: string;
  orderId: string;
  status: string;
  method?: string;
  totalAmount: number;
  approvedAt?: string;
};

export type TossResult<T> = { ok: true; data: T } | { ok: false; code: string; message: string };

async function call<T>(path: string, body: unknown, idempotencyKey?: string): Promise<TossResult<T>> {
  const res = await fetch(API + path, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, code: json.code ?? String(res.status), message: json.message ?? "결제 처리 중 오류가 발생했습니다." };
  return { ok: true, data: json as T };
}

// 결제 승인: 위젯 결제 후 successUrl로 돌아온 paymentKey·orderId·amount를 서버에서 확정
export function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  return call<TossPayment>("/payments/confirm", { paymentKey, orderId, amount }, `confirm-${orderId}`);
}

export function cancelPayment(paymentKey: string, cancelReason: string) {
  return call<TossPayment>(`/payments/${encodeURIComponent(paymentKey)}/cancel`, { cancelReason }, `cancel-${paymentKey}`);
}
