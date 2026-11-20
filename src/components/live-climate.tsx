"use client";

import { useEffect, useState } from "react";
import { Thermometer, Droplets, Wind, Sun, PanelTopOpen } from "lucide-react";

type Reading = { t: number; h: number; co2: number; sun: number; vent: number };

const N = 24;

function next(prev: Reading): Reading {
  const jitter = (v: number, d: number, min: number, max: number) => Math.min(max, Math.max(min, v + (Math.random() - 0.5) * d));
  const t = jitter(prev.t, 0.6, 18, 31);
  // 설정 온도 25℃를 넘으면 개폐기가 단계적으로 열린다
  const vent = Math.round(Math.min(100, Math.max(0, (t - 25) * 18)));
  return { t, h: jitter(prev.h, 2, 55, 85), co2: jitter(prev.co2, 30, 380, 900), sun: jitter(prev.sun, 40, 200, 900), vent };
}

function Spark({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <svg className="h-8 w-full" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (N - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 26 - 2}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

// 메인 화면의 복합환경제어 데모 위젯. 실제 센서 연동 전까지 가상 데이터로 동작한다.
export function LiveClimate() {
  const [hist, setHist] = useState<Reading[]>([{ t: 24.6, h: 68, co2: 520, sun: 610, vent: 0 }]);

  useEffect(() => {
    const id = setInterval(() => setHist((h) => [...h.slice(-(N - 1)), next(h[h.length - 1])]), 1500);
    return () => clearInterval(id);
  }, []);

  const cur = hist[hist.length - 1];
  const items = [
    { label: "온도", value: `${cur.t.toFixed(1)}℃`, Icon: Thermometer, key: "t" as const, color: "#e3793b" },
    { label: "습도", value: `${cur.h.toFixed(0)}%`, Icon: Droplets, key: "h" as const, color: "#3b9ee3" },
    { label: "CO₂", value: `${cur.co2.toFixed(0)}ppm`, Icon: Wind, key: "co2" as const, color: "#7a8f3b" },
    { label: "일사량", value: `${cur.sun.toFixed(0)}W/㎡`, Icon: Sun, key: "sun" as const, color: "#d4a514" },
  ];

  return (
    <div className="card overflow-hidden p-5 shadow-[0_20px_60px_-30px_rgba(15,60,30,.35)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="live-dot h-2.5 w-2.5 rounded-full bg-accent" />
          논산 딸기온실 3동 · 실시간
        </div>
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-muted">데모 데이터</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value, Icon, key, color }) => (
          <div key={key} className="rounded-2xl bg-surface-2 p-3">
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              <Icon className="h-4 w-4" style={{ color }} /> {label}
            </div>
            <div className="mt-0.5 text-xl font-bold tabular-nums">{value}</div>
            <Spark data={hist.map((r) => r[key])} color={color} />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-2xl bg-brand p-4 text-brand-ink">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-semibold">
            <PanelTopOpen className="h-4 w-4" /> 측창 개폐기 자동 제어
          </span>
          <span className="tabular-nums font-bold">{cur.vent}% 열림</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
          <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${cur.vent}%` }} />
        </div>
        <p className="mt-2 text-[12px] opacity-80">설정 온도 25℃ 초과 시 단계 개방 · 강우 감지 시 즉시 닫힘</p>
      </div>
    </div>
  );
}
