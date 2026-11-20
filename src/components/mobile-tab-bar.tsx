"use client";

import Link from "next/link";
import { House, Package, ClipboardList, ShoppingCart, User } from "lucide-react";
import { useCart } from "./cart";

const tabs = [
  { href: "/", label: "홈", Icon: House },
  { href: "/products", label: "제품", Icon: Package },
  { href: "/quote", label: "견적", Icon: ClipboardList },
  { href: "/cart", label: "장바구니", Icon: ShoppingCart },
  { href: "/mypage", label: "마이", Icon: User },
];

// 모바일 하단 고정 탭바: 엄지 영역에서 핵심 동선 5개를 바로 누를 수 있게 배치
export function MobileTabBar() {
  const { count, ready } = useCart();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden" aria-label="하단 메뉴">
      <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link href={href} className="relative flex h-16 flex-col items-center justify-center gap-0.5 text-[12px] font-medium text-muted">
              <Icon className="h-5 w-5 text-ink" />
              {label}
              {href === "/cart" && ready && count > 0 && (
                <span className="absolute right-[calc(50%-20px)] top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
                  {count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
