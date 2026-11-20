import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { ProductForm } from "../product-form";
import { AdminSkeleton } from "../../skeleton";

export default function NewProduct() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Guarded />
    </Suspense>
  );
}

async function Guarded() {
  await requireAdmin();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">상품 등록</h1>
      <ProductForm />
    </div>
  );
}
