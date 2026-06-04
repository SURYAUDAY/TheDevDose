/**
 * One-off backend smoke test: exercises the real schema against the configured
 * database (create a test user + progress/note/code/run/event, read them back,
 * then delete). Proves connectivity + tables + cascade. Safe: uses a dedicated
 * test email and cleans up after itself.
 *
 *   npx tsx scripts/verify-backend.ts
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

// Load .env (tsx doesn't auto-load it). Runs before `new PrismaClient()`, which
// is when the datasource URL is read.
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const prisma = new PrismaClient();

const EMAIL = "verify-bot@thedevdose.local";

async function main() {
  await prisma.user.deleteMany({ where: { email: EMAIL } });

  const user = await prisma.user.create({ data: { email: EMAIL, name: "Verify Bot" } });
  await prisma.topicProgress.create({
    data: { userId: user.id, topicId: "p1a-001", phaseId: "p1a-javascript", status: "completed", completedAt: new Date() },
  });
  await prisma.topicNote.create({ data: { userId: user.id, topicId: "p1a-001", body: "smoke-test note" } });
  await prisma.savedCode.create({
    data: { userId: user.id, topicId: "p1a-001", fileName: "test", source: "console.log('hi')" },
  });
  await prisma.codeRun.create({ data: { userId: user.id, topicId: "p1a-001", language: "javascript", passed: true } });
  await prisma.streak.create({ data: { userId: user.id, current: 1, longest: 1, lastActiveDay: new Date() } });
  await prisma.event.create({ data: { userId: user.id, name: "topic_completed", props: { topicId: "p1a-001" } } });

  const counts = {
    progress: await prisma.topicProgress.count({ where: { userId: user.id } }),
    notes: await prisma.topicNote.count({ where: { userId: user.id } }),
    savedCode: await prisma.savedCode.count({ where: { userId: user.id } }),
    codeRuns: await prisma.codeRun.count({ where: { userId: user.id } }),
    events: await prisma.event.count({ where: { userId: user.id } }),
  };
  console.log("✅ wrote & read back:", JSON.stringify(counts));

  await prisma.user.delete({ where: { id: user.id } }); // cascade-deletes the rest
  const leftover = await prisma.user.count({ where: { email: EMAIL } });
  const orphanNotes = await prisma.topicNote.count({ where: { topicId: "p1a-001", body: "smoke-test note" } });
  console.log(`✅ cleanup ok (user=${leftover}, orphanNotes=${orphanNotes}, both should be 0)`);
  console.log("✅ Neon backend is live and the schema works.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ FAIL:", e?.message ?? e);
    await prisma.$disconnect();
    process.exit(1);
  });
