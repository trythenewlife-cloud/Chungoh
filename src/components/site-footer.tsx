import Link from "next/link";
import { Logo } from "./logo";
import { company } from "@/lib/catalog";

// 전자상거래법 제10조: 상호, 대표자, 주소, 전화, 사업자등록번호, 통신판매업 신고번호 표시
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-x grid gap-8 py-12 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="text-[15px] text-muted">온실을 스스로 숨 쉬게 하는 자동화. {company.founded}년부터 대전에서 만듭니다.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-[15px]">
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-brand">회사소개</Link></li>
            <li><Link href="/solutions" className="hover:text-brand">솔루션</Link></li>
            <li><Link href="/cases" className="hover:text-brand">시공사례</Link></li>
            <li><Link href="/products" className="hover:text-brand">제품몰</Link></li>
          </ul>
          <ul className="space-y-2">
            <li><Link href="/quote" className="hover:text-brand">견적문의</Link></li>
            <li><Link href="/orders/lookup" className="hover:text-brand">비회원 주문조회</Link></li>
            <li><Link href="/terms" className="hover:text-brand">이용약관</Link></li>
            <li><Link href="/privacy" className="font-bold hover:text-brand">개인정보처리방침</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x space-y-1 py-6 text-[13px] leading-relaxed text-muted">
          <p>
            상호 {company.name} · 대표 {company.ceo} · 주소 {company.address}
          </p>
          <p>
            사업자등록번호 {company.bizNo} · 통신판매업 신고 {company.mailOrderNo} · 전화 {company.tel} · 이메일 {company.email}
          </p>
          <p>© {company.nameEn}</p>
        </div>
      </div>
    </footer>
  );
}
