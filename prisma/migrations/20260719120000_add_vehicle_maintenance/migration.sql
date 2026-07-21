-- Vehicle maintenance tracking.
--
-- Adds a record of maintenance jobs per vehicle plus a supervisor history table
-- so a job that changes hands keeps the previous supervisor on record.
--
-- This migration is ADDITIVE ONLY: it creates two new enums and two new tables
-- and does not alter or drop any existing column, table or data.

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'INSPECTION', 'REPAIR', 'TIRE', 'BODYWORK', 'OTHER');

-- CreateTable
CREATE TABLE "tbl_vehicle_maintenance" (
    "maintenance_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "maintenance_type" "MaintenanceType" NOT NULL DEFAULT 'CORRECTIVE',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduled_date" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "service_provider" TEXT,
    "cost" DECIMAL(12,2),
    "currency" TEXT DEFAULT 'RWF',
    "odometer_km" INTEGER,
    "work_performed" TEXT,
    "cancel_reason" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_vehicle_maintenance_pkey" PRIMARY KEY ("maintenance_id")
);

-- CreateTable
CREATE TABLE "tbl_vehicle_maintenance_supervisors" (
    "assignment_id" TEXT NOT NULL,
    "maintenance_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassigned_at" TIMESTAMP(3),
    "handover_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_vehicle_maintenance_supervisors_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateIndex
CREATE INDEX "tbl_vehicle_maintenance_vehicle_id_idx" ON "tbl_vehicle_maintenance"("vehicle_id");

-- CreateIndex
CREATE INDEX "tbl_vehicle_maintenance_status_idx" ON "tbl_vehicle_maintenance"("status");

-- CreateIndex
CREATE INDEX "tbl_vehicle_maintenance_supervisors_maintenance_id_idx" ON "tbl_vehicle_maintenance_supervisors"("maintenance_id");

-- CreateIndex
CREATE INDEX "tbl_vehicle_maintenance_supervisors_user_id_idx" ON "tbl_vehicle_maintenance_supervisors"("user_id");

-- AddForeignKey
ALTER TABLE "tbl_vehicle_maintenance" ADD CONSTRAINT "tbl_vehicle_maintenance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "tbl_vehicles"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_maintenance" ADD CONSTRAINT "tbl_vehicle_maintenance_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "tbl_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_maintenance_supervisors" ADD CONSTRAINT "tbl_vehicle_maintenance_supervisors_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "tbl_vehicle_maintenance"("maintenance_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_vehicle_maintenance_supervisors" ADD CONSTRAINT "tbl_vehicle_maintenance_supervisors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
