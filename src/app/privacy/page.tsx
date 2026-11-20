import type { Metadata } from "next";
import { company } from "@/lib/catalog";

export const metadata: Metadata = { title: "개인정보처리방침" };

// 개인정보보호법 제30조 기재사항 기준 초안. 시행 전 청오 및 법률 검토 필요.
export default function PrivacyPage() {
  const rows = [
    ["회원가입", "이메일, 비밀번호(암호화), 이름, 휴대폰, 사업자번호(사업자 회원)", "회원 탈퇴 시까지"],
    ["주문·배송", "주문자명, 이메일, 휴대폰, 배송지 주소, 결제 정보(결제사 처리)", "전자상거래법에 따라 5년"],
    ["견적 상담", "이름, 휴대폰, 지역, 이메일(선택)", "상담 종료 후 1년"],
    ["소비자 불만·분쟁", "상담 기록", "3년"],
  ];
  return (
    <article className="container-x max-w-3xl pt-10">
      <h1 className="text-3xl font-bold">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-muted">시행일: 오픈일 기재 · 초안 (법률 검토 전)</p>
      <div className="mt-8 space-y-8 text-[16px] leading-relaxed">
        <section>
          <h2 className="text-xl font-bold">1. 수집 항목·목적·보유 기간</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-[15px]">
              <thead className="border-b border-line text-muted"><tr><th className="py-2">목적</th><th>항목</th><th>보유 기간</th></tr></thead>
              <tbody className="divide-y divide-line">{rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c} className="py-2 pr-3 align-top">{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold">2. 안전성 확보 조치</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>휴대폰 번호, 주소, 사업자번호는 AES-256-GCM으로 암호화해 저장합니다.</li>
            <li>비밀번호는 bcrypt 단방향 해시로 저장합니다.</li>
            <li>카드 정보는 저장하지 않으며 토스페이먼츠가 처리합니다.</li>
            <li>관리자 화면은 권한이 있는 계정만 접근하며 처리 기록을 남깁니다.</li>
            <li>전 구간 HTTPS로 전송합니다.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold">3. 제3자 제공·처리 위탁</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>결제 처리: (주)토스페이먼츠</li>
            <li>배송: 계약 택배사 (오픈 전 기재)</li>
            <li>호스팅·DB: Vercel Inc., Supabase Inc. (국외 이전 여부와 국가 기재 필요)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold">4. 정보주체의 권리</h2>
          <p className="mt-3">이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 마이페이지 또는 아래 연락처로 요청하시면 지체 없이 조치합니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold">5. 개인정보 보호책임자</h2>
          <p className="mt-3">{company.name} · 담당자 (기재 필요) · {company.tel} · {company.email}</p>
        </section>
      </div>
    </article>
  );
}
