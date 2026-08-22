-- Fuel management.
--
-- Adds generators, fuel requisitions and the fuel account ledger behind the
-- monthly consumption report.
--
-- This migration is ADDITIVE ONLY: it creates four enums and three tables and
-- does not alter or drop any existing column, table or data.

-- CreateEnum
CREATE TYPE "FuelRequestType" AS ENUM ('VEHICLE', 'GENERATOR');

-- CreateEnum
CREATE TYPE "FuelRequisitionStatus" AS ENUM ('SUBMITTED', 'RECOMMENDED', 'FUNDING_CONFIRMED', 'ISSUED', 'RECEIVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FuelTransactionType" AS ENUM ('OPENING_BALANCE', 'REPLENISHMENT', 'ISSUE', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "tbl_generators" (
    "generator_id" TEXT NOT NULL,
    "generator_name" TEXT NOT NULL,
    "generator_code" TEXT,
    "location" TEXT,
    "organization_id" TEXT NOT NULL,
    "unit_id" TEXT,
    "fuel_level_percent" INTEGER,
    "status" "OrgStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_generators_pkey" PRIMARY KEY ("generator_id")
);

-- CreateTable
CREATE TABLE "tbl_fuel_requisitions" (
    "fuel_requisition_id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "unit_id" TEXT,
    "request_type" "FuelRequestType" NOT NULL,
    "status" "FuelRequisitionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "vehicle_id" TEXT,
    "generator_id" TEXT,
    "asset_label" TEXT NOT NULL,
    "applicant_user_id" TEXT NOT NULL,
    "applicant_name" TEXT NOT NULL,
    "applicant_position" TEXT,
    "quantity_requested_litres" DECIMAL(10,2) NOT NULL,
    "odometer_km" INTEGER,
    "fuel_indicator_percent" INTEGER,
    "purpose" TEXT NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recommended_by_user_id" TEXT,
    "recommended_by_name" TEXT,
    "recommended_by_position" TEXT,
    "recommended_at" TIMESTAMP(3),
    "recommendation_note" TEXT,
    "funding_confirmed_by_user_id" TEXT,
    "funding_confirmed_by_name" TEXT,
    "funding_confirmed_by_position" TEXT,
    "funding_confirmed_at" TIMESTAMP(3),
    "issued_by_user_id" TEXT,
    "issued_by_name" TEXT,
    "issued_at" TIMESTAMP(3),
    "quantity_supplied_litres" DECIMAL(10,2),
    "amount_rwf" DECIMAL(12,2),
    "received_by_user_id" TEXT,
    "received_by_name" TEXT,
    "received_at" TIMESTAMP(3),
    "rejected_by_user_id" TEXT,
    "rejected_by_name" TEXT,
    "rejected_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_fuel_requisitions_pkey" PRIMARY KEY ("fuel_requisition_id")
);

-- CreateTable
CREATE TABLE "tbl_fuel_transactions" (
    "fuel_transaction_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "type" "FuelTransactionType" NOT NULL,
    "amount_rwf" DECIMAL(14,2) NOT NULL,
    "litres" DECIMAL(10,2),
    "description" TEXT NOT NULL,
    "occurred_on" TIMESTAMP(3) NOT NULL,
    "fuel_requisition_id" TEXT,
    "recorded_by_user_id" TEXT NOT NULL,
    "recorded_by_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_fuel_transactions_pkey" PRIMARY KEY ("fuel_transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_generators_generator_name_organization_id_key" ON "tbl_generators"("generator_name", "organization_id");

-- CreateIndex
CREATE INDEX "tbl_generators_organization_id_idx" ON "tbl_generators"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_fuel_requisitions_reference_key" ON "tbl_fuel_requisitions"("reference");

-- CreateIndex
CREATE INDEX "tbl_fuel_requisitions_organization_id_status_idx" ON "tbl_fuel_requisitions"("organization_id", "status");

-- CreateIndex
CREATE INDEX "tbl_fuel_requisitions_applicant_user_id_idx" ON "tbl_fuel_requisitions"("applicant_user_id");

-- CreateIndex
CREATE INDEX "tbl_fuel_requisitions_vehicle_id_idx" ON "tbl_fuel_requisitions"("vehicle_id");

-- CreateIndex
CREATE INDEX "tbl_fuel_requisitions_generator_id_idx" ON "tbl_fuel_requisitions"("generator_id");

-- CreateIndex
CREATE INDEX "tbl_fuel_transactions_organization_id_occurred_on_idx" ON "tbl_fuel_transactions"("organization_id", "occurred_on");

-- CreateIndex
CREATE INDEX "tbl_fuel_transactions_fuel_requisition_id_idx" ON "tbl_fuel_transactions"("fuel_requisition_id");

-- AddForeignKey
ALTER TABLE "tbl_generators" ADD CONSTRAINT "tbl_generators_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "tbl_organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_generators" ADD CONSTRAINT "tbl_generators_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "tbl_unit"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fuel_requisitions" ADD CONSTRAINT "tbl_fuel_requisitions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "tbl_organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fuel_requisitions" ADD CONSTRAINT "tbl_fuel_requisitions_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "tbl_unit"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fuel_requisitions" ADD CONSTRAINT "tbl_fuel_requisitions_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "tbl_vehicles"("vehicle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fuel_requisitions" ADD CONSTRAINT "tbl_fuel_requisitions_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "tbl_generators"("generator_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fuel_transactions" ADD CONSTRAINT "tbl_fuel_transactions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "tbl_organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fuel_transactions" ADD CONSTRAINT "tbl_fuel_transactions_fuel_requisition_id_fkey" FOREIGN KEY ("fuel_requisition_id") REFERENCES "tbl_fuel_requisitions"("fuel_requisition_id") ON DELETE SET NULL ON UPDATE CASCADE;
