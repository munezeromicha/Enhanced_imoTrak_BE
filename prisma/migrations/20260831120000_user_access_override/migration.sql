-- Per-user extra permission grants. Position access stays the shared baseline;
-- this JSON is OR-merged on top at login and on every authenticated request.
ALTER TABLE "tbl_users" ADD COLUMN IF NOT EXISTS "user_access_override" JSONB;
