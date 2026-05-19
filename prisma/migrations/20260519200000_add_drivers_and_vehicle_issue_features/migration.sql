-- Driver assignments, issue replies, and vehicle-issue enhancements.
-- Idempotent: safe when objects already exist (e.g. applied via db push).

DO $$ BEGIN
  CREATE TYPE "public"."DriverStatus" AS ENUM ('AVAILABLE', 'ON_TRIP', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "public"."IssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'DANGER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "public"."tbl_drivers" (
    "driver_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_category" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "driver_status" "public"."DriverStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_drivers_pkey" PRIMARY KEY ("driver_id")
);

CREATE TABLE IF NOT EXISTS "public"."tbl_reserved_vehicle_drivers" (
    "assignment_id" TEXT NOT NULL,
    "reserved_vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "unassigned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_reserved_vehicle_drivers_pkey" PRIMARY KEY ("assignment_id")
);

CREATE TABLE IF NOT EXISTS "public"."tbl_vehicle_issue_replies" (
    "reply_id" TEXT NOT NULL,
    "issue_id" TEXT NOT NULL,
    "user_id" TEXT,
    "driver_id" TEXT,
    "reply_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_vehicle_issue_replies_pkey" PRIMARY KEY ("reply_id")
);

ALTER TABLE "public"."tbl_reserved_vehicles"
    ADD COLUMN IF NOT EXISTS "replaced_by_id" TEXT;

ALTER TABLE "public"."tbl_vehicle_issues"
    ADD COLUMN IF NOT EXISTS "reported_by_user_id" TEXT,
    ADD COLUMN IF NOT EXISTS "reported_by_driver_id" TEXT,
    ADD COLUMN IF NOT EXISTS "severity_level" "public"."IssueSeverity" NOT NULL DEFAULT 'LOW',
    ADD COLUMN IF NOT EXISTS "replacement_requested" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "replacement_status" TEXT,
    ADD COLUMN IF NOT EXISTS "replacement_reserved_vehicle_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "tbl_drivers_user_id_key" ON "public"."tbl_drivers"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "tbl_drivers_license_number_key" ON "public"."tbl_drivers"("license_number");
CREATE UNIQUE INDEX IF NOT EXISTS "tbl_reserved_vehicles_replaced_by_id_key" ON "public"."tbl_reserved_vehicles"("replaced_by_id");

DO $$ BEGIN
  ALTER TABLE "public"."tbl_drivers" ADD CONSTRAINT "tbl_drivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_reserved_vehicle_drivers" ADD CONSTRAINT "tbl_reserved_vehicle_drivers_reserved_vehicle_id_fkey" FOREIGN KEY ("reserved_vehicle_id") REFERENCES "public"."tbl_reserved_vehicles"("reserved_vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_reserved_vehicle_drivers" ADD CONSTRAINT "tbl_reserved_vehicle_drivers_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."tbl_drivers"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_reserved_vehicles" ADD CONSTRAINT "tbl_reserved_vehicles_replaced_by_id_fkey" FOREIGN KEY ("replaced_by_id") REFERENCES "public"."tbl_reserved_vehicles"("reserved_vehicle_id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_vehicle_issue_replies" ADD CONSTRAINT "tbl_vehicle_issue_replies_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "public"."tbl_vehicle_issues"("issue_id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_vehicle_issue_replies" ADD CONSTRAINT "tbl_vehicle_issue_replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_vehicle_issue_replies" ADD CONSTRAINT "tbl_vehicle_issue_replies_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."tbl_drivers"("driver_id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_vehicle_issues" ADD CONSTRAINT "tbl_vehicle_issues_reported_by_user_id_fkey" FOREIGN KEY ("reported_by_user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_vehicle_issues" ADD CONSTRAINT "tbl_vehicle_issues_reported_by_driver_id_fkey" FOREIGN KEY ("reported_by_driver_id") REFERENCES "public"."tbl_drivers"("driver_id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."tbl_vehicle_issues" ADD CONSTRAINT "tbl_vehicle_issues_replacement_reserved_vehicle_id_fkey" FOREIGN KEY ("replacement_reserved_vehicle_id") REFERENCES "public"."tbl_reserved_vehicles"("reserved_vehicle_id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
