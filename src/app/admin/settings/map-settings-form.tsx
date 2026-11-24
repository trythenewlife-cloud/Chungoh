"use client";

import { useActionState } from "react";
import { saveMapSettings } from "@/app/actions/admin";

export function MapSettingsForm({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(saveMapSettings, undefined);
  return (
    <form key={state?.ts} action={action} className="card space-y-4 p-6">
      <div>
        <h2 className="text-lg font-bold">회사소개 지도</h2>
        <p className="mt-1 text-sm text-muted">
          {clientId ? "지도가 회사소개 페이지에 표시되고 있습니다." : "Client ID 가 없어 지도가 숨겨져 있습니다."}
        </p>
      </div>
      <div>
        <label className="label" htmlFor="naverMapClientId">네이버 지도 Client ID</label>
        <input id="naverMapClientId" name="naverMapClientId" className="input" defaultValue={clientId} autoComplete="off" spellCheck={false} placeholder="비워 두면 지도를 숨깁니다" />
        <p className="mt-1.5 text-sm text-muted">
          네이버 클라우드 플랫폼 콘솔 → Maps → Application 에서 Dynamic Map·Geocoding 을 선택해 발급합니다. Web 서비스 URL 에 사이트 주소를 등록해야 지도가 뜹니다.
        </p>
      </div>
      {state?.error && <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-semibold text-danger" role="alert">{state.error}</p>}
      {state?.ok && <p className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-semibold text-brand" role="status">저장했습니다.</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "저장 중…" : "저장"}</button>
    </form>
  );
}
