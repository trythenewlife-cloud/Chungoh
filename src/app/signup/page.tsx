import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "회원가입" };

export default function SignupPage({ searchParams }: PageProps<"/signup">) {
  return (
    <div className="container-x max-w-lg pt-14">
      <h1 className="text-3xl font-bold tracking-tight">회원가입</h1>
      <p className="mt-2 text-muted">사업자 회원은 세금계산서를 발행받을 수 있습니다.</p>
      <Suspense fallback={<div className="card mt-6 h-[560px] animate-pulse" />}>
        <WithNext searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function WithNext({ searchParams }: Pick<PageProps<"/signup">, "searchParams">) {
  const sp = await searchParams;
  return <SignupForm next={typeof sp.next === "string" ? sp.next : ""} />;
}
