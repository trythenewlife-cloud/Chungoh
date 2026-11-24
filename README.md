# 청오엔지니어링 홈페이지 + 자사몰 (MVP)

(주)청오엔지니어링 리뉴얼 제안용 웹사이트입니다. 회사 소개, 시공사례, 견적 요청, 부품 쇼핑몰(토스페이먼츠 결제), 관리자 기능을 한 앱에 담았습니다.

기획서: [docs/PLAN.md](docs/PLAN.md) · 화면 캡처: [docs/screenshots](docs/screenshots)

## 기능

| 영역 | 화면 | 내용 |
|---|---|---|
| 소개 | `/`, `/about`, `/solutions`, `/cases` | 히어로, 실시간 환경제어 데모 위젯, 벤토 그리드, 제품 동영상 6개, 시공사례 지역 필터 |
| 구매 | `/products`, `/products/[slug]`, `/cart`, `/checkout` | 카테고리·검색, 장바구니, 토스 결제위젯, 비회원 주문 |
| 견적 | `/quote` | 3단계 견적 마법사 (작물·면적 → 설비 → 연락처) |
| A/S | `/as` | A/S 신청 (모델명·증상 유형·설명), 관리자 상태 관리, 마이페이지 진행 상태 |
| 회원 | `/signup`, `/login`, `/mypage`, `/orders/lookup` | 일반·사업자 회원, 주문·견적 내역, 주문 취소(환불), 비회원 조회 |
| 관리자 | `/admin` | 매출 대시보드, 상품 등록·수정·노출, 주문 상태·송장·환불, 견적 상담·A/S 관리, 회원 목록 |

## 기술 스택

- Next.js 16.4 (App Router, Cache Components) + React 19 + TypeScript
- Tailwind CSS 4, Pretendard 폰트, lucide 아이콘
- PostgreSQL + Drizzle ORM (운영: Supabase 권장)
- 토스페이먼츠 결제위젯 v2 + 결제 승인·취소 API
- 인증: 이메일·비밀번호 (bcrypt), JWT 쿠키 세션 (jose)

## 개인정보 보호

- 휴대폰·주소·사업자번호: AES-256-GCM 컬럼 암호화 (`src/lib/crypto.ts`)
- 비밀번호: bcrypt 해시
- 카드 정보: 저장하지 않음 (토스페이먼츠 처리)
- 결제 금액: 서버가 DB 가격으로 다시 계산하고, 승인 시 주문 금액과 대조
- 관리자 권한: 쿠키가 아니라 DB의 role로 매번 확인, 개인정보 열람·변경은 `admin_logs`에 기록
- 개인정보처리방침·이용약관 초안 포함 (오픈 전 법률 검토 필요)

## 로컬 실행

```bash
# 1) PostgreSQL 준비 (예: Docker)
docker run -d --name chungoh-db -e POSTGRES_USER=chungoh -e POSTGRES_PASSWORD=chungoh -e POSTGRES_DB=chungoh -p 5432:5432 postgres:16

# 2) 환경변수
cp .env.example .env.local
# SESSION_SECRET, ENCRYPTION_KEY 에 `openssl rand -base64 32` 결과를 각각 넣고, SEED_ADMIN_PASSWORD 지정

# 3) 설치·DB 생성·시드
npm install
npm run db:push
npm run db:seed

# 4) 실행
npm run dev        # http://localhost:3000
```

관리자: `/login` 에서 `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` 로 로그인하면 `/admin` 으로 이동합니다.

테스트: `npm test` (암호화·가격 계산 단위 테스트 10개)

## 배포 (상시 켜 둔 Windows PC)

[docs/DEPLOY-PC.md](docs/DEPLOY-PC.md): PostgreSQL, 운영 빌드, Cloudflare 터널, 부팅 시 자동 실행, 업데이트, 백업.

## 배포 (Vercel + Supabase)

1. **Supabase**: 새 프로젝트 생성 (리전 Seoul `ap-northeast-2`). Project Settings → Database → Connection string 에서 **Transaction pooler** 주소(포트 6543)를 복사합니다.
2. **DB 테이블 생성**: 로컬에서 `.env.local` 의 `DATABASE_URL` 을 Supabase 주소로 바꾸고 `npm run db:push` → `npm run db:seed` 실행.
3. **GitHub**: 이 저장소를 push 합니다.
4. **Vercel**: New Project → GitHub 저장소 Import → Environment Variables 에 `.env.example` 의 항목을 모두 입력합니다. `NEXT_PUBLIC_SITE_URL` 은 배포 주소로 지정합니다.
5. **Deploy**: `main` 브랜치에 push 할 때마다 자동 배포되고, PR마다 미리보기 URL이 생깁니다.
6. **도메인**: Vercel → Settings → Domains 에 `chung-oh.co.kr` 추가 → 도메인 업체(가비아 등) DNS에 Vercel이 안내하는 A/CNAME 레코드 입력. SSL은 자동 발급됩니다.
7. **결제 실서비스 전환**: 토스페이먼츠 가맹 신청(사업자등록증, 통신판매업 신고증 필요) → 심사 후 발급된 라이브 키로 `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY` 교체.
8. **검색 등록**: 네이버 서치어드바이저, 구글 서치콘솔에 사이트 등록.

## 오픈 전 채울 항목

- `src/lib/catalog.ts` 의 통신판매업 신고번호 (사업자번호·전화·팩스·이메일은 기존 사이트 값으로 채움)
- 제품 가격·재고·사진, 시공사례 (제품 모델명·사양과 연혁은 기존 사이트에서 옮김, 가격·재고와 사례 6건은 예시)
- 배송비 정책 (`src/lib/pricing.ts`, 현재 5만원 이상 무료 / 4,000원)
- 회사소개 지도 (선택): 관리자 → 설정 에 네이버 클라우드 플랫폼 Maps Client ID 를 저장하면 표시, 비우면 숨김. NCP 앱의 Web 서비스 URL 에 `http://localhost:3000` 과 배포 주소를 등록 (Dynamic Map·Geocoding 사용)
- 우편번호 검색, 카카오·네이버 로그인, 상품 이미지 업로드(Supabase Storage), 송장 엑셀 일괄 등록
- 개인정보처리방침의 위탁사·국외 이전 항목, 개인정보 보호책임자

## 데모 도구

- `npx tsx --env-file=.env.local scripts/demo-order.ts` : 결제완료 상태의 데모 주문 1건 생성 (토스 결제 없이 관리자 화면 시연용)
