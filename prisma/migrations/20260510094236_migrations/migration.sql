-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."OrgStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."VehicleType" AS ENUM ('AMBULANCE', 'SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'BUS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "public"."TransmissionMode" AS ENUM ('MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('UNDER_REVIEW', 'CANCELED', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'FAILED', 'EXPIRED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "public"."PostitionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."IssueStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "public"."tbl_auth" (
    "auth_id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "updated_at" TIMESTAMP(3),
    "user_status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tbl_auth_pkey" PRIMARY KEY ("auth_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_users" (
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "user_nid" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_dob" TIMESTAMP(3) NOT NULL,
    "user_photo" TEXT,
    "user_gender" "public"."Gender" NOT NULL,
    "street_address" TEXT,
    "auth_id" TEXT NOT NULL,
    "updated_by_user_id" TEXT,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "table_name" TEXT,
    "record_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,

    CONSTRAINT "tbl_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tbl_notifications" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notification_title" TEXT NOT NULL,
    "notification_message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_organizations" (
    "organization_id" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "street_address" TEXT NOT NULL,
    "organization_phone" TEXT NOT NULL,
    "organization_email" TEXT NOT NULL,
    "organization_logo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_customId" TEXT NOT NULL,
    "organization_status" "public"."OrgStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "tbl_organizations_pkey" PRIMARY KEY ("organization_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_reservations" (
    "reservation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservation_purpose" TEXT NOT NULL,
    "start_location" TEXT NOT NULL,
    "reservation_destination" TEXT NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "expected_returning_date" TIMESTAMP(3) NOT NULL,
    "reservation_status" "public"."RequestStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
    "reviewed_at" TIMESTAMP(3),
    "rejection_comment" TEXT,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "passengers" INTEGER NOT NULL DEFAULT 0,
    "approved_at" TIMESTAMP(3),
    "approved_by" TEXT,
    "canceled_at" TIMESTAMP(3),
    "canceled_by" TEXT,
    "completed_at" TIMESTAMP(3),
    "completed_by" TEXT,
    "reviewed_by" TEXT,

    CONSTRAINT "tbl_reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_vehicle_models" (
    "vehicle_model_id" TEXT NOT NULL,
    "vehicle_model_name" TEXT NOT NULL,
    "vehicle_type" "public"."VehicleType" NOT NULL,
    "manufacturer_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_capacity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tbl_vehicle_models_pkey" PRIMARY KEY ("vehicle_model_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_vehicles" (
    "vehicle_id" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "transmission_mode" "public"."TransmissionMode" NOT NULL,
    "vehicle_model_id" TEXT NOT NULL,
    "vehicle_photo" TEXT NOT NULL,
    "vehicle_year" INTEGER NOT NULL,
    "vehicle_status" "public"."VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "energy_type" TEXT NOT NULL,
    "last_service_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "tbl_vehicles_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_reserved_vehicles" (
    "reserved_vehicle_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "starting_odometer" INTEGER NOT NULL,
    "returned_odometer" INTEGER,
    "fuel_provided" INTEGER,
    "returned_date" TIMESTAMP(3),
    "returned_by" TEXT,

    CONSTRAINT "tbl_reserved_vehicles_pkey" PRIMARY KEY ("reserved_vehicle_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_vehicle_locations" (
    "location_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "reserved_vehicle_id" TEXT,
    "coords" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_vehicle_locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_unit" (
    "unit_id" TEXT NOT NULL,
    "unit_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" TEXT NOT NULL,
    "status" "public"."OrgStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "tbl_unit_pkey" PRIMARY KEY ("unit_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_position" (
    "position_id" TEXT NOT NULL,
    "position_name" TEXT NOT NULL,
    "position_description" TEXT NOT NULL,
    "position_access" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "unit_id" TEXT NOT NULL,
    "position_status" "public"."OrgStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "tbl_position_pkey" PRIMARY KEY ("position_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_vehicle_issues" (
    "issue_id" TEXT NOT NULL,
    "issue_title" TEXT NOT NULL,
    "issue_status" "public"."IssueStatus" NOT NULL DEFAULT 'OPEN',
    "issue_description" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "issue_responder" TEXT,
    "reserved_vehicle_id" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "tbl_vehicle_issues_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "public"."tbl_jwt_blacklist" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_jwt_blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_email_key" ON "public"."tbl_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_user_nid_key" ON "public"."tbl_users"("user_nid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_user_phone_key" ON "public"."tbl_users"("user_phone");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_auth_id_key" ON "public"."tbl_users"("auth_id");

-- CreateIndex
CREATE INDEX "tbl_audit_logs_user_id_idx" ON "public"."tbl_audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "tbl_audit_logs_table_name_idx" ON "public"."tbl_audit_logs"("table_name");

-- CreateIndex
CREATE INDEX "tbl_audit_logs_record_id_idx" ON "public"."tbl_audit_logs"("record_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_organizations_organization_name_key" ON "public"."tbl_organizations"("organization_name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_organizations_organization_phone_key" ON "public"."tbl_organizations"("organization_phone");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_organizations_organization_email_key" ON "public"."tbl_organizations"("organization_email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_organizations_organization_customId_key" ON "public"."tbl_organizations"("organization_customId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vehicle_models_vehicle_model_name_key" ON "public"."tbl_vehicle_models"("vehicle_model_name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vehicles_plate_number_key" ON "public"."tbl_vehicles"("plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_unit_unit_name_organization_id_key" ON "public"."tbl_unit"("unit_name", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_position_position_name_unit_id_key" ON "public"."tbl_position"("position_name", "unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_jwt_blacklist_token_key" ON "public"."tbl_jwt_blacklist"("token");

-- CreateIndex
CREATE INDEX "tbl_jwt_blacklist_expires_at_idx" ON "public"."tbl_jwt_blacklist"("expires_at");

-- AddForeignKey
ALTER TABLE "public"."tbl_users" ADD CONSTRAINT "tbl_users_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "public"."tbl_auth"("auth_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_audit_logs" ADD CONSTRAINT "tbl_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_notifications" ADD CONSTRAINT "tbl_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reservations" ADD CONSTRAINT "tbl_reservations_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reservations" ADD CONSTRAINT "tbl_reservations_canceled_by_fkey" FOREIGN KEY ("canceled_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reservations" ADD CONSTRAINT "tbl_reservations_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reservations" ADD CONSTRAINT "tbl_reservations_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reservations" ADD CONSTRAINT "tbl_reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_vehicles" ADD CONSTRAINT "tbl_vehicles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."tbl_organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_vehicles" ADD CONSTRAINT "tbl_vehicles_vehicle_model_id_fkey" FOREIGN KEY ("vehicle_model_id") REFERENCES "public"."tbl_vehicle_models"("vehicle_model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reserved_vehicles" ADD CONSTRAINT "tbl_reserved_vehicles_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."tbl_reservations"("reservation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reserved_vehicles" ADD CONSTRAINT "tbl_reserved_vehicles_returned_by_fkey" FOREIGN KEY ("returned_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_reserved_vehicles" ADD CONSTRAINT "tbl_reserved_vehicles_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."tbl_vehicles"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_vehicle_locations" ADD CONSTRAINT "tbl_vehicle_locations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."tbl_vehicles"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_vehicle_locations" ADD CONSTRAINT "tbl_vehicle_locations_reserved_vehicle_id_fkey" FOREIGN KEY ("reserved_vehicle_id") REFERENCES "public"."tbl_reserved_vehicles"("reserved_vehicle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_unit" ADD CONSTRAINT "tbl_unit_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."tbl_organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_position" ADD CONSTRAINT "tbl_position_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."tbl_unit"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_position" ADD CONSTRAINT "tbl_position_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_vehicle_issues" ADD CONSTRAINT "tbl_vehicle_issues_issue_responder_fkey" FOREIGN KEY ("issue_responder") REFERENCES "public"."tbl_users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_vehicle_issues" ADD CONSTRAINT "tbl_vehicle_issues_reserved_vehicle_id_fkey" FOREIGN KEY ("reserved_vehicle_id") REFERENCES "public"."tbl_reserved_vehicles"("reserved_vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tbl_jwt_blacklist" ADD CONSTRAINT "tbl_jwt_blacklist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
