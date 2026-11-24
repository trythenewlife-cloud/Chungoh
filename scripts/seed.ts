import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema";

// 시드 데이터: 기존 사이트(chung-oh.co.kr) 제품소개의 모델명·사양을 옮겼다 (2026-11-21 확인).
// 가격·재고는 기존 사이트에 없어 임시값이다. 관리자 화면에서 실제 값으로 교체한다.

const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(sql, { schema });

const products: (typeof schema.products.$inferInsert)[] = [
  // 자동개폐기
  {
    slug: "codm-81024",
    name: "비닐 개폐장치 CODM 81024",
    category: "opener",
    summary: "비닐하우스 측창·천창 비닐을 감아 올리는 DC 자동개폐기",
    description:
      "비닐하우스 측창과 천창 비닐을 권취축으로 감아 열고 닫는 DC 감속 모터입니다. 청오 자동제어판넬과 연결해 온도에 따라 자동으로 운전합니다. 같은 계열에 CODM 81022, 81028이 있습니다.",
    price: 168000,
    stock: 40,
    badge: "대표상품",
    sort: 1,
    specs: { 용도: "비닐 개폐", 전원: "DC 24V", 계열모델: "CODM 81022 · 81024 · 81028", 호환제어판넬: "DC 자동제어판넬 수동·자동 타입" },
  },
  {
    slug: "codm-81024m",
    name: "수동겸용 비닐 개폐장치 CODM 81024M",
    category: "opener",
    summary: "정전 때도 손으로 열고 닫을 수 있는 수동겸용 자동개폐기",
    description: "자동 운전과 수동 조작을 함께 쓰는 모델입니다. 2014년 수동겸용 자동개폐기로 생산을 시작하고 특허를 출원했습니다.",
    price: 185000,
    stock: 25,
    badge: "특허출원",
    sort: 2,
    specs: { 용도: "비닐 개폐 (수동겸용)", 전원: "DC 24V", 특징: "수동 핸들 겸용" },
  },
  {
    slug: "codm-81034s",
    name: "부직포 개폐장치 CODM 81034S",
    category: "opener",
    summary: "부직포 보온막을 감는 고토크 DC 개폐기",
    description: "비닐보다 무거운 부직포 보온막을 감아 올리는 모델입니다. 같은 계열에 CODM 81038S, 81044, 81048이 있습니다.",
    price: 198000,
    stock: 20,
    sort: 3,
    specs: { 용도: "부직포 개폐", 전원: "DC 24V", 계열모델: "CODM 81034S · 81038S · 81044 · 81048" },
  },
  {
    slug: "codm-81054",
    name: "보온덮개 개폐장치 CODM 81054",
    category: "opener",
    summary: "두꺼운 보온덮개(다겹 보온커튼)용 DC 개폐기",
    description: "겨울철 보온덮개를 감아 열고 닫는 모델입니다. 같은 계열에 CODM 81058, 81064, 81068이 있습니다.",
    price: 215000,
    stock: 15,
    sort: 4,
    specs: { 용도: "보온덮개 개폐", 전원: "DC 24V", 계열모델: "CODM 81054 · 81058 · 81064 · 81068" },
  },
  {
    slug: "codm-81042d",
    name: "DC 양축형 천창·수평커텐 개폐장치 CODM 81042D",
    category: "opener",
    summary: "양쪽으로 축이 나온 DC 개폐기, 천창과 수평커텐용",
    description: "모터 양쪽으로 구동축이 나와 천창과 수평커텐을 함께 구동합니다. 같은 계열에 CODM 81044D, 81048D, 81062D가 있습니다.",
    price: 238000,
    stock: 12,
    sort: 5,
    specs: { 용도: "천창·수평커텐", 전원: "DC 24V", 형식: "양축형", 계열모델: "CODM 81042D · 81044D · 81048D · 81062D" },
  },
  {
    slug: "coam-81042da",
    name: "AC 양축형 천창·수평커텐 개폐장치 COAM 81042DA",
    category: "opener",
    summary: "AC 전원 양축형 개폐기, 연동하우스 천창·수평커텐용",
    description: "AC 전원으로 구동하는 양축형 개폐기입니다. 같은 계열에 COAM 81044DA, 81048DA, 81062DA가 있습니다.",
    price: 258000,
    stock: 10,
    sort: 6,
    specs: { 용도: "천창·수평커텐", 전원: "AC", 형식: "양축형", 계열모델: "COAM 81042DA · 81044DA · 81048DA · 81062DA" },
  },
  {
    slug: "coam-85052",
    name: "스크린 커텐 개폐장치 COAM 85052",
    category: "opener",
    summary: "수평 스크린 커텐을 당기는 AC 예인장치 (드럼 사용형)",
    description:
      "연동하우스 수평 스크린 커텐을 와이어로 당겨 여닫는 예인장치입니다. 천창 1m용, 드럼 사용형, 드럼 미사용형으로 나뉩니다. 수평커텐 컨트롤판넬과 연결합니다.",
    price: 320000,
    stock: 8,
    sort: 7,
    specs: {
      용도: "수평 스크린 커텐",
      전원: "AC 220V / 380V",
      계열모델: "COAM 85051(천창1m용) · 85052(드럼) · 85056(드럼 미사용) · 87051 · 87052 · 87056 · CODM 87071 · COAM 87072 · 87076",
    },
  },
  // 제어판넬·컨트롤러
  {
    slug: "dc-panel-manual-a",
    name: "DC 자동제어판넬 수동 A타입 (개별형)",
    category: "controller",
    summary: "개폐기를 1대씩 열고 닫는 개별 스위치형 제어판넬",
    description: "개폐기마다 열림·정지·닫힘 스위치가 있어 1대씩 조작합니다. 반자동형인 수동 B타입도 있습니다.",
    price: 380000,
    stock: 10,
    sort: 11,
    specs: { 입력전압: "DC 24V ±10%", 사용기종: "CODM 81024, 81034, 81044, 81054, 81064", 운전방식: "열림 · 정지 · 닫힘", 특징: "개별로 1대씩 열고 닫는 방식" },
  },
  {
    slug: "dc-panel-auto-a",
    name: "DC 자동제어판넬 자동 A타입",
    category: "controller",
    summary: "목표온도에 맞춰 개폐기를 단계별로 자동 운전",
    description: "설정한 목표온도에 따라 개폐기를 단계(스텝)로 열고 닫습니다. 옵션으로 우적 시 닫힘, 이상고온 시 열림 경보를 붙입니다. 1·2·3중 라인을 디지털 시간제어하는 자동 B타입도 있습니다.",
    price: 650000,
    stock: 6,
    badge: "인기",
    sort: 12,
    specs: {
      입력전압: "AC 220V",
      출력전압: "DC 24V ±10%",
      사용기종: "CODM 81024, 81034, 81044, 81054, 81064",
      운전방식: "자동운전 또는 수동운전",
      제어방식: "목표온도에 대한 스텝제어",
      경보옵션: "우적 시 닫힘, 이상고온 시 열림",
      특징: "외부 과전압 보호장치, 회로별 개별 퓨즈",
    },
  },
  {
    slug: "curtain-panel",
    name: "수평커텐 컨트롤판넬",
    category: "controller",
    summary: "AC 커텐모터용 열림·정지·닫힘 제어판넬",
    description: "수평커텐 예인장치를 스위치로 운전합니다. 자체 리미트로 거리를 제어하고, 모터 과부하 시 전자트립회로(EOCR)가 차단합니다. 24시간 타이머가 들어간 시간자동형, 푸시버튼형도 있습니다.",
    price: 520000,
    stock: 5,
    sort: 13,
    specs: { 입력전압: "AC 220V / 380V, 50·60Hz", 출력: "AC 220V / 380V (2마력 이하 커텐모터)", 사용기종: "COAM 8505, 8705, 8707", 보호: "EOCR 전자트립회로" },
  },
  {
    slug: "fan-panel",
    name: "휀 컨트롤판넬",
    category: "controller",
    summary: "온도에 따라 환기휀을 자동 정지·운전",
    description: "AC 모터 환기휀을 스위치로 운전하거나 온도에 따라 자동으로 켜고 끕니다.",
    price: 360000,
    stock: 5,
    sort: 14,
    specs: { 사용기종: "AC 220V / 380V 모터 기동용", 운전방식: "스위치 정지·운전", 특징: "온도에 의한 휀 모터 자동 정지·운전" },
  },
  {
    slug: "cocb-02",
    name: "하우스 컨트롤러 COCB-02 (온도)",
    category: "controller",
    summary: "단동 비닐하우스용 개폐기 2대 온도 제어기",
    description: "현재온도, 설정온도, 닫힘온도, 동작시간을 표시등으로 보여줘 누구나 하우스 상태를 쉽게 봅니다. 개폐기 4대용 리모컨 모델 COCB-04도 있습니다.",
    price: 290000,
    stock: 12,
    sort: 15,
    specs: { 제어대수: "개폐기 2대", 표시: "온도 1채널, FND", 기능: "인공지능 제어, 비상고온·강우 우선 제어, 수동·자동 운전", 적합: "단동 비닐하우스" },
  },
  {
    slug: "cocb-04",
    name: "하우스 컨트롤러 COCB-04 (온도+리모컨)",
    category: "controller",
    summary: "개폐기 4대를 리모컨으로도 조작하는 온도 제어기",
    description: "개폐기 4대를 개별로 수동·자동 전환합니다. 리모컨으로 원격 조작할 수 있습니다.",
    price: 380000,
    stock: 10,
    sort: 16,
    specs: { 제어대수: "개폐기 4대", 표시: "온도 1채널, FND", 기능: "인공지능 제어, 비상고온·강우 우선 제어, 개폐기별 수동·자동 전환", 구성: "본체 + 리모컨" },
  },
  {
    slug: "fhc-2009",
    name: "복합환경 제어기기 FHC-2009 (온도+시간)",
    category: "controller",
    summary: "연동하우스용 온도 1채널·시간 2채널 제어기",
    description: "2중·3중 시간제어로 새벽 온도 변화를 감지해 냉해와 병충해로 인한 작물 스트레스를 줄입니다.",
    price: 590000,
    stock: 6,
    sort: 17,
    specs: { 표시: "온도 1채널, 시간 2채널, FND", 기능: "다단 개폐(동시+개별), 비상고온·강우 우선, 72시간 데이터 저장", 옵션: "환기 온도제어 복합제어", 적합: "연동 비닐하우스" },
  },
  {
    slug: "fhc-2011-c2",
    name: "복합환경 제어기기 FHC-2011-C2 (온도 2채널)",
    category: "controller",
    summary: "온도 독립 2채널 단동하우스용 제어기",
    description: "비상고온을 2단으로 온도 채널별 설정하고, 강우 우선 기능과 복합 제어를 지원합니다.",
    price: 540000,
    stock: 6,
    sort: 18,
    specs: { 표시: "온도 독립 2채널, FND", 기능: "인공지능 제어, 2단 비상고온, 강우 우선, 72시간 데이터 저장", 적합: "단동 비닐하우스" },
  },
  {
    slug: "fhc-4step",
    name: "4단 변온기기 (온도 4채널)",
    category: "controller",
    summary: "시간대별로 4단계 설정온도를 바꾸는 변온 조절기",
    description: "시간대마다 다른 설정온도로 관리해 급격한 온도 변화로 인한 작물 스트레스를 줄입니다.",
    price: 620000,
    stock: 4,
    sort: 19,
    specs: { 표시: "4채널 (시간주기별 온도선택), FND", 기능: "시간대별 설정온도 관리, 인공지능 제어, 72시간 데이터 저장" },
  },
  {
    slug: "fhc-2012",
    name: "그린하우스캅 FHC-2012 (온도2+시간2)",
    category: "controller",
    summary: "FULL LCD 화면의 온도 2채널·시간 2채널 제어기",
    description: "독립 2채널 온도 설정과 365일 현재시간 저장, 외부온도 표시를 지원합니다.",
    price: 780000,
    stock: 4,
    badge: "신형",
    sort: 20,
    specs: { 표시: "온도 독립 2채널, 시간 독립 2채널, FULL LCD", 기능: "인공지능 제어, 365일 시간 저장, 외부온도 표시" },
  },
  // 센서·타이머
  {
    slug: "temp-sensor",
    name: "온도센서",
    category: "sensor",
    summary: "하우스 내부 온도 측정용 차폐형 센서",
    description: "컨트롤러와 복합환경 제어기기에 연결하는 온도센서입니다.",
    price: 45000,
    stock: 50,
    sort: 31,
    specs: { 측정: "온도", 연결: "청오 컨트롤러·제어기기" },
  },
  {
    slug: "humidity-sensor",
    name: "습도센서",
    category: "sensor",
    summary: "하우스 내부 습도 측정 센서",
    description: "복합환경 제어 시스템의 습도 제어에 사용합니다.",
    price: 68000,
    stock: 30,
    sort: 32,
    specs: { 측정: "습도", 연결: "복합환경 제어기기·시스템" },
  },
  {
    slug: "rain-sensor",
    name: "우적센서",
    category: "sensor",
    summary: "비를 감지해 천창·측창을 닫게 하는 센서",
    description: "빗방울을 감지하면 제어판넬에 신호를 보내 개폐기를 닫습니다.",
    price: 58000,
    stock: 30,
    sort: 33,
    specs: { 감지: "강우", 연결: "자동제어판넬 경보 옵션, 컨트롤러" },
  },
  {
    slug: "high-temp-sensor",
    name: "고온센서",
    category: "sensor",
    summary: "이상고온 시 개폐기를 여는 다이얼식 센서",
    description: "설정 온도를 넘으면 신호를 보내 작물 보호를 위해 개폐기를 엽니다.",
    price: 39000,
    stock: 40,
    sort: 34,
    specs: { 감지: "이상고온", 설정: "다이얼식" },
  },
  {
    slug: "solar-sensor",
    name: "일사센서",
    category: "sensor",
    summary: "햇빛 세기를 측정하는 일사량 센서",
    description: "복합환경 제어 시스템에서 일사량 기반 제어에 사용합니다.",
    price: 98000,
    stock: 15,
    sort: 35,
    specs: { 측정: "일사량", 연결: "복합환경 제어 시스템" },
  },
  {
    slug: "wind-direction-sensor",
    name: "풍향센서",
    category: "sensor",
    summary: "바람 방향에 따라 바람 반대쪽 창만 열도록 돕는 센서",
    description: "복합환경 제어 시스템의 풍향 제어에 사용합니다.",
    price: 125000,
    stock: 10,
    sort: 36,
    specs: { 측정: "풍향", 연결: "복합환경 제어 시스템" },
  },
  {
    slug: "wind-speed-sensor",
    name: "풍속센서",
    category: "sensor",
    summary: "강풍 시 창을 닫게 하는 풍속 센서",
    description: "복합환경 제어 시스템의 풍속 제어에 사용합니다.",
    price: 125000,
    stock: 10,
    sort: 37,
    specs: { 측정: "풍속", 연결: "복합환경 제어 시스템" },
  },
  {
    slug: "timer-24h",
    name: "24시간 타이머",
    category: "sensor",
    summary: "시간대별 자동 열림·닫힘용 다이얼 타이머",
    description: "수평커텐 시간자동 컨트롤판넬 등에서 시간에 따라 열고 닫을 때 사용합니다.",
    price: 28000,
    stock: 60,
    sort: 38,
    specs: { 방식: "24시간 다이얼", 용도: "시간 자동 운전" },
  },
  // 부품·부자재
  {
    slug: "coupling",
    name: "개폐기 커플링",
    category: "parts",
    summary: "개폐기와 권취축을 잇는 커플링",
    description: "개폐기 구동축과 하우스 권취 파이프를 연결합니다. 규격은 주문 전 전화로 확인해 주세요.",
    price: 15000,
    stock: 200,
    sort: 41,
    specs: { 호환: "CODM·COAM 개폐장치", 확인: "권취 파이프 규격 상담 필요" },
  },
  // 시스템 (견적)
  {
    slug: "climate-controller",
    name: "복합환경 제어 시스템",
    category: "system",
    summary: "온도·시간·습도·풍향·풍속을 PC 화면에서 통합 제어",
    description:
      "온실 내부·외부 기상을 감시하고 천창, 측창, 수평커텐, 보온커텐, 유동휀, 순환펌프, 관수를 한 화면에서 제어합니다. 웹 모니터링 시스템으로 원격에서 상태를 확인합니다. 온실 규모와 설비 구성에 따라 견적을 드립니다.",
    price: 0,
    saleType: "quote",
    stock: 0,
    badge: "견적",
    sort: 51,
    specs: { 제어: "온도 · 시간 · 습도 · 풍향 · 풍속", 감시: "온실 내부 온습도, 외부 온도·습도·일사·풍향·풍속·강우", 원격: "웹 모니터링 시스템", 지원사업: "ICT 융복합 스마트팜 (확인 필요)" },
  },
  {
    slug: "nutrient-system",
    name: "양액 공급시스템",
    category: "system",
    summary: "비닐하우스 양액 공급시스템 제작·시공",
    description: "청오는 2002년 비닐하우스 내부 시설공사와 양액 공급시스템 제작·시공으로 출발했습니다. 재배 작물과 구역 수에 맞춰 견적을 드립니다.",
    price: 0,
    saleType: "quote",
    stock: 0,
    badge: "견적",
    sort: 52,
    specs: { 범위: "설계 · 제작 · 시공" },
  },
  {
    slug: "greenhouse-build",
    name: "온실 자동화 시공",
    category: "system",
    summary: "비닐하우스 내부 시설공사와 자동화 설비 일괄 시공",
    description: "개폐장치, 제어판넬, 센서 설치와 배선까지 한 번에 진행합니다. 2007년 고양 화훼단지 50,000평에 자동개폐기와 자동제어기를 납품했습니다.",
    price: 0,
    saleType: "quote",
    stock: 0,
    badge: "견적",
    sort: 53,
    specs: { 범위: "내부 시설공사 · 자동화 설비 · A/S", 실적: "고양 화훼단지 50,000평 (2007)" },
  },
];

