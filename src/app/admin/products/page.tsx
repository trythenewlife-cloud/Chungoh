import Link from "next/link";
import { Suspense } from "react";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { categoryLabel } from "@/lib/catalog";
import { won } from "@/lib/pricing";
import { AdminSkeleton } from "../skeleton";
import { ToggleActive } from "./toggle-active";

export default function AdminProducts() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <List />
    </Suspense>
  );
}

async function List() {
  await requireAdmin();
  const items = await db.select().from(schema.products).orderBy(asc(schema.products.sort));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">상품 {items.length}</h1>
        <Link href="/admin/products/new" className="btn-primary"><Plus className="h-4 w-4" /> 상품 등록</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[15px]">
          <thead className="border-b border-line text-sm text-muted">
            <tr><th className="p-3">상품</th><th>분류</th><th>판매</th><th className="text-right">가격</th><th className="text-right">재고</th><th className="p-3 text-center">노출</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((p) => (
              <tr key={p.id} className={p.isActive ? "" : "opacity-50"}>
                <td className="p-3"><Link href={`/admin/products/${p.id}`} className="font-semibold hover:text-brand">{p.name}</Link><div className="text-[13px] text-muted">/{p.slug}</div></td>
                <td>{categoryLabel(p.category)}</td>
                <td>{p.saleType === "buy" ? "결제" : "견적"}</td>
                <td className="text-right tabular-nums">{p.saleType === "buy" ? won(p.price) : "-"}</td>
                <td className={`text-right tabular-nums ${p.saleType === "buy" && p.stock <= 10 ? "font-bold text-warn" : ""}`}>{p.saleType === "buy" ? p.stock : "-"}</td>
                <td className="p-3 text-center"><ToggleActive id={p.id} active={p.isActive} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
