import { Suspense } from "react";
import type { Metadata } from "next";
import { QuoteWizard } from "./wizard";

export const metadata: Metadata = { title: "견적문의" };

export default function QuotePage() {
  return (
    <div className="container-x max-w-3xl pt-10">
      <p className="eyebrow">무료 견적</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">3단계로 끝나는 견적 요청</h1>
      <p className="mt-2 text-muted">담당자가 1영업일 안에 연락드립니다. 스마트팜 지원사업 대상 여부도 함께 안내합니다.</p>
      <Suspense fallback={<div className="card mt-8 h-96 animate-pulse" />}>
        <QuoteWizard />
      </Suspense>
    </div>
  );
}
