"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type Video = { id: string; title: string };

// 썸네일만 먼저 보여 주고, 누르면 그때 유튜브 플레이어를 불러온다 (youtube-nocookie: 재생 전 쿠키 없음).
export function VideoGrid({ videos }: { videos: readonly Video[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id} className="card overflow-hidden">
          <div className="relative aspect-video bg-black">
            {playing === v.id ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                title={v.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button type="button" onClick={() => setPlaying(v.id)} className="group absolute inset-0" aria-label={`${v.title} 영상 재생`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- 유튜브 썸네일, 최적화 불필요 */}
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-ink shadow-lg transition group-hover:scale-110">
                    <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                  </span>
                </span>
              </button>
            )}
          </div>
          <p className="px-5 py-4 font-semibold">{v.title}</p>
        </li>
      ))}
    </ul>
  );
}
