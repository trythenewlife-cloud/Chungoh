import Link from "next/link";
import type { Metadata } from "next";
import { LayoutDashboard, Package, Truck, ClipboardList, Users, Store, Settings, Wrench } from "lucide-react";

export const metadata: Metadata = { title: "관리자", robots: { index: false, follow: false } };

const nav = [
  { href: "/admin", label: "대시보드", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "주문", Icon: Truck },
  { href: "/admin/products", label: "상품", Icon: Package },
  { href: "/admin/quotes", label: "견적", Icon: ClipboardList },
  { href: "/admin/as", label: "A/S", Icon: Wrench },
  { href: "/admin/members", label: "회원", Icon: Users },
  { href: "/admin/settings", label: "설정", Icon: Settings },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="container-x grid gap-6 pt-6 md:grid-cols-[200px_1fr]">
      <aside className="md:sticky md:top-24 md:h-fit">
        <p className="mb-3 hidden text-sm font-bold text-muted md:block">관리자</p>
        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:flex-col md:px-0" aria-label="관리자 메뉴">
          {nav.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 font-semibold hover:bg-surface-2">
              <Icon className="h-4 w-4 text-brand" /> {label}
            </Link>
          ))}
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-muted hover:bg-surface-2">
            <Store className="h-4 w-4" /> 쇼핑몰
          </Link>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
