/**
 * Seeds (or updates) a default password-protected admin account in the configured
 * database. Idempotent. Override with SEED_EMAIL / SEED_PASSWORD env vars.
 *
 *   npx tsx scripts/seed-account.ts
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

// Load .env (tsx doesn't auto-load it). Runs before `new PrismaClient()`.
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const prisma = new PrismaClient();

const EMAIL = (process.env.SEED_EMAIL ?? "admin@thedevdose.com").toLowerCase();
const PASSWORD = process.env.SEED_PASSWORD ?? "DevDose@2026!";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { passwordHash: hashPassword(PASSWORD), isAdmin: true, name: "Admin" },
    create: { email: EMAIL, name: "Admin", passwordHash: hashPassword(PASSWORD), isAdmin: true },
  });
  console.log("✅ Default admin account is ready:");
  console.log("   email:    " + user.email);
  console.log("   password: " + PASSWORD);
  console.log("   isAdmin:  " + user.isAdmin);
  console.log("   id:       " + user.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ FAIL:", e?.message ?? e);
    await prisma.$disconnect();
    process.exit(1);
  });
