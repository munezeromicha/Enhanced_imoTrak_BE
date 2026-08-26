-- Backfill the `fuel` module onto positions that predate it.
--
-- Permissions are granted through `clampPositionAccess`, which enforces "you
-- may only hand out what you hold" by reading the granting position's own
-- `position_access`. A module that is absent from that JSON reads as an empty
-- object, so every flag under it clamps to false.
--
-- Positions saved before the fuel module existed have no `fuel` key at all.
-- The effect was that an administrator could tick the Fuel boxes on a position,
-- save without error, and have every one of them silently dropped on the way to
-- the database — the module could never be delegated to anyone.
--
-- Writing the key explicitly fixes that and makes the stored shape match what
-- `buildLeaderPositionAccess` already gives the leader of a newly created
-- organization.

-- 1. Organization leaders and hub SuperAdmins hold the whole module, matching
--    the access a leader position is created with today.
UPDATE "tbl_position"
SET "position_access" = jsonb_set(
  "position_access",
  '{fuel}',
  '{
    "request": true,
    "view": true,
    "viewOwn": true,
    "recommend": true,
    "confirmFunding": true,
    "issue": true,
    "receive": true,
    "replenish": true,
    "viewReport": true,
    "manageGenerators": true
  }'::jsonb,
  true
)
WHERE jsonb_typeof("position_access") = 'object'
  AND NOT ("position_access" ? 'fuel')
  AND (
    "is_org_leader" = true
    OR COALESCE(("position_access" -> 'organizations' ->> 'create')::boolean, false)
    OR lower(btrim("position_name")) = 'superadmin'
  );

-- 2. Every other position gets the module present and fully closed. Nobody
--    gains access here — the point is that "not granted" is now stored as an
--    explicit false rather than a missing key, so the permission editor and the
--    clamp both read the same thing.
UPDATE "tbl_position"
SET "position_access" = jsonb_set(
  "position_access",
  '{fuel}',
  '{
    "request": false,
    "view": false,
    "viewOwn": false,
    "recommend": false,
    "confirmFunding": false,
    "issue": false,
    "receive": false,
    "replenish": false,
    "viewReport": false,
    "manageGenerators": false
  }'::jsonb,
  true
)
WHERE jsonb_typeof("position_access") = 'object'
  AND NOT ("position_access" ? 'fuel');
