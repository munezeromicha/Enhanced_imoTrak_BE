/**
 * Updates _prisma_migrations.checksum when a migration file was edited after apply.
 * Usage: npx ts-node prisma/scripts/fix-migration-checksum.ts [migration_folder_name]
 */
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const migrationName =
  process.argv[2] ?? "20260510094236_migrations";

const migrationPath = join(
  __dirname,
  "..",
  "migrations",
  migrationName,
  "migration.sql"
);

const checksum = createHash("sha256")
  .update(readFileSync(migrationPath))
  .digest("hex");

async function main() {
  const prisma = new PrismaClient();
  try {
    const updated = await prisma.$executeRawUnsafe(
      `UPDATE "_prisma_migrations" SET checksum = $1 WHERE migration_name = $2`,
      checksum,
      migrationName
    );
    console.log(
      `Updated checksum for "${migrationName}" (${String(updated)} row(s)).`
    );
    console.log(`checksum: ${checksum}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function removeMigrationRecord(name: string) {
  const prisma = new PrismaClient();
  try {
    const deleted = await prisma.$executeRawUnsafe(
      `DELETE FROM "_prisma_migrations" WHERE migration_name = $1`,
      name
    );
    console.log(`Removed migration record "${name}" (${String(deleted)} row(s)).`);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv.includes("--remove")) {
  const idx = process.argv.indexOf("--remove");
  const name = process.argv[idx + 1];
  if (!name) {
    console.error("Usage: ... --remove <migration_name>");
    process.exit(1);
  }
  removeMigrationRecord(name).catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