const cases: (typeof schema.cases.$inferInsert)[] = [
  { title: "고양 화훼단지 자동개폐 시스템 납품", region: "경기", crop: "화훼", areaM2: 165289, year: 2007, scope: ["자동개폐기", "자동제어기"], summary: "고양 화훼단지 50,000평에 자동개폐기와 자동제어기 납품.", result: "청오 회사연혁 기재 실적" },
  { title: "논산 딸기 연동온실 자동화", region: "충남", crop: "딸기", areaM2: 6600, year: 2025, scope: ["자동개폐기", "복합환경제어"], summary: "연동 8동 측창·천창 자동화와 복합환경제어 도입.", result: "환기 작업 시간 하루 2시간 → 0 (예시)" },
  { title: "김제 토마토 양액재배 시설", region: "전북", crop: "토마토", areaM2: 9900, year: 2024, scope: ["양액제어", "EC·pH 센서"], summary: "16구역 양액제어 시스템 구축.", result: "양액 사용량 18% 절감 (예시)" },
  { title: "청주 엽채류 스마트팜", region: "충북", crop: "상추", areaM2: 3300, year: 2025, scope: ["복합환경제어", "CO₂ 센서"], summary: "원격 모니터링과 CO₂ 시비 제어.", result: "출하 주기 단축 (예시)" },
  { title: "고흥 유자 육묘 온실", region: "전남", crop: "유자 묘목", areaM2: 1650, year: 2023, scope: ["자동개폐기", "관수 타이머"], summary: "단동 6동 개폐 자동화와 점적 관수.", result: "여름철 고온 피해 감소 (예시)" },
  { title: "우즈베키스탄 오이 온실 수출", region: "해외", crop: "오이", areaM2: 20000, year: 2024, scope: ["자동개폐기", "컨트롤 박스"], summary: "현지 시공사에 개폐기·제어반 공급.", result: "수출 프로젝트 (예시)" },
  { title: "대전 도시농업 교육 온실", region: "대전", crop: "허브·화훼", areaM2: 660, year: 2025, scope: ["복합환경제어"], summary: "지자체 교육용 온실에 소형 제어 시스템 설치.", result: "교육 프로그램 연 40회 운영 (예시)" },
];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@chungoh.local";
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) throw new Error("SEED_ADMIN_PASSWORD is required");

  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.quotes);
  await db.delete(schema.adminLogs);
  await db.delete(schema.asRequests);
  await db.delete(schema.products);
  await db.delete(schema.cases);
  await db.delete(schema.users);

  await db.insert(schema.users).values({
    email,
    passwordHash: await bcrypt.hash(password, 10),
    name: "청오 관리자",
    role: "admin",
  });
  await db.insert(schema.products).values(products);
  await db.insert(schema.cases).values(cases);
  console.log(`seeded: admin ${email}, ${products.length} products, ${cases.length} cases`);
  await sql.end();
}

main().catch(async (e) => {
  console.error(e);
  await sql.end();
  process.exit(1);
});
