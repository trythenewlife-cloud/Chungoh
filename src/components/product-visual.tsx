import { PanelTopOpen, Cpu, Droplets, Thermometer, Wrench, Network } from "lucide-react";

const map = {
  opener: { Icon: PanelTopOpen, from: "#d9f2c4", to: "#9fd88a" },
  controller: { Icon: Cpu, from: "#dceee6", to: "#8fc7ad" },
  nutrient: { Icon: Droplets, from: "#d6ecf2", to: "#86c3d6" },
  sensor: { Icon: Thermometer, from: "#f0f2cf", to: "#d3dc84" },
  parts: { Icon: Wrench, from: "#e7eadf", to: "#b9c1a8" },
  system: { Icon: Network, from: "#1d5a37", to: "#0f3b22" },
} as const;

// 실제 제품 사진을 받기 전까지 쓰는 카테고리별 그래픽 썸네일
export function ProductVisual({ category, className = "" }: { category: string; className?: string }) {
  const v = map[category as keyof typeof map] ?? map.parts;
  const dark = category === "system";
  return (
    <div
      className={`relative grid aspect-[4/3] place-items-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(140deg, ${v.from}, ${v.to})` }}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 200 150" preserveAspectRatio="none">
        <path d="M0 120 Q100 20 200 120" fill="none" stroke={dark ? "#c4f06a" : "#ffffff"} strokeWidth="1.5" />
        <path d="M0 140 Q100 50 200 140" fill="none" stroke={dark ? "#c4f06a" : "#ffffff"} strokeWidth="1" />
      </svg>
      <v.Icon className={`relative h-14 w-14 ${dark ? "text-[#c4f06a]" : "text-[#13321f]"}`} strokeWidth={1.4} />
    </div>
  );
}
