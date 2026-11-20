export const categories = [
  { key: "opener", label: "자동개폐기", desc: "측창·천창 개폐 모터" },
  { key: "controller", label: "컨트롤러", desc: "개폐기 컨트롤 박스·타이머" },
  { key: "nutrient", label: "양액·관수", desc: "양액기·점적 관수 부품" },
  { key: "sensor", label: "센서", desc: "온습도·CO₂·일사 센서" },
  { key: "parts", label: "부품·소모품", desc: "리밋 스위치·감속기·케이블" },
  { key: "system", label: "시스템 (견적)", desc: "복합환경제어·온실 시공" },
] as const;

export type CategoryKey = (typeof categories)[number]["key"];

export function categoryLabel(key: string): string {
  return categories.find((c) => c.key === key)?.label ?? key;
}

export const orderStatusLabel: Record<string, string> = {
  pending: "결제대기",
  paid: "결제완료",
  preparing: "배송준비",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

export const quoteStatusLabel: Record<string, string> = {
  new: "신규",
  contacted: "상담중",
  quoted: "견적발송",
  won: "계약",
  lost: "보류",
};

export const company = {
  name: "(주)청오엔지니어링",
  nameEn: "CHUNG-OH ENGINEERING Co., Ltd.",
  ceo: "권오숙",
  address: "대전광역시 대덕구 대화로32번길 60-9",
  // 아래 항목은 청오 확인 후 실제 값으로 교체
  bizNo: "000-00-00000",
  mailOrderNo: "제0000-대전대덕-0000호",
  tel: "042-000-0000",
  email: "help@chung-oh.co.kr",
  founded: 2002,
};
