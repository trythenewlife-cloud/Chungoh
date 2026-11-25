# 상시 PC 배포 가이드 (Windows)

켜 둔 Windows PC 한 대에서 사이트, DB, 외부 접속 터널을 모두 돌리는 방법입니다. 명령은 모두 **관리자 권한 PowerShell** 에서 실행합니다.

## 1. 필요한 프로그램 설치

```powershell
winget install -e --id OpenJS.NodeJS.LTS
winget install -e --id Git.Git
winget install -e --id PostgreSQL.PostgreSQL.16
winget install -e --id Cloudflare.cloudflared
```

설치 후 PowerShell 창을 새로 엽니다. PostgreSQL 설치 중 정한 `postgres` 계정 비밀번호는 따로 적어 둡니다.

PC 절전 끄기: 설정 → 시스템 → 전원 → 화면 및 절전 → 절전 모드 "안 함". Windows 업데이트 후 자동 재부팅돼도 서버는 4단계 작업 스케줄러로 다시 켜집니다.

## 2. 코드 받기와 DB 만들기

```powershell
git clone https://github.com/trythenewlife-cloud/Chungoh.git C:\chungoh
cd C:\chungoh
git checkout claude/elegant-pascal-82v27y
npm.cmd ci
```

DB 계정과 DB 만들기. `새DB비밀번호` 는 직접 정한 영문·숫자 비밀번호로 바꿉니다 (한글·특수문자는 3단계 DATABASE_URL 에서 오류가 납니다). "postgres 사용자의 암호" 를 물으면 PostgreSQL 설치 때 정한 비밀번호를 입력합니다:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE USER chungoh WITH PASSWORD '새DB비밀번호';" -c "CREATE DATABASE chungoh OWNER chungoh;"
```

## 3. 환경변수 (.env.local)

`.env.example` 을 `.env.local` 로 복사하고 값을 채웁니다.

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

| 항목 | 값 |
|---|---|
| `DATABASE_URL` | `postgres://chungoh:새DB비밀번호@localhost:5432/chungoh` |
| `SESSION_SECRET`, `ENCRYPTION_KEY` | 아래 명령 결과를 각각 넣기 (두 번 실행해 서로 다른 값) |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | 관리자 이메일과 처음 비밀번호 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY` | 지금은 토스 테스트 키, 가맹 후 라이브 키 |

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

`ENCRYPTION_KEY` 를 잃어버리면 저장된 휴대폰·주소를 다시 읽을 수 없습니다. 값을 안전한 곳에 따로 보관합니다.

## 4. DB 테이블, 빌드, 자동 실행

```powershell
npm.cmd run db:push
npm.cmd run db:seed
npm.cmd run admin:password
npm.cmd run build
powershell -ExecutionPolicy Bypass -File scripts\windows\install-autostart.ps1
```

- `db:seed` 는 기존 데이터를 지우고 예시 상품·사례를 넣습니다. 처음 한 번만 실행합니다.
- `admin:password` 는 관리자 비밀번호를 터미널에서 직접 입력해 바꿉니다 (12자 이상).
- `install-autostart.ps1` 은 작업 스케줄러에 "Chungoh Server", "Chungoh Tunnel" 두 작업을 등록합니다. 부팅할 때 시작하고, 꺼지면 1분 뒤 다시 켭니다.

접속 주소 확인 (임시 터널):

```powershell
Select-String -Path logs\tunnel.log -Pattern 'https://.*trycloudflare.com' | Select-Object -Last 1
```

로그: `logs\server.log`, `logs\tunnel.log`

## 5. 고정 주소 (선택, 권장)

임시 터널 주소는 PC나 터널이 다시 켜질 때마다 바뀝니다. 기존 도메인 `chung-oh.co.kr` 을 이 사이트로 바꿉니다.

현재 상태 (2026-11-25 조회): 등록대행자 후이즈, 만료 2027-10-23, 네임서버·홈페이지·메일은 카페24.

| 레코드 | 값 | 용도 |
|---|---|---|
| A `chung-oh.co.kr` | `211.41.79.43` | 카페24 기존 홈페이지 |
| CNAME `www` | `chung-oh.co.kr` | 기존 홈페이지 |
| MX | `mail.chung-oh.co.kr` (우선순위 10) | 회사 메일 |
| TXT | `v=spf1 ip4:218.236.90.202 ...` | 메일 발송 인증 |

4번부터 몇 시간 안에 기존 홈페이지가 새 사이트로 바뀝니다. 회사 소개와 상품을 먼저 다 넣어 둡니다.

1. **도메인 연장**: 후이즈(whois.co.kr)에 도메인 소유자(청오) 계정으로 로그인해 기간 연장에서 10년을 결제합니다. `.kr` 은 남은 기간 포함 10년이 상한일 수 있으니 결제 화면에서 최종 만료일을 확인합니다.
2. **Cloudflare 에 도메인 추가**: Cloudflare 무료 계정을 만들고 `chung-oh.co.kr` 을 Free 플랜으로 추가합니다. 불러온 레코드에 위 표의 MX, TXT(spf1), `mail` A 레코드가 있는지 확인합니다. 없으면 카페24 DNS 관리 화면의 값을 그대로 추가합니다. `mail` 레코드는 회색 구름(DNS only)으로 둡니다.
3. **터널 만들기**: Zero Trust → Networks → Tunnels → Create a tunnel → Cloudflared. 설치 명령의 `--token` 뒤 문자열만 복사합니다 (그 설치 명령은 실행하지 않습니다. 실행하면 터널이 2개 돕니다). DNS 에서 루트 A 레코드(`211.41.79.43`)와 `www` CNAME 을 지우고, Public Hostname 에 `chung-oh.co.kr` 과 `www.chung-oh.co.kr` → `http://localhost:3000` 을 추가합니다.
4. **네임서버 변경**: 후이즈 → 네임서버 변경에서 카페24 네임서버 4개를 Cloudflare 가 안내한 2개로 바꿉니다. Cloudflare 에서 도메인이 "Active" 가 될 때까지 기다립니다 (몇 분 ~ 24시간).
5. **PC 에 토큰 저장** (관리자 PowerShell). 재부팅하면 "Chungoh Tunnel" 작업이 고정 터널로 연결합니다.

