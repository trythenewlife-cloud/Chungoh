"use client";

import { useTransition } from "react";
import { toggleProduct } from "@/app/actions/admin";

export function ToggleActive({ id, active }: { id: number; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      role="switch"
      aria-checked={active}
      aria-label="노출 전환"
      disabled={pending}
      onClick={() => start(() => toggleProduct(id, !active))}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${active ? "bg-brand" : "bg-line"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${active ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}
