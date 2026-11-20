import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema";

// 시드 데이터: 공개 기업정보의 제품군(자동개폐기, 컨트롤 박스, 양액제어, 복합환경제어)을 바탕으로 만든 예시.
// 가격·재고·사양은 임시값이며 관리자 화면에서 실제 값으로 교체한다.

const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(sql, { schema });

const products: (typeof schema.products.$inferInsert)[] = [
  {
    slug: "codm-8102",
    name: "자동개폐기 CODM 8102",
    category: "opener",
    summary: "비닐하우스 측창·천창용 DC 자동개폐 모터",
    description:
      "측창과 천창 권취축을 구동하는 감속 모터입니다. 리밋 스위치로 상·하한 위치를 기억하고, 컨트롤 박스와 연결해 온도에 따라 자동으로 열고 닫습니다.",
    price: 168000,
    stock: 40,
    badge: "대표상품",
    sort: 1,
    specs: { 전원: "DC 24V", 출력토크: "80 N·m (예시)", 회전속도: "4 rpm (예시)", 권취축: "Φ25~32mm", 보증: "1년" },
  },
  {
    slug: "codm-8102-ac",
    name: "자동개폐기 CODM 8102 AC형",
    category: "opener",
    summary: "AC 220V 전원 직결형 측창 개폐 모터",
    description: "별도 정류기 없이 AC 220V에 연결하는 모델입니다. 대형 측창 구동에 맞춘 고토크 감속기를 사용합니다.",
    price: 189000,
    stock: 25,
    sort: 2,
    specs: { 전원: "AC 220V", 출력토크: "100 N·m (예시)", 권취축: "Φ25~32mm", 보증: "1년" },
  },
  {
    slug: "control-box-4ch",
    name: "개폐기 컨트롤 박스 4CH",
    category: "controller",
    summary: "개폐기 4대를 온도 기준으로 자동 제어",
    description:
      "개폐기 4대를 독립 채널로 제어합니다. 설정 온도에 따라 단계별로 열고, 강우 센서 신호가 들어오면 즉시 닫습니다. 수동·자동 전환 스위치를 포함합니다.",
    price: 420000,
    stock: 15,
    badge: "인기",
    sort: 3,
    specs: { 채널: "4CH", 입력: "온도센서 1, 강우센서 1", 전원: "AC 220V", 함체: "IP54 (예시)" },
  },
  {
    slug: "control-box-8ch",
    name: "개폐기 컨트롤 박스 8CH",
    category: "controller",
    summary: "연동 온실용 8채널 개폐 제어반",
    description: "연동형 온실의 측창·천창 8대를 제어합니다. 풍향·풍속 센서 연동 단자를 제공합니다.",
    price: 690000,
    stock: 8,
    sort: 4,
    specs: { 채널: "8CH", 입력: "온도·강우·풍속", 전원: "AC 220V" },
  },
  {
    slug: "timer-controller",
    name: "관수 타이머 컨트롤러",
    category: "nutrient",
    summary: "4구역 점적 관수 스케줄 제어",
    description: "솔레노이드 밸브 4구역을 시간표대로 엽니다. 하루 최대 12회 관수를 설정합니다.",
    price: 98000,
    stock: 30,
    sort: 5,
    specs: { 구역: "4", 출력: "AC 24V 솔레노이드", 프로그램: "1일 12회" },
  },
  {
    slug: "ec-ph-sensor",
    name: "EC·pH 센서 세트",
    category: "sensor",
    summary: "양액 농도와 산도를 실시간 측정",
    description: "양액기 혼합 탱크에 설치해 EC와 pH를 측정합니다. 4~20mA 출력으로 양액제어기에 연결합니다.",
    price: 245000,
    stock: 12,
    sort: 6,
    specs: { 측정: "EC 0~10 dS/m, pH 0~14", 출력: "4~20mA", 교정: "2점 교정" },
  },
  {
    slug: "th-sensor",
    name: "온습도 센서 (복사차폐형)",
    category: "sensor",
    summary: "햇빛 영향을 줄인 온실 내부 온습도 센서",
    description: "복사차폐 하우징으로 직사광의 영향을 줄입니다. 컨트롤 박스와 복합환경제어기에 연결합니다.",
    price: 76000,
    stock: 50,
    sort: 7,
    specs: { 측정: "-20~60℃, 0~100%RH", 출력: "RS-485 Modbus", 하우징: "복사차폐 7단" },
  },
  {
    slug: "co2-sensor",
    name: "CO₂ 센서",
    category: "sensor",
    summary: "NDIR 방식 온실 탄산가스 농도 센서",
    description: "탄산가스 시비 제어를 위한 NDIR 센서입니다.",
    price: 132000,
    stock: 18,
    sort: 8,
    specs: { 측정: "0~5,000 ppm", 방식: "NDIR", 출력: "RS-485" },
  },
  {
    slug: "limit-switch",
    name: "개폐기 리밋 스위치 교체 세트",
    category: "parts",
    summary: "CODM 시리즈 호환 상·하한 리밋 스위치",
    description: "개폐 위치가 어긋날 때 교체하는 소모 부품입니다. 설치 설명서를 동봉합니다.",
    price: 18000,
    stock: 200,
    sort: 9,
    specs: { 호환: "CODM 8102 시리즈", 구성: "스위치 2, 캠 2" },
  },
  {
    slug: "motor-cable-10m",
    name: "개폐기 연장 케이블 10m",
    category: "parts",
    summary: "방수 커넥터 일체형 모터 케이블",
    description: "컨트롤 박스와 개폐기 사이 연장용 케이블입니다.",
    price: 22000,
    stock: 150,
    sort: 10,
    specs: { 길이: "10m", 규격: "4C × 1.5sq", 커넥터: "방수형" },
  },
  {
    slug: "climate-controller",
    name: "복합환경제어 시스템",
    category: "system",
    summary: "온도·습도·CO₂·일사·양액을 한 화면에서 자동 제어",
    description:
      "센서 데이터를 모아 개폐기, 커튼, 유동팬, 난방기, 양액기를 통합 제어합니다. 스마트폰 원격 모니터링을 지원합니다. 온실 규모와 설비 구성에 따라 견적을 드립니다.",
    price: 0,
    saleType: "quote",
    stock: 0,
    badge: "견적",
    sort: 11,
    specs: { 제어대상: "개폐기·커튼·팬·난방·양액", 원격: "스마트폰 앱", 지원사업: "스마트팜 ICT 보급사업 대상 (확인 필요)" },
  },
  {
    slug: "nutrient-system",
    name: "양액제어 시스템",
    category: "system",
    summary: "EC·pH 기반 자동 양액 조제·공급",
    description: "원액 탱크 A·B와 산 탱크를 자동 혼합해 설정 EC·pH로 공급합니다. 구역 수와 공급량에 따라 견적을 드립니다.",
    price: 0,
    saleType: "quote",
    stock: 0,
    badge: "견적",
    sort: 12,
    specs: { 원액: "A·B·산", 구역: "최대 16구역 (예시)", 센서: "EC·pH·유량" },
  },
  {
    slug: "greenhouse-build",
    name: "온실 설계·시공",
    category: "system",
    summary: "단동·연동 비닐온실, 유리온실 설계부터 자동화까지",
    description: "부지 측량, 구조 설계, 시공, 자동화 설비 설치까지 한 번에 진행합니다.",
    price: 0,
    saleType: "quote",
    stock: 0,
    badge: "견적",
    sort: 13,
    specs: { 형태: "단동·연동·유리", 범위: "설계·시공·자동화·A/S" },
  },
];

const cases: (typeof schema.cases.$inferInsert)[] = [
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
