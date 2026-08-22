-- Signatures.
--
-- Gives each user one stored signature image, and snapshots the signature onto
-- every section of a fuel requisition as it is signed. The snapshot exists for
-- the same reason the name and position are snapshotted: the record must show
-- the signature as it stood at the moment of signing, not follow whatever the
-- person uploads later.
--
-- This migration is ADDITIVE ONLY: it adds nullable columns and does not alter
-- or drop any existing column, table or data.

-- AlterTable
ALTER TABLE "tbl_users" ADD COLUMN "signature_url" TEXT;

-- AlterTable
ALTER TABLE "tbl_fuel_requisitions" ADD COLUMN "applicant_signature_url" TEXT;
ALTER TABLE "tbl_fuel_requisitions" ADD COLUMN "recommended_by_signature_url" TEXT;
ALTER TABLE "tbl_fuel_requisitions" ADD COLUMN "funding_confirmed_by_signature_url" TEXT;
ALTER TABLE "tbl_fuel_requisitions" ADD COLUMN "issued_by_signature_url" TEXT;
ALTER TABLE "tbl_fuel_requisitions" ADD COLUMN "received_by_signature_url" TEXT;
