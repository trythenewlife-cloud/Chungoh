"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button type="button" onClick={toggle} aria-label="밝은 테마와 어두운 테마 전환" title="테마 전환" className={`rounded-full p-2.5 hover:bg-surface-2 ${className}`}>
      <Moon className="h-5 w-5 [[data-theme=dark]_&]:hidden" />
      <Sun className="hidden h-5 w-5 [[data-theme=dark]_&]:block" />
    </button>
  );
}
