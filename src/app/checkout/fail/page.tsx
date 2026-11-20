import Link from "next/link";
import { Suspense } from "react";
import { X } from "lucide-react";

export default function FailPage({ searchParams }: PageProps<"/checkout/fail">) {
  return (
    <div className="container-x max-w-xl pt-16">
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-danger/15 text-danger"><X className="h-7 w-7" /></div>
        <h1 className="mt-4 text-2xl font-bold">결제가 취소되었거나 실패했습니다</h1>
        <Suspense fallback={null}>
          <Reason searchParams={searchParams} />
        </Suspense>
        <Link href="/checkout" className="btn-primary mt-6">다시 결제하기</Link>
      </div>
    </div>
  );
}

async function Reason({ searchParams }: Pick<PageProps<"/checkout/fail">, "searchParams">) {
  const sp = await searchParams;
  const msg = typeof sp.message === "string" ? sp.message.slice(0, 200) : "";
  const code = typeof sp.code === "string" ? sp.code.slice(0, 60) : "";
  return msg ? <p className="mt-2 text-muted">{msg} {code && `(${code})`}</p> : null;
}
