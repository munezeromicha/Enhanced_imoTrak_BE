import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/Error';
import {
  getLatestLocation,
  getVehicleLocationHistory,
  getVehicleTrackingContext,
  parseStoredCoords,
} from './vehicle.services';
import { reverseGeocode, searchLocations } from '../utils/geocoding';
import type { AuthenticatedUser } from '../types/access';
import { canViewOrgUnitCount, isSuperAdmin as isHubSuperAdmin, resolveUnitScopeForUser } from '../utils/orgLeader';

const prisma = new PrismaClient();

function isSuperAdmin(user: AuthenticatedUser): boolean {
  return isHubSuperAdmin(user);
}

async function resolveUnitScope(user: AuthenticatedUser): Promise<string | null> {
  return resolveUnitScopeForUser(user);
}

function canAccessTracking(user: AuthenticatedUser): boolean {
  if (isSuperAdmin(user)) return true;
  if (user.position_access?.vehicles?.view) return true;
  if (user.position_access?.organizations?.update) return true;
  if (user.position_access?.units?.view && user.position_access?.users?.view) return true;
  return false;
}

export function assertTrackingAccess(user: AuthenticatedUser): void {
  if (!canAccessTracking(user)) {
    throw new AppError('You do not have permission to access fleet tracking', 403);
  }
}

/**
 * Only a genuine hub super-admin sees vehicles across every organization.
 *
 * NOTE: the shared `isSuperAdmin` (organizations.view) is too weak here — an
 * org leader / fleet manager also has organizations.view for their own org, so
 * using it let them see every organization's vehicles on the tracking map. A
 * hub admin is identified by the stronger `organizations.create && users.delete`
 * grant (same test the app uses to gate permanent user deletion).
 */
function isGlobalFleetAdmin(user: AuthenticatedUser): boolean {
  return !!(
    user.position_access?.organizations?.create &&
    user.position_access?.users?.delete
  );
}

async function resolveOrganizationScope(user: AuthenticatedUser): Promise<string | null> {
  if (isGlobalFleetAdmin(user)) return null;
  return user.organization_id ?? null;
}

export async function getFleetOverview(user: AuthenticatedUser) {
  assertTrackingAccess(user);
  const isGlobal = isGlobalFleetAdmin(user);
  const orgScope = await resolveOrganizationScope(user);
  const unitScope = await resolveUnitScope(user);

  // Fail closed: a non-admin without an organization must see nothing, never
  // everything. Without this an empty orgScope would drop the org filter.
  if (!isGlobal && !orgScope) {
    return {
      scope: 'organization' as const,
      organization_id: null,
      summary: { total: 0, online: 0, offline: 0, moving: 0, stopped: 0, idle: 0 },
      vehicles: [],
    };
  }

  const vehicles = await prisma.tbl_vehicles.findMany({
    where: {
      ...(orgScope ? { organization_id: orgScope } : {}),
      ...(unitScope ? { unit_id: unitScope } : {}),
    },
    include: {
      organization: { select: { organization_id: true, organization_name: true } },
      unit: { select: { unit_id: true, unit_name: true } },
      vehicle_model: { select: { vehicle_model_name: true, manufacturer_name: true, vehicle_type: true } },
      gps_device: { select: { imei: true, device_model: true } },
    },
    orderBy: { plate_number: 'asc' },
  });

  const fleet = await Promise.all(
    vehicles.map(async (vehicle) => {
      const ctx = await getVehicleTrackingContext(vehicle.vehicle_id);
      const latest = ctx?.latest_location ?? null;
      const coords = latest?.coords ?? null;
      const speedMs = coords?.speed ?? 0;
      const speedKmh = Math.round(Math.max(0, (speedMs ?? 0) * 3.6));
      const lastTs = latest?.timestamp ? new Date(latest.timestamp as string) : null;
      const secondsAgo = lastTs
        ? Math.max(0, Math.floor((Date.now() - lastTs.getTime()) / 1000))
        : null;

      const activeDriver = ctx?.active_trip?.drivers?.[0];

      return {
        vehicle_id: vehicle.vehicle_id,
        plate_number: vehicle.plate_number,
        vehicle_status: vehicle.vehicle_status,
        energy_type: vehicle.energy_type,
        vehicle_photo: vehicle.vehicle_photo,
        organization: vehicle.organization,
        unit: vehicle.unit,
        vehicle_model: vehicle.vehicle_model,
        gps_device: vehicle.gps_device,
        driver_name: activeDriver?.name ?? null,
        driver_phone: activeDriver?.phone ?? null,
        is_online: secondsAgo != null && secondsAgo < 300,
        seconds_since_update: secondsAgo,
        last_update: lastTs?.toISOString() ?? null,
        latest_location: latest,
        active_trip: ctx?.active_trip ?? null,
        speed_kmh: speedKmh,
        movement_status: speedKmh > 2 ? 'moving' : speedKmh > 0 ? 'idle' : 'stopped',
      };
    })
  );

  const online = fleet.filter((v) => v.is_online).length;
  const moving = fleet.filter((v) => v.movement_status === 'moving').length;
  const stopped = fleet.filter((v) => v.movement_status === 'stopped').length;

  return {
    scope: orgScope ? 'organization' : 'global',
    organization_id: orgScope,
    summary: {
      total: fleet.length,
      online,
      offline: fleet.length - online,
      moving,
      stopped,
      idle: fleet.length - moving - stopped,
    },
    vehicles: fleet,
  };
}