```powershell
[Environment]::SetEnvironmentVariable("CLOUDFLARE_TUNNEL_TOKEN", "복사한토큰", "Machine")
Restart-Computer
```

6. **확인 후 정리**: Tunnels 화면에서 상태가 HEALTHY 인지, `https://www.chung-oh.co.kr` 이 열리는지, 회사 메일 송수신이 되는지 확인합니다. 그다음 카페24 웹호스팅을 해지합니다. 메일을 계속 쓰면 메일 호스팅은 유지합니다.
7. **주소 등록**: NCP 콘솔 지도 앱의 Web 서비스 URL 에 `https://chung-oh.co.kr`, `https://www.chung-oh.co.kr` 을 추가합니다. 토스 라이브 키 신청 때 이 주소를 사이트 주소로 씁니다.

## 6. 새 코드 반영

```powershell
cd C:\chungoh
powershell -ExecutionPolicy Bypass -File scripts\windows\update.ps1
```

받아오기, 설치, DB 구조 반영, 빌드, 서버 재시작을 차례로 합니다. 빌드가 실패하면 서버를 멈추지 않습니다.

## 7. 백업

매일 DB 를 파일로 남기는 작업 예시 (새벽 3시, `C:\chungoh-backup`):

```powershell
New-Item -ItemType Directory -Force C:\chungoh-backup
$a = New-ScheduledTaskAction -Execute "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -Argument "-Fc -f C:\chungoh-backup\chungoh.dump postgres://chungoh:새DB비밀번호@localhost:5432/chungoh"
Register-ScheduledTask -TaskName "Chungoh Backup" -Action $a -Trigger (New-ScheduledTaskTrigger -Daily -At 3am) -User SYSTEM -RunLevel Highest
```

백업 파일은 다른 PC나 클라우드 드라이브에도 복사해 둡니다.

## 지금 PC 데이터를 옮길 때

개발 PC 의 주문·A/S 데이터를 그대로 옮기려면 시드 대신 덤프를 복원하고, `.env.local` 의 `ENCRYPTION_KEY` 와 `SESSION_SECRET` 을 개발 PC 와 같은 값으로 씁니다.

```powershell
# 개발 PC
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -Fc -f chungoh.dump postgres://chungoh:chungoh@localhost:5432/chungoh
# 상시 PC (2단계 DB 생성 후, db:seed 대신)
& "C:\Program Files\PostgreSQL\16\bin\pg_restore.exe" --no-owner -d postgres://chungoh:새DB비밀번호@localhost:5432/chungoh chungoh.dump
```

## 오픈 전 확인

- 관리자 비밀번호를 바꿨는지 (`npm.cmd run admin:password`)
- 토스 키가 테스트 키인지 라이브 키인지
- 네이버 지도를 쓸 경우 NCP 앱의 Web 서비스 URL 에 터널 주소나 도메인을 추가 (관리자 → 설정)
