-- Assign vehicles to organizational units
ALTER TABLE "public"."tbl_vehicles"
ADD COLUMN IF NOT EXISTS "unit_id" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tbl_vehicles_unit_id_fkey'
  ) THEN
    ALTER TABLE "public"."tbl_vehicles"
    ADD CONSTRAINT "tbl_vehicles_unit_id_fkey"
    FOREIGN KEY ("unit_id") REFERENCES "public"."tbl_unit"("unit_id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Optional primary-unit flag used by the app schema
ALTER TABLE "public"."tbl_unit"
ADD COLUMN IF NOT EXISTS "is_primary" BOOLEAN NOT NULL DEFAULT false;

-- GPS hardware linked one-to-one with a vehicle
CREATE TABLE IF NOT EXISTS "public"."tbl_gps_devices" (
    "gps_device_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "device_model" TEXT NOT NULL DEFAULT 'M588GS',
    "imei" TEXT NOT NULL,
    "sim_number" TEXT,
    "phone_number" TEXT,
    "apn" TEXT,
    "server_ip" TEXT,
    "server_port" INTEGER,
    "firmware_version" TEXT,
    "install_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tbl_gps_devices_pkey" PRIMARY KEY ("gps_device_id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tbl_gps_devices_vehicle_id_key"
  ON "public"."tbl_gps_devices"("vehicle_id");

CREATE UNIQUE INDEX IF NOT EXISTS "tbl_gps_devices_imei_key"
  ON "public"."tbl_gps_devices"("imei");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tbl_gps_devices_vehicle_id_fkey'
  ) THEN
    ALTER TABLE "public"."tbl_gps_devices"
    ADD CONSTRAINT "tbl_gps_devices_vehicle_id_fkey"
    FOREIGN KEY ("vehicle_id") REFERENCES "public"."tbl_vehicles"("vehicle_id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
