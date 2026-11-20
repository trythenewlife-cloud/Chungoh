import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

// 개발 서버의 핫리로드에서 연결이 계속 늘어나지 않도록 전역에 1개만 유지
const sql =
  globalForDb.sql ??
  postgres(process.env.DATABASE_URL!, {
    max: 5,
    // Supabase Transaction pooler(6543 포트)는 prepared statement를 지원하지 않음
    prepare: false,
  });
if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle(sql, { schema });
export { schema };
