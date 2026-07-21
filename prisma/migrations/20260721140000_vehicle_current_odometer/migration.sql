-- Add a current odometer to each vehicle, captured at registration. It seeds
-- the first trip's starting odometer; later trips chain from the previous
-- trip's returned odometer.
--
-- Additive and non-destructive: one new column with a default, no data touched.

ALTER TABLE "tbl_vehicles"
    ADD COLUMN "current_odometer" INTEGER NOT NULL DEFAULT 0;
