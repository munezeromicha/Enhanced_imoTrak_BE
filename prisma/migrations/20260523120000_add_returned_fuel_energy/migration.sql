-- Add returned fuel/energy on vehicle return (litres for ICE, kWh for EV/hybrid)
ALTER TABLE "public"."tbl_reserved_vehicles"
ADD COLUMN IF NOT EXISTS "returned_fuel_energy" INTEGER;
