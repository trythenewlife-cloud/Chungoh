import type { Metadata } from "next";
import { MapPin, Phone, Mail, Award, Factory, Globe, Sprout } from "lucide-react";
import { company } from "@/lib/catalog";
import { Suspense } from "react";
import { NaverMap } from "@/components/naver-map";
import { getSetting, settingKeys } from "@/lib/settings";

export const metadata: Metadata = { title: "회사소개" };

// 출처: 기존 사이트(chung-oh.co.kr) 회사연혁·인사말·경영목표, 2026-11-21 확인
const history = [
  { y: "2002. 8", t: "(주)주연엔지니어링 설립, 곤지암 제1공장 설립" },
  { y: "2004. 10", t: "온실자동화 개폐장치 생산·판매 시작, 대전 제2공장 설립" },
  { y: "2006. 10", t: "(주)청오엔지니어링으로 상호 변경" },
  { y: "2007. 6", t: "고양 화훼단지 50,000평 자동개폐기·자동제어기 납품" },
  { y: "2007. 8", t: "내재형 온실 강판 조리개 생산" },
  { y: "2008. 7", t: "기업부설연구소 설립" },
  { y: "2008. 11", t: "유성헬리컬형 자동개폐기 생산, 특허 취득" },
  { y: "2009. 10", t: "ISO 9001 인증" },
  { y: "2013. 8", t: "양축용 자동개폐기 생산" },
  { y: "2014. 6", t: "수동겸용 자동개폐기 생산, 특허 출원" },
  { y: "2014. 7", t: "경영혁신형 중소기업(MAIN-BIZ) 인증" },
  { y: "2015. 5", t: "대전 대덕구 공장 신축·이전" },
];

const values = ["신속 · 정확", "근면 · 성실", "창의 · 개발"];

export default function AboutPage() {
  return (
    <div className="container-x pt-10">
      <p className="eyebrow">회사소개</p>
      <h1 className="mt-1 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
        농부의 손을 덜어주는 기술을 <span className="text-brand">20년 넘게</span> 만들어 왔습니다
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        청오엔지니어링은 2002년 비닐하우스 내부 시설공사와 양액 공급시스템 제작·시공으로 출발한 온실 자동화 회사입니다. 2004년부터 비닐하우스용 자동개폐기와 커튼개폐기를 생산하고, 이를 제어하는 컨트롤 판넬을 제작·판매·시공합니다.
      </p>

      <section className="card mt-10 p-7 md:p-10">
        <h2 className="text-2xl font-bold">대표 인사말</h2>
        <div className="mt-4 max-w-3xl space-y-3 text-[17px] leading-relaxed text-muted">
          <p>
            (주)청오엔지니어링은 고객우선주의와 품질제일주의를 경영이념으로 삼고 있습니다. 꾸준한 연구개발로 신제품을 만들어 국내와 해외 시장을 넓혀 가고 있습니다.
          </p>
          <p>
            앞으로 다각적이고 미래지향적인 친환경 인식제어 프로그램과 ICT 융복합 그린하우스 환경을 제공해, 고객 만족을 최우선으로 하는 기업으로 성장하겠습니다.
          </p>
        </div>
        <p className="mt-6 font-semibold">{company.name} 대표이사 {company.ceo}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">경영목표</h2>
        <p className="mt-2 text-muted">가장 좋은 품질과 기술로 고객의 신뢰를 받는 기업</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v} className="card p-6 text-center text-xl font-bold text-brand">{v}</div>
          ))}
        </div>
      </section>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { Icon: Factory, t: "직접 개발·생산", d: "개폐 모터부터 제어반까지 자체 설계와 생산" },
          { Icon: Globe, t: "해외 수출", d: "북미·스페인·멕시코·우즈베키스탄·일본·중국" },
          { Icon: Sprout, t: "현장 중심 A/S", d: "부품 단위 교체와 원격 점검" },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="card p-6">
            <Icon className="h-8 w-8 text-brand" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-bold">{t}</h2>
            <p className="mt-1 text-muted">{d}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 grid gap-10 md:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="text-2xl font-bold">걸어온 길</h2>
          <p className="mt-2 text-sm text-muted">2002년 설립부터 2015년 공장 이전까지</p>
        </div>
        <ol className="relative space-y-6 border-l-2 border-line pl-6">
          {history.map((h) => (
            <li key={h.y} className="relative">
              <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-bg bg-brand" />
              <div className="text-sm font-bold text-brand">{h.y}</div>
              <div className="font-semibold">{h.t}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">인증·특허</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {["ISO 9001 인증 (2009)", "메인비즈 인증 (2014)", "유성헬리컬형 자동개폐기 특허 (2008)", "기업부설연구소 (2008)"].map((t) => (
            <div key={t} className="card flex aspect-[3/4] flex-col items-center justify-center gap-3 p-4 text-center text-muted">
              <Award className="h-10 w-10 text-brand" strokeWidth={1.3} />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={<Location />}>
        <LocationWithMap />
      </Suspense>
    </div>
  );
}

// 지도는 관리자 설정에 네이버 지도 Client ID 가 있을 때만 보인다.
async function LocationWithMap() {
  const clientId = await getSetting(settingKeys.naverMapClientId);
  return <Location mapClientId={clientId} />;
}

function Location({ mapClientId }: { mapClientId?: string | null }) {
  return (
    <section className={`mt-16 grid gap-6 ${mapClientId ? "md:grid-cols-2" : ""}`} id="location">
      <div className="card p-6">
        <h2 className="text-2xl font-bold">오시는 길</h2>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-2"><MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" /> <span>{company.address}<br /><span className="text-sm text-muted">지번 {company.addressJibun}</span></span></li>
          <li className="flex gap-2"><Phone className="mt-1 h-5 w-5 shrink-0 text-brand" /> <span><a href={`tel:${company.tel}`}>{company.tel}</a> <span className="text-sm text-muted">· 팩스 {company.fax}</span></span></li>
          <li className="flex gap-2"><Mail className="mt-1 h-5 w-5 shrink-0 text-brand" /> {company.email}</li>
        </ul>
        <a className="btn-ghost mt-6" href={`https://map.naver.com/p/search/${encodeURIComponent(company.address)}`} target="_blank" rel="noreferrer">
          네이버 지도에서 보기
        </a>
      </div>
      {mapClientId && <NaverMap clientId={mapClientId} address={company.address} title="청오엔지니어링" />}
    </section>
  );
}
