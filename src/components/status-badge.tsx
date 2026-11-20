import { orderStatusLabel } from "@/lib/catalog";

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "cancelled" ? "bg-danger/10 text-danger" : status === "delivered" ? "bg-surface-2 text-muted" : status === "pending" ? "bg-warn/10 text-warn" : "bg-brand-soft text-brand";
  return <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${tone}`}>{orderStatusLabel[status] ?? status}</span>;
}
