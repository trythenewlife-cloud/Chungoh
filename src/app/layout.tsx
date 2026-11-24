import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { themeInitScript } from "@/lib/theme";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "청오엔지니어링 | 친환경 온실 자동화",
    template: "%s | 청오엔지니어링",
  },
  description:
    "자동개폐기, 개폐기 컨트롤 박스, 양액제어, 복합환경제어 시스템. 2002년부터 온실 자동화를 만들어 온 청오엔지니어링 공식몰.",
  openGraph: { locale: "ko_KR", type: "website", siteName: "청오엔지니어링" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a120d" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col pb-16 md:pb-0">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <MobileTabBar />
        </CartProvider>
      </body>
    </html>
  );
}
