// 관리자 비밀번호 변경. 사용: npm run admin:password  (터미널에서 직접 입력, 화면에 표시되지 않음)
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema";

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (ch: string) => {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") {
        process.exit(1);
      } else if (ch === "\u0008" || ch === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@chungoh.local";
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client, { schema });
  const pw = await ask(`${email} 새 비밀번호 (12자 이상): `);
  const again = await ask("한 번 더 입력: ");
  if (pw.length < 12) throw new Error("12자 이상이어야 합니다.");
  if (pw !== again) throw new Error("두 입력이 다릅니다.");
  const rows = await db
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(pw, 10) })
    .where(and(eq(schema.users.email, email), eq(schema.users.role, "admin")))
    .returning({ id: schema.users.id });
  await client.end();
  if (rows.length === 0) throw new Error(`관리자 ${email} 이(가) 없습니다. 먼저 npm run db:seed 를 실행하세요.`);
  console.log("관리자 비밀번호를 바꿨습니다. .env.local 의 SEED_ADMIN_PASSWORD 는 다음 db:seed 때만 쓰입니다.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
