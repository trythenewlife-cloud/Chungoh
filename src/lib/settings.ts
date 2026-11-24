import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export const settingKeys = {
  naverMapClientId: "naver_map_client_id",
} as const;

export type SettingKey = (typeof settingKeys)[keyof typeof settingKeys];

export async function getSetting(key: SettingKey): Promise<string | null> {
  const [row] = await db.select({ value: schema.siteSettings.value }).from(schema.siteSettings).where(eq(schema.siteSettings.key, key)).limit(1);
  return row?.value || null;
}
