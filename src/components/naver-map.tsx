"use client";

import { useEffect, useRef, useState } from "react";

// 주소 변환이 실패할 때 쓰는 기본 위치 (대화로32번길, OpenStreetMap 기준 도로 위치)
const fallback = { lat: 36.3717623, lng: 127.4143036 };

type NaverMaps = {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => { setCenter: (p: unknown) => void };
  Marker: new (opts: Record<string, unknown>) => { setPosition: (p: unknown) => void };
  Service?: {
    geocode: (
      opts: { query: string },
      cb: (status: number, res: { v2: { addresses: { x: string; y: string }[] } }) => void,
    ) => void;
    Status: { OK: number };
  };
};

let loader: Promise<NaverMaps> | null = null;

function loadNaverMaps(id: string) {
  loader ??= new Promise<NaverMaps>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(id)}&submodules=geocoder`;
    s.async = true;
    s.onload = () => {
      const maps = (window as unknown as { naver?: { maps?: NaverMaps } }).naver?.maps;
      if (maps) resolve(maps);
      else reject(new Error("naver maps missing"));
    };
    s.onerror = () => {
      loader = null;
      reject(new Error("naver maps load failed"));
    };
    document.head.appendChild(s);
  });
  return loader;
}

// clientId 는 관리자 설정(site_settings)에서 온다. 값이 있을 때만 이 컴포넌트를 렌더한다.
export function NaverMap({ clientId, address, title, className = "" }: { clientId: string; address: string; title: string; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!el.current) return;
    let alive = true;
    loadNaverMaps(clientId)
      .then((maps) => {
        if (!alive || !el.current) return;
        const start = new maps.LatLng(fallback.lat, fallback.lng);
        const map = new maps.Map(el.current, { center: start, zoom: 16, zoomControl: true });
        const marker = new maps.Marker({ position: start, map, title });
        maps.Service?.geocode({ query: address }, (status, res) => {
          const hit = res?.v2?.addresses?.[0];
          if (!alive || status !== maps.Service?.Status.OK || !hit) return;
          const p = new maps.LatLng(Number(hit.y), Number(hit.x));
          map.setCenter(p);
          marker.setPosition(p);
        });
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [clientId, address, title]);

  if (failed) {
    return (
      <div className={`card grid min-h-56 place-items-center bg-surface-2 p-6 text-center text-muted ${className}`}>
        지도를 불러오지 못했습니다. &lsquo;네이버 지도에서 보기&rsquo; 버튼으로 확인해 주세요.
      </div>
    );
  }

  return <div ref={el} role="region" aria-label={`${title} 위치 지도`} className={`card min-h-72 overflow-hidden ${className}`} />;
}
