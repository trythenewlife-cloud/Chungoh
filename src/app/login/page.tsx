import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="container-x max-w-md pt-14">
      <h1 className="text-3xl font-bold tracking-tight">로그인</h1>
      <p className="mt-2 text-muted">주문 내역과 견적 진행 상황을 확인하세요.</p>
      <Suspense fallback={<div className="card mt-6 h-72 animate-pulse" />}>
        <WithNext searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function WithNext({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const sp = await searchParams;
  return <LoginForm next={typeof sp.next === "string" ? sp.next : ""} />;
}
