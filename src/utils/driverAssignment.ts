import { Prisma, PrismaClient } from '@prisma/client';
import { AppError } from './Error';

type PrismaLike = PrismaClient | Prisma.TransactionClient;

/** Reject the same driver_id appearing on more than one vehicle in one API payload. */
export function assertNoDuplicateDriversInPayload(
  vehiclesData: Array<{ driver_id?: string | null; vehicle_id?: string }>
) {
  const seen = new Set<string>();
  for (const entry of vehiclesData) {
    const driverId = entry.driver_id?.trim();
    if (!driverId) continue;
    if (seen.has(driverId)) {
      throw new AppError(
        'The same driver cannot be assigned to more than one vehicle on this reservation.',
        400
      );
    }
    seen.add(driverId);
  }
}

/**
 * A driver may only have one active vehicle assignment per reservation.
 */
export async function assertDriverNotOnAnotherVehicleInReservation(
  db: PrismaLike,
  reservationId: string,
  driverId: string,
  options?: { excludeReservedVehicleId?: string }
) {
  const conflict = await db.tbl_reserved_vehicle_drivers.findFirst({
    where: {
      driver_id: driverId,
      is_active: true,
      reserved_vehicle: {
        reservation_id: reservationId,
        ...(options?.excludeReservedVehicleId
          ? { reserved_vehicle_id: { not: options.excludeReservedVehicleId } }
          : {}),
      },
    },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: { select: { plate_number: true } },
        },
      },
    },
  });

  if (conflict) {
    const plate =
      conflict.reserved_vehicle?.vehicle?.plate_number ?? 'another vehicle';
    throw new AppError(
      `This driver is already assigned to vehicle ${plate} on this reservation. One driver cannot be assigned to multiple vehicles on the same reservation.`,
      400
    );
  }
}
