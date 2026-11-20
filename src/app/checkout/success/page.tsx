import Link from "next/link";
import { Suspense } from "react";
import { Check, X } from "lucide-react";
import { confirmOrderPayment } from "@/lib/orders";
import { won } from "@/lib/pricing";
import { ClearCart } from "./clear-cart";

export default function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <div className="container-x max-w-xl pt-16">
      <Suspense fallback={<div className="card p-10 text-center text-muted">결제를 확인하고 있습니다…</div>}>
        <Confirm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Confirm({ searchParams }: Pick<PageProps<"/checkout/success">, "searchParams">) {
  const sp = await searchParams;
  const paymentKey = String(sp.paymentKey ?? "");
  const orderId = String(sp.orderId ?? "");
  const amount = Number(sp.amount ?? NaN);

  const r = await confirmOrderPayment(orderId, paymentKey, amount);
  if (!r.ok) return <Fail msg={r.error} />;
  return <Done orderNo={r.order.orderNo} total={r.order.total} name={r.order.orderName} />;
}

function Done({ orderNo, total, name }: { orderNo: string; total: number; name: string }) {
  return (
    <div className="card p-8 text-center">
      <ClearCart />
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink"><Check className="h-7 w-7" /></div>
      <h1 className="mt-4 text-2xl font-bold">결제가 완료되었습니다</h1>
      <p className="mt-2 text-muted">{name}</p>
      <dl className="mx-auto mt-6 max-w-xs space-y-2 text-left text-[15px]">
        <div className="flex justify-between"><dt className="text-muted">주문번호</dt><dd className="font-bold">{orderNo}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">결제 금액</dt><dd className="font-bold">{won(total)}</dd></div>
      </dl>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/mypage" className="btn-ghost">주문 내역</Link>
        <Link href="/products" className="btn-primary">계속 쇼핑</Link>
      </div>
    </div>
  );
}

function Fail({ msg }: { msg: string }) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-danger/15 text-danger"><X className="h-7 w-7" /></div>
      <h1 className="mt-4 text-2xl font-bold">결제를 완료하지 못했습니다</h1>
      <p className="mt-2 text-muted">{msg}</p>
      <Link href="/cart" className="btn-primary mt-6">장바구니로</Link>
    </div>
  );
}
