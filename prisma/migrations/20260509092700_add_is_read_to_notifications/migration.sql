-- Add missing is_read column (prod hotfix)
ALTER TABLE "tbl_notifications"
ADD COLUMN IF NOT EXISTS "is_read" BOOLEAN NOT NULL DEFAULT false;

