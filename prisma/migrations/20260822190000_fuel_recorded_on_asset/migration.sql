-- Mark a completed requisition as posted to its vehicle or generator.
--
-- Once every signature is on the form the fuel belongs to the asset's own
-- history, so it is recorded there automatically rather than being keyed in a
-- second time against the vehicle.
--
-- ADDITIVE ONLY: one nullable column, no data touched.
ALTER TABLE "tbl_fuel_requisitions" ADD COLUMN "recorded_on_asset_at" TIMESTAMP(3);
