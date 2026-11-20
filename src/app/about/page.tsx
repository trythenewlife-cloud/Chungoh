import type { Metadata } from "next";
import { MapPin, Phone, Mail, Award, Factory, Globe, Sprout } from "lucide-react";
import { company } from "@/lib/catalog";

export const metadata: Metadata = { title: "회사소개" };

const history = [
  { y: "2002", t: "(주)청오엔지니어링 설립, 대전" },
  { y: "2000s", t: "비닐하우스 자동개폐기 국산화" },
  { y: "2010s", t: "개폐기 컨트롤 박스·양액제어 시스템 출시" },
  { y: "2020s", t: "복합환경제어, 해외 6개국 이상 수출" },
  { y: "2026", t: "온라인 직판몰 오픈" },
];

export default function AboutPage() {
  return (
    <div className="container-x pt-10">
      <p className="eyebrow">회사소개</p>
      <h1 className="mt-1 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
        농부의 손을 덜어주는 기술을 <span className="text-brand">20년 넘게</span> 만들어 왔습니다
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        청오엔지니어링은 온실 자동화 전문기업입니다. 자동개폐기와 컨트롤러, 양액제어, 복합환경제어 시스템을 직접 개발·생산하고, 온실 시공과 유지보수까지 책임집니다.
      </p>

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
          <p className="mt-2 text-sm text-muted">연혁 세부 내용은 청오 자료를 받아 교체합니다.</p>
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
          {["특허 (자료 대기)", "KC 인증 (자료 대기)", "벤처기업 (확인 필요)", "ISO (확인 필요)"].map((t) => (
            <div key={t} className="card flex aspect-[3/4] flex-col items-center justify-center gap-3 p-4 text-center text-muted">
              <Award className="h-10 w-10 text-brand" strokeWidth={1.3} />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2" id="location">
        <div className="card p-6">
          <h2 className="text-2xl font-bold">오시는 길</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-2"><MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" /> {company.address}</li>
            <li className="flex gap-2"><Phone className="mt-1 h-5 w-5 shrink-0 text-brand" /> <a href={`tel:${company.tel}`}>{company.tel}</a></li>
            <li className="flex gap-2"><Mail className="mt-1 h-5 w-5 shrink-0 text-brand" /> {company.email}</li>
          </ul>
          <a className="btn-ghost mt-6" href={`https://map.naver.com/p/search/${encodeURIComponent(company.address)}`} target="_blank" rel="noreferrer">
            네이버 지도에서 보기
          </a>
        </div>
        <div className="card grid min-h-56 place-items-center bg-surface-2 text-muted">지도 영역 (네이버·카카오 지도 API 키 발급 후 표시)</div>
      </section>
    </div>
  );
}
