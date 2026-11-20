import { Suspense } from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { ProductForm } from "../product-form";
import { AdminSkeleton } from "../../skeleton";

export default function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Edit params={params} />
    </Suspense>
  );
}

async function Edit({ params }: Pick<PageProps<"/admin/products/[id]">, "params">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [p] = await db.select().from(schema.products).where(eq(schema.products.id, id));
  if (!p) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">상품 수정</h1>
      <ProductForm p={p} />
    </div>
  );
}
