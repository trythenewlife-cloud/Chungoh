import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { getSetting, settingKeys } from "@/lib/settings";
import { AdminSkeleton } from "../skeleton";
import { MapSettingsForm } from "./map-settings-form";

export default function AdminSettings() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  await requireAdmin();
  const clientId = await getSetting(settingKeys.naverMapClientId);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">설정</h1>
      <MapSettingsForm clientId={clientId ?? ""} />
    </div>
  );
}