export async function getVehicleTrackingDetail(
  user: AuthenticatedUser,
  vehicleId: string,
  includeGeocode = true
) {
  assertTrackingAccess(user);
  const orgScope = await resolveOrganizationScope(user);

  const vehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: vehicleId },
    include: {
      organization: true,
      vehicle_model: true,
    },
  });

  if (!vehicle) throw new AppError('Vehicle not found', 404);
  if (orgScope && vehicle.organization_id !== orgScope) {
    throw new AppError('You do not have access to this vehicle', 403);
  }

  const ctx = await getVehicleTrackingContext(vehicleId);
  const latest = ctx?.latest_location ?? null;
  const coords = latest?.coords;

  let geocode: Awaited<ReturnType<typeof reverseGeocode>> | null = null;
  if (includeGeocode && coords?.latitude != null && coords?.longitude != null) {
    try {
      geocode = await reverseGeocode(coords.latitude, coords.longitude);
    } catch {
      geocode = null;
    }
  }

  const speedMs = coords?.speed ?? 0;
  const speedKmh = Math.round(Math.max(0, (speedMs ?? 0) * 3.6));
  const lastTs = latest?.timestamp ? new Date(latest.timestamp as string) : null;

  return {
    vehicle,
    tracking: ctx,
    geocode,
    telemetry: {
      speed_kmh: speedKmh,
      altitude_m: coords?.altitude ?? null,
      heading: coords?.heading ?? null,
      accuracy_m: coords?.accuracy ?? null,
      last_update: lastTs?.toISOString() ?? null,
      seconds_since_update: lastTs
        ? Math.max(0, Math.floor((Date.now() - lastTs.getTime()) / 1000))
        : null,
      road_name: geocode?.road ?? null,
      address: geocode?.address ?? null,
    },
  };
}

export async function getVehicleTrackHistory(
  user: AuthenticatedUser,
  vehicleId: string,
  from?: string,
  to?: string
) {
  assertTrackingAccess(user);
  const orgScope = await resolveOrganizationScope(user);

  const vehicle = await prisma.tbl_vehicles.findUnique({
    where: { vehicle_id: vehicleId },
    select: { vehicle_id: true, organization_id: true, plate_number: true },
  });
  if (!vehicle) throw new AppError('Vehicle not found', 404);
  if (orgScope && vehicle.organization_id !== orgScope) {
    throw new AppError('You do not have access to this vehicle', 403);
  }

  const rows = await getVehicleLocationHistory(vehicleId);
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  const points = rows
    .map((row) => {
      const coords = parseStoredCoords(row.coords);
      if (!coords) return null;
      const ts = row.timestamp;
      if (fromDate && ts < fromDate) return null;
      if (toDate && ts > toDate) return null;
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
        heading: coords.heading,
        altitude: coords.altitude,
        timestamp: ts.toISOString(),
      };
    })
    .filter(Boolean);

  let distanceKm = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const R = 6371;
    const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
    const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
    const lat1 = (a.latitude * Math.PI) / 180;
    const lat2 = (b.latitude * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    distanceKm += R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  return {
    vehicle_id: vehicleId,
    plate_number: vehicle.plate_number,
    point_count: points.length,
    distance_km: Math.round(distanceKm * 100) / 100,
    points,
  };
}

export async function getTrackingDashboardStats(user: AuthenticatedUser) {
  const fleet = await getFleetOverview(user);
  const showTotalUnits = await canViewOrgUnitCount(user);

  let totalOrgUnits: number | null = null;
  if (showTotalUnits && fleet.organization_id) {
    totalOrgUnits = await prisma.tbl_unit.count({
      where: { organization_id: fleet.organization_id, status: 'ACTIVE' },
    });
  } else if (showTotalUnits && !fleet.organization_id) {
    totalOrgUnits = await prisma.tbl_unit.count({ where: { status: 'ACTIVE' } });
  }

  const mileageByVehicle = await Promise.all(
    fleet.vehicles.slice(0, 20).map(async (v) => {
      const history = await getVehicleLocationHistory(v.vehicle_id);
      const from = new Date();
      from.setDate(from.getDate() - 7);
      const recent = history.filter((h) => h.timestamp >= from);
      let km = 0;
      for (let i = 1; i < recent.length; i++) {
        const c1 = parseStoredCoords(recent[i - 1].coords);
        const c2 = parseStoredCoords(recent[i].coords);
        if (!c1 || !c2) continue;
        const R = 6371;
        const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
        const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
        const lat1 = (c1.latitude * Math.PI) / 180;
        const lat2 = (c2.latitude * Math.PI) / 180;
        const h =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        km += R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
      }
      return {
        vehicle_id: v.vehicle_id,
        label: v.driver_name ? `${v.plate_number} / ${v.driver_name}` : v.plate_number,
        mileage_km: Math.round(km * 100) / 100,
      };
    })
  );

  return {
    summary: {
      ...fleet.summary,
      total_vehicles: fleet.summary.total,
      total_org_units: totalOrgUnits,
      can_view_total_units: showTotalUnits,
    },
    scope: fleet.scope,
    health: {
      healthy: fleet.summary.online,
      need_attention: 0,
      unhealthy: fleet.summary.offline,
    },
    connection: {
      online: fleet.summary.online,
      offline: fleet.summary.offline,
    },
    motion: {
      moving: fleet.summary.moving,
      stopped: fleet.summary.stopped,
      idle: fleet.summary.idle,
    },
    top_mileage: mileageByVehicle.sort((a, b) => b.mileage_km - a.mileage_km).slice(0, 10),
  };
}

export async function searchGeocodeForUser(
  _user: AuthenticatedUser,
  query: string,
  countryCodes?: string
) {
  return searchLocations(query, { countryCodes: countryCodes || 'rw' });
}

export async function reverseGeocodeForUser(
  user: AuthenticatedUser,
  latitude: number,
  longitude: number
) {
  assertTrackingAccess(user);
  return reverseGeocode(latitude, longitude);
}
