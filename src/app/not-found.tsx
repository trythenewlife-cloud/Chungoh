import Link from "next/link";
import { Sprout } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <Sprout className="h-12 w-12 text-brand" strokeWidth={1.4} />
      <h1 className="mt-4 text-3xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-muted">주소가 바뀌었거나 판매가 종료된 상품일 수 있습니다.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/products" className="btn-ghost">제품몰</Link>
        <Link href="/" className="btn-primary">홈으로</Link>
      </div>
    </div>
  );
}
