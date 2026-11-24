export const categories = [
  { key: "opener", label: "자동개폐기", desc: "비닐·부직포·보온덮개·커텐 개폐장치" },
  { key: "controller", label: "제어판넬·컨트롤러", desc: "자동제어판넬, 하우스 컨트롤러, 복합환경 제어기기" },
  { key: "sensor", label: "센서·타이머", desc: "온도·습도·일사·우적·풍향·풍속 센서" },
  { key: "parts", label: "부품·부자재", desc: "커플링·부자재" },
  { key: "system", label: "시스템 (견적)", desc: "복합환경 제어 시스템·양액 공급·온실 시공" },
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

export const asStatusLabel: Record<string, string> = {
  received: "접수",
  checking: "점검중",
  repairing: "수리중",
  done: "완료",
};

// 기존 사이트 첫 화면의 유튜브 영상 6개 (제목은 유튜브 영상 제목), 2026-11-24 확인
export const videos = [
  { id: "HIDQItS475E", title: "비닐용 개폐기" },
  { id: "4XXb98Qfo1M", title: "부직포용 개폐기" },
  { id: "Kx2L0PrStdw", title: "양축용 개폐기" },
  { id: "i4EhQabIWkM", title: "커텐용 개폐기" },
  { id: "oKN2mnjY7qo", title: "양액공급시스템" },
  { id: "vNP-LuN2hjs", title: "ICT 복합환경제어시스템" },
] as const;

// 기존 사이트 A/S 게시판 글 39건의 유형을 묶은 것
export const asIssueTypes = ["작동 안 됨·이상", "소음·진동", "부품 교체·구매", "설치·배선 문의", "기타"] as const;

export const company = {
  name: "(주)청오엔지니어링",
  nameEn: "CHUNG-OH ENGINEERING Co., Ltd.",
  ceo: "권오숙",
  address: "대전광역시 대덕구 대화로32번길 60-9",
  addressJibun: "대전광역시 대덕구 대화동 1-44",
  bizNo: "126-81-64659",
  tel: "042-621-3800",
  fax: "042-621-3858",
  email: "chungoh-eng@hanmail.net",
  founded: 2002,
  // 기존 사이트(chung-oh.co.kr)에 없는 항목. 청오 확인 후 실제 값으로 교체
  mailOrderNo: "제0000-대전대덕-0000호",
};
