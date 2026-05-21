-- Allow multiple users per position via junction table (migrate from tbl_position.user_id)

CREATE TABLE IF NOT EXISTS "public"."tbl_user_position_assignments" (
    "assignment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_user_position_assignments_pkey" PRIMARY KEY ("assignment_id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tbl_user_position_assignments_user_id_position_id_key"
    ON "public"."tbl_user_position_assignments"("user_id", "position_id");

CREATE INDEX IF NOT EXISTS "tbl_user_position_assignments_user_id_idx"
    ON "public"."tbl_user_position_assignments"("user_id");

CREATE INDEX IF NOT EXISTS "tbl_user_position_assignments_position_id_idx"
    ON "public"."tbl_user_position_assignments"("position_id");

-- Backfill existing one-user-per-position assignments
INSERT INTO "public"."tbl_user_position_assignments" ("assignment_id", "user_id", "position_id", "assigned_at")
SELECT gen_random_uuid()::text, "user_id", "position_id", NOW()
FROM "public"."tbl_position"
WHERE "user_id" IS NOT NULL
ON CONFLICT ("user_id", "position_id") DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tbl_user_position_assignments_user_id_fkey'
  ) THEN
    ALTER TABLE "public"."tbl_user_position_assignments"
      ADD CONSTRAINT "tbl_user_position_assignments_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tbl_user_position_assignments_position_id_fkey'
  ) THEN
    ALTER TABLE "public"."tbl_user_position_assignments"
      ADD CONSTRAINT "tbl_user_position_assignments_position_id_fkey"
      FOREIGN KEY ("position_id") REFERENCES "public"."tbl_position"("position_id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "public"."tbl_position" DROP CONSTRAINT IF EXISTS "tbl_position_user_id_fkey";
ALTER TABLE "public"."tbl_position" DROP COLUMN IF EXISTS "user_id";
