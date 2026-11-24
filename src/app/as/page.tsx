import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { company } from "@/lib/catalog";
import { AsForm } from "./as-form";

export const metadata: Metadata = { title: "A/S 신청" };

export default function AsPage() {
  return (
    <div className="container-x max-w-3xl pt-10">
      <p className="eyebrow">A/S 신청</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">고장·점검을 접수해 주세요</h1>
      <p className="mt-2 text-muted">
        담당자가 1영업일 안에 전화드립니다. 급한 경우{" "}
        <a href={`tel:${company.tel}`} className="inline-flex items-center gap-1 font-semibold text-brand"><Phone className="h-4 w-4" />{company.tel}</a>
        로 연락해 주세요.
      </p>
      <AsForm />
    </div>
  );
}
