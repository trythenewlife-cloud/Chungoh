"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Menu, X, ShoppingCart, User, Phone } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "./cart";
import { company } from "@/lib/catalog";

const nav = [
  { href: "/about", label: "회사소개" },
  { href: "/solutions", label: "솔루션" },
  { href: "/cases", label: "시공사례" },
  { href: "/products", label: "제품몰" },
  { href: "/quote", label: "견적문의" },
  { href: "/as", label: "A/S신청" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count, ready } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="청오엔지니어링 홈" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="주 메뉴">
          <Suspense fallback={<NavLinks pathname="" />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>
        <div className="flex items-center gap-1">
          <a href={`tel:${company.tel}`} className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-brand lg:inline-flex">
            <Phone className="h-4 w-4" /> {company.tel}
          </a>
          <ThemeToggle />
          <Link href="/mypage" className="hidden rounded-full p-2.5 hover:bg-surface-2 md:inline-flex" aria-label="마이페이지">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative rounded-full p-2.5 hover:bg-surface-2" aria-label={`장바구니 ${count}개`}>
            <ShoppingCart className="h-5 w-5" />
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-ink">
                {count}
              </span>
            )}
          </Link>
          <button className="rounded-full p-2.5 hover:bg-surface-2 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="메뉴 열기" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-bg md:hidden" aria-label="모바일 메뉴">
          <div className="container-x grid gap-1 py-3">
            <Suspense fallback={<NavLinks pathname="" mobile onNavigate={() => setOpen(false)} />}>
              <ActiveNavLinks mobile onNavigate={() => setOpen(false)} />
            </Suspense>
            <a href={`tel:${company.tel}`} className="btn-primary mt-2">
              <Phone className="h-4 w-4" /> 전화 상담 {company.tel}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

type NavProps = { mobile?: boolean; onNavigate?: () => void };

// usePathname 은 런타임 값이라 cacheComponents 에서 <Suspense> 안에서만 읽는다.
function ActiveNavLinks(props: NavProps) {
  return <NavLinks pathname={usePathname()} {...props} />;
}

function NavLinks({ pathname, mobile, onNavigate }: NavProps & { pathname: string }) {
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const base = mobile ? "rounded-2xl px-4 py-3 text-lg hover:bg-surface-2" : "rounded-full px-4 py-2 text-[15px] hover:bg-surface-2";
  const idle = mobile ? "font-semibold" : "font-medium text-ink/80 hover:text-ink";
  return nav.map((n) => (
    <Link
      key={n.href}
      href={n.href}
      onClick={onNavigate}
      aria-current={isActive(n.href) ? "page" : undefined}
      className={`${base} ${isActive(n.href) ? "font-bold text-[var(--nav-active)]" : idle}`}
    >
      {n.label}
    </Link>
  ));
}
