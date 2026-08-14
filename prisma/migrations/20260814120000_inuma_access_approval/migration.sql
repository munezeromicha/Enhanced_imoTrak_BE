-- Inuma SSO access approval workflow
ALTER TYPE "UserStatus" ADD VALUE 'PENDING_APPROVAL';

ALTER TABLE "tbl_auth"
  ADD COLUMN IF NOT EXISTS "inuma_position" TEXT,
  ADD COLUMN IF NOT EXISTS "inuma_unit" TEXT,
  ADD COLUMN IF NOT EXISTS "inuma_campus_code" TEXT,
  ADD COLUMN IF NOT EXISTS "matched_unit_id" TEXT,
  ADD COLUMN IF NOT EXISTS "matched_position_id" TEXT,
  ADD COLUMN IF NOT EXISTS "imotrak_access_approved_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "imotrak_access_approved_by_user_id" TEXT;
