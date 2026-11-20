import { Suspense } from "react";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "주문/결제" };

export default function CheckoutPage() {
  return (
    <div className="container-x pt-10">
      <h1 className="text-3xl font-bold tracking-tight">주문/결제</h1>
      <Suspense fallback={<div className="card mt-6 h-[480px] animate-pulse" />}>
        <WithUser />
      </Suspense>
    </div>
  );
}

async function WithUser() {
  const u = await getCurrentUser();
  return <CheckoutForm user={u ? { id: u.id, name: u.name, email: u.email, isBusiness: u.isBusiness } : null} />;
}
