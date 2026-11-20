import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PanelTopOpen, Droplets, Network, Wrench, Check } from "lucide-react";

export const metadata: Metadata = { title: "솔루션" };

const sections = [
  {
    id: "opener",
    Icon: PanelTopOpen,
    t: "자동개폐 시스템",
    d: "측창·천창 개폐기와 컨트롤 박스로 온도에 따라 환기를 자동화합니다.",
    points: ["설정 온도 단계별 개방", "강우·강풍 감지 시 즉시 닫힘", "수동·자동 전환", "기존 하우스에 추가 설치 가능"],
    href: "/products?category=opener",
    cta: "개폐기 제품 보기",
  },
  {
    id: "nutrient",
    Icon: Droplets,
    t: "양액제어 시스템",
    d: "A·B 원액과 산을 자동 혼합해 설정 EC·pH로 구역별 공급합니다.",
    points: ["EC·pH 실시간 측정", "구역별 공급 스케줄", "배액률 관리", "이상 시 알림"],
    href: "/quote?product=nutrient-system",
    cta: "양액제어 견적 요청",
  },
  {
    id: "climate",
    Icon: Network,
    t: "복합환경제어",
    d: "온도·습도·CO₂·일사 데이터를 모아 개폐기, 커튼, 팬, 난방, 양액을 한 번에 제어합니다.",
    points: ["스마트폰 원격 모니터링", "작물별 제어 레시피", "데이터 기록·다운로드", "스마트팜 ICT 지원사업 연계"],
    href: "/quote?product=climate-controller",
    cta: "복합환경제어 견적 요청",
  },
  {
    id: "build",
    Icon: Wrench,
    t: "온실 설계·시공·A/S",
    d: "단동·연동 비닐온실과 유리온실을 설계·시공하고 자동화 설비를 설치합니다.",
    points: ["부지 측량·구조 설계", "자동화 설비 일괄 시공", "정기 점검", "부품 온라인 주문"],
    href: "/quote?product=greenhouse-build",
    cta: "시공 견적 요청",
  },
];

export default function SolutionsPage() {
  return (
    <div className="container-x pt-10">
      <p className="eyebrow">솔루션</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-5xl">온실 규모에 맞춘 4가지 자동화</h1>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="솔루션 바로가기">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="chip hover:border-brand hover:text-brand">{s.t}</a>
        ))}
      </nav>
      <div className="mt-10 space-y-6">
        {sections.map(({ id, Icon, t, d, points, href, cta }, i) => (
          <section key={id} id={id} className={`scroll-mt-24 grid gap-6 rounded-[32px] p-7 md:grid-cols-[1fr_1fr] md:p-10 ${i === 2 ? "bg-brand text-brand-ink" : "card"}`}>
            <div>
              <Icon className={`h-10 w-10 ${i === 2 ? "text-accent" : "text-brand"}`} strokeWidth={1.5} />
              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">{t}</h2>
              <p className={`mt-2 text-lg ${i === 2 ? "opacity-80" : "text-muted"}`}>{d}</p>
              <Link href={href} className={`mt-6 ${i === 2 ? "btn-accent" : "btn-primary"}`}>
                {cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid content-center gap-3">
              {points.map((p) => (
                <li key={p} className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium ${i === 2 ? "bg-white/10" : "bg-surface-2"}`}>
                  <Check className={`h-5 w-5 ${i === 2 ? "text-accent" : "text-brand"}`} /> {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
