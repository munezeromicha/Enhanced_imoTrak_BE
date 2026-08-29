-- Give reservations a unit of their own.
--
-- Vehicle issues reach a unit through reserved_vehicle -> vehicle -> unit_id,
-- so they need no column. Reservations genuinely do: a reservation is raised
-- before any vehicle is assigned, so at the moment it is created there is
-- nothing to derive a unit from. Without this column, "unit isolation" for
-- reservations could only ever be a filter with nothing to filter on.
--
-- The unit recorded is the requester's, not the vehicle's. A campus requests a
-- car; the car belongs to the central fleet. Isolation here is about whose
-- request it is.

ALTER TABLE "tbl_reservations" ADD COLUMN "unit_id" TEXT;

ALTER TABLE "tbl_reservations"
  ADD CONSTRAINT "tbl_reservations_unit_id_fkey"
  FOREIGN KEY ("unit_id") REFERENCES "tbl_unit"("unit_id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "tbl_reservations_unit_id_idx" ON "tbl_reservations"("unit_id");

-- Backfill from the requester's position, but only where that is unambiguous.
-- A requester holding positions in several units gives no defensible answer, so
-- those rows are left NULL rather than guessed at. NULL reads as
-- "organization-level" everywhere the scope guards run, which keeps existing
-- access working instead of hiding history from the people who own it.
UPDATE "tbl_reservations" r
SET "unit_id" = sub.unit_id
FROM (
  SELECT a."user_id", min(p."unit_id") AS unit_id
  FROM "tbl_user_position_assignments" a
  JOIN "tbl_position" p ON p."position_id" = a."position_id"
  GROUP BY a."user_id"
  HAVING count(DISTINCT p."unit_id") = 1
) AS sub
WHERE r."user_id" = sub."user_id"
  AND r."unit_id" IS NULL;
