-- Convert the fixed VehicleType enum into a manageable tbl_vehicle_types table
-- so organisations can add their own vehicle types.
--
-- Data-safe: the vehicle_type column is altered from the enum to TEXT in place
-- (existing values such as 'SUV' are preserved as strings), and the eight
-- built-in enum values are seeded as global defaults.

-- 1. New table for manageable vehicle types.
CREATE TABLE "tbl_vehicle_types" (
    "vehicle_type_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "organization_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_vehicle_types_pkey" PRIMARY KEY ("vehicle_type_id")
);

-- Unique per (name, organization_id). NULL organization_id groups the globals;
-- Postgres treats NULLs as distinct in a normal unique index, so a partial
-- unique index is added below to actually enforce one global row per name.
CREATE UNIQUE INDEX "tbl_vehicle_types_name_organization_id_key"
    ON "tbl_vehicle_types"("name", "organization_id");
CREATE UNIQUE INDEX "tbl_vehicle_types_name_global_key"
    ON "tbl_vehicle_types"("name")
    WHERE "organization_id" IS NULL;
CREATE INDEX "tbl_vehicle_types_organization_id_idx"
    ON "tbl_vehicle_types"("organization_id");

ALTER TABLE "tbl_vehicle_types"
    ADD CONSTRAINT "tbl_vehicle_types_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "tbl_organizations"("organization_id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. Seed the eight built-in types as global defaults.
INSERT INTO "tbl_vehicle_types" ("vehicle_type_id", "name", "is_default", "organization_id")
VALUES
    (gen_random_uuid(), 'AMBULANCE',  true, NULL),
    (gen_random_uuid(), 'SEDAN',      true, NULL),
    (gen_random_uuid(), 'SUV',        true, NULL),
    (gen_random_uuid(), 'TRUCK',      true, NULL),
    (gen_random_uuid(), 'VAN',        true, NULL),
    (gen_random_uuid(), 'MOTORCYCLE', true, NULL),
    (gen_random_uuid(), 'BUS',        true, NULL),
    (gen_random_uuid(), 'OTHER',      true, NULL);

-- 3. Convert tbl_vehicle_models.vehicle_type from the enum to TEXT in place.
--    Existing rows keep their value (e.g. 'SUV') as a string.
ALTER TABLE "tbl_vehicle_models"
    ALTER COLUMN "vehicle_type" TYPE TEXT USING "vehicle_type"::text;

-- 4. The VehicleType enum is now unused; drop it.
DROP TYPE "VehicleType";
