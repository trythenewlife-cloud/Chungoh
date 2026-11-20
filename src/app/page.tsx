import Link from "next/link";
import { Suspense } from "react";
import { asc, eq } from "drizzle-orm";
import {
  ArrowRight,
  PanelTopOpen,
  Cpu,
  Droplets,
  Network,
  Wrench,
  Globe,
  Leaf,
  Recycle,
  Zap,
  ShieldCheck,
  ClipboardList,
  Phone,
} from "lucide-react";
import { db, schema } from "@/db";
import { GreenhouseArt } from "@/components/greenhouse-art";
import { LiveClimate } from "@/components/live-climate";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { company } from "@/lib/catalog";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Bento />
      <Process />
      <section className="container-x mt-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">제품몰</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">현장에서 가장 많이 찾는 제품</h2>
          </div>
          <Link href="/products" className="hidden items-center gap-1 font-semibold text-brand sm:inline-flex">
            전체 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Suspense fallback={<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)}</div>}>
          <FeaturedProducts />
        </Suspense>
      </section>
      <Eco />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-accent/25 blur-3xl" />
      <div className="container-x grid items-center gap-10 pb-10 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-16">
        <div>
          <p className="rise chip border-brand/20 bg-brand-soft font-semibold text-brand">
            <Leaf className="h-4 w-4" /> 2002년부터 온실 자동화 한 길
          </p>
          <h1 className="rise rise-2 mt-5 text-[40px] font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
            온실이 <span className="relative whitespace-nowrap text-brand">스스로<svg aria-hidden viewBox="0 0 120 12" className="absolute -bottom-1 left-0 h-3 w-full"><path d="M2 8 Q60 0 118 8" stroke="var(--accent)" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span>
            <br />
            숨 쉬게.
          </h1>
          <p className="rise rise-3 mt-5 max-w-xl text-lg text-muted">
            자동개폐기, 컨트롤 박스, 양액제어, 복합환경제어까지. 청오엔지니어링이 온도·습도·양액을 자동으로 맞춰 농가의 시간과 에너지를 아낍니다.
          </p>
          <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
            <Link href="/quote" className="btn-primary">
              <ClipboardList className="h-4 w-4" /> 3분 무료 견적
            </Link>
            <Link href="/products" className="btn-ghost">
              부품 바로 구매 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            전화 상담 <a href={`tel:${company.tel}`} className="font-semibold text-ink underline-offset-4 hover:underline">{company.tel}</a> · 평일 09:00–18:00
          </p>
        </div>
        <div className="relative">
          <GreenhouseArt />
          <div className="mt-4 md:absolute md:-bottom-10 md:-left-10 md:mt-0 md:w-[340px]">
            <LiveClimate />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "2002", l: "설립 연도" },
    { v: "6개국+", l: "수출 국가" },
    { v: "185억", l: "2025 매출(원)" },
    { v: "24시간", l: "자동 제어" },
  ];
  return (
    <section className="container-x mt-20 md:mt-24">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
        {items.map((s) => (
          <div key={s.l} className="bg-surface px-6 py-6">
            <dt className="text-sm text-muted">{s.l}</dt>
            <dd className="mt-1 text-3xl font-extrabold tracking-tight text-brand">{s.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-right text-[12px] text-muted">매출·수출 수치는 공개 기업정보 기준이며 청오 확인 후 갱신</p>
    </section>
  );
}

function Bento() {
  return (
    <section className="container-x mt-24">
      <p className="eyebrow">청오가 하는 일</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">개폐기 하나부터 스마트팜 전체까지</h2>
      <div className="mt-8 grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-4">
        <Link href="/products?category=opener" className="card group relative overflow-hidden p-7 md:col-span-2 md:row-span-2">
          <PanelTopOpen className="h-10 w-10 text-brand" strokeWidth={1.5} />
          <h3 className="mt-6 text-2xl font-bold">자동개폐기</h3>
          <p className="mt-2 max-w-sm text-muted">측창·천창을 온도에 맞춰 자동으로 열고 닫는 청오의 대표 제품. CODM 8102 시리즈.</p>
          <span className="mt-6 inline-flex items-center gap-1 font-semibold text-brand">제품 보기 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          <svg aria-hidden viewBox="0 0 200 120" className="absolute -bottom-6 -right-6 w-64 opacity-70">
            <path d="M10 110 Q100 -10 190 110" fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" />
            <path d="M40 110 Q100 30 160 110" fill="none" stroke="var(--brand)" strokeOpacity=".2" strokeWidth="10" strokeLinecap="round" />
          </svg>
        </Link>
        <Link href="/products?category=controller" className="card group p-6 md:col-span-2">
          <Cpu className="h-8 w-8 text-brand" strokeWidth={1.5} />
          <h3 className="mt-4 text-xl font-bold">개폐기 컨트롤 박스</h3>
          <p className="mt-1 text-muted">4CH·8CH 온도 연동, 강우 시 자동 닫힘.</p>
        </Link>
        <Link href="/solutions#nutrient" className="card group p-6">
          <Droplets className="h-8 w-8 text-brand" strokeWidth={1.5} />
          <h3 className="mt-4 text-xl font-bold">양액제어</h3>
          <p className="mt-1 text-muted">EC·pH 자동 조제.</p>
        </Link>
        <Link href="/solutions#climate" className="group rounded-3xl bg-brand p-6 text-brand-ink">
          <Network className="h-8 w-8 text-accent" strokeWidth={1.5} />
          <h3 className="mt-4 text-xl font-bold">복합환경제어</h3>
          <p className="mt-1 opacity-80">스마트폰 원격 관리.</p>
        </Link>
        <Link href="/solutions#build" className="card group p-6 md:col-span-2">
          <Wrench className="h-8 w-8 text-brand" strokeWidth={1.5} />
          <h3 className="mt-4 text-xl font-bold">온실 설계·시공·A/S</h3>
          <p className="mt-1 text-muted">단동·연동 온실 시공부터 설비 유지보수까지.</p>
        </Link>
        <div className="card flex flex-col justify-between p-6 md:col-span-2">
          <Globe className="h-8 w-8 text-brand" strokeWidth={1.5} />
          <div>
            <h3 className="mt-4 text-xl font-bold">세계로 수출</h3>
            <p className="mt-1 text-muted">북미·스페인·멕시코·우즈베키스탄·일본·중국.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "견적 요청", d: "작물·면적·필요 설비를 3단계로 입력" },
    { n: "02", t: "현장 상담", d: "담당자가 연락 후 현장 확인" },
    { n: "03", t: "설계·시공", d: "자동화 설비 설치와 제어 설정" },
    { n: "04", t: "원격 관리·A/S", d: "스마트폰 모니터링, 부품은 온라인 주문" },
  ];
  return (
    <section className="container-x mt-24">
      <p className="eyebrow">진행 과정</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">상담부터 A/S까지 4단계</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="card p-6">
            <span className="text-sm font-bold text-brand">{s.n}</span>
            <h3 className="mt-2 text-lg font-bold">{s.t}</h3>
            <p className="mt-1 text-[15px] text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

async function FeaturedProducts() {
  const items = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.isActive, true))
    .orderBy(asc(schema.products.sort))
    .limit(4);
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}

function Eco() {
  const items = [
    { Icon: Zap, t: "에너지 절감", d: "필요한 만큼만 열고 닫아 난방·냉방 손실을 줄입니다." },
    { Icon: Droplets, t: "물·양액 절약", d: "EC·pH 기반 정밀 공급으로 배액을 줄입니다." },
    { Icon: Recycle, t: "오래 쓰는 설비", d: "부품 단위 교체로 장비 전체를 버리지 않습니다." },
    { Icon: ShieldCheck, t: "작물 보호", d: "강우·강풍 감지 시 즉시 닫아 피해를 막습니다." },
  ];
  return (
    <section className="mt-24 bg-brand text-brand-ink">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1fr_1.4fr] md:py-20">
        <div>
          <p className="text-sm font-semibold text-accent">친환경 자동화</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">덜 쓰고, 더 키웁니다</h2>
          <p className="mt-4 opacity-80">자동화는 사람의 일을 줄이고, 자원의 낭비도 줄입니다. 청오의 제어 기술이 지속가능한 농업을 돕습니다.</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map(({ Icon, t, d }) => (
            <li key={t} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <Icon className="h-7 w-7 text-accent" />
              <h3 className="mt-3 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-[15px] opacity-80">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-x mt-24">
      <div className="relative overflow-hidden rounded-[32px] bg-accent p-8 text-accent-ink sm:p-12">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">우리 온실엔 무엇이 필요할까?</h2>
          <p className="mt-3 text-lg opacity-80">작물과 면적만 알려주시면 담당자가 맞춤 구성을 제안합니다. 스마트팜 지원사업 신청도 함께 도와드립니다.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/quote" className="btn bg-accent-ink text-accent hover:opacity-90">
              무료 견적 받기 <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${company.tel}`} className="btn border border-accent-ink/20 bg-white/40 text-accent-ink">
              <Phone className="h-4 w-4" /> 전화 상담
            </a>
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-10 -top-10 w-80 opacity-30">
          <path d="M20 180 Q100 0 180 180" fill="none" stroke="#13240f" strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
