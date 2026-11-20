import type { Metadata } from "next";
import { company } from "@/lib/catalog";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <article className="container-x max-w-3xl pt-10">
      <h1 className="text-3xl font-bold">이용약관</h1>
      <p className="mt-2 text-sm text-muted">초안 · 공정거래위원회 전자상거래 표준약관을 바탕으로 오픈 전 확정</p>
      <div className="mt-8 space-y-6 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold">청약철회 (교환·반품)</h2>
          <p className="mt-2">상품을 받은 날부터 7일 이내에 청약철회를 할 수 있습니다. 설치·사용으로 가치가 크게 떨어진 경우, 주문 제작 상품은 제외됩니다. 단순 변심 반품 배송비는 구매자가 부담합니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold">견적 상품</h2>
          <p className="mt-2">시스템·시공 상품은 별도 계약서에 따라 진행하며, 이 약관의 청약철회 조항은 계약서 내용을 따릅니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold">사업자 정보</h2>
          <p className="mt-2">{company.name} · 대표 {company.ceo} · {company.address} · 사업자등록번호 {company.bizNo}</p>
        </section>
      </div>
    </article>
  );
}
