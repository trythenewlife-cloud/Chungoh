// 히어로용 온실 단면 일러스트 (SVG). 센서·개폐기 위치를 점으로 표시
export function GreenhouseArt() {
  return (
    <svg viewBox="0 0 480 320" className="h-auto w-full" role="img" aria-label="자동화 온실 단면도">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand-soft)" />
          <stop offset="1" stopColor="var(--surface)" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="1" stopColor="#c4f06a" stopOpacity=".18" />
        </linearGradient>
      </defs>
      <rect width="480" height="320" rx="28" fill="url(#sky)" />
      <circle cx="400" cy="62" r="26" fill="#f6d365" opacity=".9" />
      <path d="M40 262 Q240 40 440 262 Z" fill="url(#glass)" stroke="var(--brand)" strokeWidth="2.5" />
      {[100, 170, 240, 310, 380].map((x) => (
        <line key={x} x1={x} y1={262} x2={x} y2={x === 240 ? 152 : x === 170 || x === 310 ? 170 : 222} stroke="var(--brand)" strokeOpacity=".35" strokeWidth="1.5" />
      ))}
      {/* 측창: 열림 표시 */}
      <rect x="44" y="214" width="34" height="10" rx="3" fill="var(--accent)" />
      <rect x="402" y="214" width="34" height="10" rx="3" fill="var(--accent)" />
      <rect x="30" y="262" width="420" height="10" rx="5" fill="var(--brand)" />
      {/* 작물 */}
      {[110, 150, 190, 230, 270, 310, 350].map((x, i) => (
        <g key={x} className="sway" style={{ animationDelay: `${i * 0.3}s` }}>
          <path d={`M${x} 262 v-26`} stroke="#2f7d4f" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx={x - 7} cy={242} rx="9" ry="5" fill="#4fae6a" transform={`rotate(-30 ${x - 7} 242)`} />
          <ellipse cx={x + 7} cy={236} rx="9" ry="5" fill="#3d9a58" transform={`rotate(30 ${x + 7} 236)`} />
        </g>
      ))}
      {/* 센서 포인트 */}
      {[
        { x: 240, y: 152, label: "천창" },
        { x: 130, y: 196, label: "온습도" },
        { x: 352, y: 196, label: "CO₂" },
      ].map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="7" fill="var(--accent)" stroke="var(--brand)" strokeWidth="2" />
          <rect x={p.x - 26} y={p.y - 32} width="52" height="20" rx="10" fill="var(--brand)" />
          <text x={p.x} y={p.y - 18} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--brand-ink)">
            {p.label}
          </text>
        </g>
      ))}
      <rect x="196" y="282" width="88" height="24" rx="12" fill="var(--surface)" stroke="var(--line)" />
      <text x="240" y="298" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">
        복합환경제어기
      </text>
    </svg>
  );
}
