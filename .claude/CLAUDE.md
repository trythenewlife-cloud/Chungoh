# Chungoh
What type of app are you building: Web app
Language and tech stack: TypeScript / JavaScript
Who are the target users: General consumers + business (admin/seller)
Client: 청오, eco-friendly greenhouse automation company (user-confirmed); site chung-oh.co.kr blocks bots (403)
Decided: direct sales only (no marketplace), Toss Payments, eco/trendy design
Plan: docs/PLAN.md. Stack: Next.js 15 + Tailwind + shadcn/ui, Supabase Postgres + Drizzle, Toss Payments, Vercel
Data storage: PostgreSQL
Any constraints: Privacy-sensitive

# AI strategy
Use Haiku for simple tasks; Sonnet for main dev; Opus for complex arch or if Sonnet fails 2x.
Keep context low: Grep before Read, targeted reads only.

# Rules
Concise responses. No overengineering. No unrequested extras.
Next 16.4 cacheComponents on: DB/cookies/searchParams reads go inside <Suspense>; no Date.now/new Date in render outside dynamic parts
Dev DB: local postgres 16 (service postgresql start), npm run db:push && npm run db:seed; admin admin@chungoh.local
Theme: data-theme on <html> set by src/lib/theme.ts head script + ThemeToggle; --nav-active token. Header usePathname lives inside <Suspense>.
Map: about page shows src/components/naver-map.tsx only when site_settings 'naver_map_client_id' is set (admin → 설정, src/lib/settings.ts).
A/S: /as form → as_requests (phone encrypted, honeypot "website"), admin /admin/as, mypage list. List is never public.
Deploy: always-on Windows PC per docs/DEPLOY-PC.md (scripts/windows/*.ps1, Task Scheduler, cloudflared). npm run admin:password changes admin pw. User terminal blocks npm.ps1: use npm.cmd.
Cloud session proxy blocks tosspayments.com and chung-oh.co.kr (CONNECT 403)
Local Windows PC: repo at D:\청오 (E: is FAT32, too slow). Postgres 16 Windows service, DB/user chungoh/chungoh. .env.local uses Toss public docs test keys; Toss test PIN 000000
