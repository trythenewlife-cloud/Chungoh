export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="10" fill="var(--brand)" />
        <path d="M6 22 Q16 6 26 22" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M6 22h20M11 22v-5M16 22v-8M21 22v-5" stroke="var(--brand-ink)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="text-[19px]">
        청오<span className="text-muted font-semibold">엔지니어링</span>
      </span>
    </span>
  );
}
