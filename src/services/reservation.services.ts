// src/services/reservation.services.ts
import { PrismaClient, RequestStatus } from '@prisma/client';
const prisma = new PrismaClient();

export async function createReservation(data: {
  reservation_purpose: string;
  start_location: string;
  reservation_destination: string;
  departure_date: string;
  expected_returning_date: string;
  user_id: string;
}) {
  const reservation = await prisma.tbl_reservations.create({
    data: {
      reservation_purpose: data.reservation_purpose,
      start_location: data.start_location,
      reservation_destination: data.reservation_destination,
      departure_date: new Date(data.departure_date),
      expected_returning_date: new Date(data.expected_returning_date),
      user_id: data.user_id,
      reservation_status: RequestStatus.UNDER_REVIEW,
    },
  });
  return reservation;
}

export async function cancelReservation(reservationId: string, reason: string, userId: string, isReviewer: boolean) {
  // Permission check: user can cancel their own, reviewer can cancel any
  const reservation = await prisma.tbl_reservations.findUnique({ where: { reservation_id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');

  // Only allow cancel if status is UNDER_REVIEW or APPROVED
  if (!([RequestStatus.UNDER_REVIEW, RequestStatus.APPROVED] as RequestStatus[]).includes(reservation.reservation_status)) {
    throw new Error('Cannot cancel reservation in current status');
  }

  // If not reviewer, must be the owner
  if (!isReviewer && reservation.user_id !== userId) {
    throw new Error('Not authorized to cancel this reservation');
  }

  return prisma.tbl_reservations.update({
    where: { reservation_id: reservationId },
    data: {
      reservation_status: RequestStatus.CANCELED,
      rejection_comment: reason,
      reviewed_at: new Date(),
    },
  });
}

export async function updateReservationStatus(reservationId: string, status: RequestStatus, reviewerId: string, reason?: string) {
  // Permission check: reviewer only (enforced in controller)
  const reservation = await prisma.tbl_reservations.findUnique({ where: { reservation_id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');

  // Only allow status update if not already COMPLETED or CANCELED
  if (([RequestStatus.COMPLETED, RequestStatus.CANCELED] as RequestStatus[]).includes(reservation.reservation_status)) {
    throw new Error('Cannot update status of a completed or canceled reservation');
  }

  // If REJECTED or CANCELED, require reason
  if ((status === RequestStatus.REJECTED || status === RequestStatus.CANCELED) && !reason) {
    throw new Error('Reason is required for rejection or cancellation');
  }

  return prisma.tbl_reservations.update({
    where: { reservation_id: reservationId },
    data: {
      reservation_status: status,
      rejection_comment: reason,
      reviewed_at: new Date(),
    },
  });
}

export async function assignVehicle(reservationId: string, vehicleId: string, reviewerId: string) {
  // Permission check: reviewer only (enforced in controller)
  // Only assign if reservation is APPROVED and vehicle is AVAILABLE
  const reservation = await prisma.tbl_reservations.findUnique({ where: { reservation_id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.reservation_status !== RequestStatus.APPROVED) {
    throw new Error('Reservation must be approved before assigning a vehicle');
  }
  const vehicle = await prisma.tbl_vehicles.findUnique({ where: { vehicle_id: vehicleId } });
  if (!vehicle) throw new Error('Vehicle not found');
  if (vehicle.vehicle_status !== 'AVAILABLE') {
    throw new Error('Vehicle is not available');
  }
  // Assign vehicle and mark as OCCUPIED
  const reservedVehicle = await prisma.tbl_reserved_vehicles.create({
    data: {
      vehicle_id: vehicleId,
      reservation_id: reservationId,
      starting_odometer: 0, // Will be set when reservation is IN_PROGRESS
      returned_odometer: null,
      fuel_provided: null,
      returned_date: new Date(0), // Placeholder, will be set on return
    },
  });
  await prisma.tbl_vehicles.update({ where: { vehicle_id: vehicleId }, data: { vehicle_status: 'OCCUPIED' } });
  return reservedVehicle;
}

export async function startReservation(reservedVehicleId: string, userId: string) {
  // Permission check: only assigned user (enforced in controller)
  // Only allow if reservation is APPROVED and date >= departure_date
  const reservedVehicle = await prisma.tbl_reserved_vehicles.findUnique({
    where: { reserved_vehicle_id: reservedVehicleId },
    include: { reservation: true },
  });
  if (!reservedVehicle) throw new Error('Reserved vehicle not found');
  const reservation = reservedVehicle.reservation;
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.reservation_status !== RequestStatus.APPROVED) {
    throw new Error('Reservation must be approved to start');
  }
  if (reservation.user_id !== userId) {
    throw new Error('Not authorized to start this reservation');
  }
  const now = new Date();
  if (now < reservation.departure_date) {
    throw new Error('Cannot start reservation before departure date');
  }
  // Only update reservation status
  await prisma.tbl_reservations.update({
    where: { reservation_id: reservation.reservation_id },
    data: { reservation_status: RequestStatus.IN_PROGRESS },
  });
  return true;
}

export async function updateOdometerFuel(reservedVehicleId: string, startingOdometer: number, fuelProvided: number, userId: string) {
  // Permission check: only assigned user (enforced in controller)
  const reservedVehicle = await prisma.tbl_reserved_vehicles.findUnique({
    where: { reserved_vehicle_id: reservedVehicleId },
    include: { reservation: true },
  });
  if (!reservedVehicle) throw new Error('Reserved vehicle not found');
  const reservation = reservedVehicle.reservation;
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.user_id !== userId) {
    throw new Error('Not authorized to update odometer/fuel for this reservation');
  }
  await prisma.tbl_reserved_vehicles.update({
    where: { reserved_vehicle_id: reservedVehicleId },
    data: {
      starting_odometer: startingOdometer,
      fuel_provided: fuelProvided,
    },
  });
  return true;
}

export async function completeReservation(reservedVehicleId: string, returnedOdometer: number, userId: string) {
  // Permission check: only assigned user (enforced in controller)
  const reservedVehicle = await prisma.tbl_reserved_vehicles.findUnique({
    where: { reserved_vehicle_id: reservedVehicleId },
    include: { reservation: true, vehicle: true },
  });
  if (!reservedVehicle) throw new Error('Reserved vehicle not found');
  const reservation = reservedVehicle.reservation;
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.user_id !== userId) {
    throw new Error('Not authorized to complete this reservation');
  }
  if (reservation.reservation_status !== RequestStatus.IN_PROGRESS) {
    throw new Error('Reservation must be IN_PROGRESS to complete');
  }
  // Update reserved vehicle, reservation status, and vehicle status
  await prisma.tbl_reserved_vehicles.update({
    where: { reserved_vehicle_id: reservedVehicleId },
    data: {
      returned_odometer: returnedOdometer,
      returned_date: new Date(),
    },
  });
  await prisma.tbl_reservations.update({
    where: { reservation_id: reservation.reservation_id },
    data: { reservation_status: RequestStatus.COMPLETED },
  });
  await prisma.tbl_vehicles.update({
    where: { vehicle_id: reservedVehicle.vehicle_id },
    data: { vehicle_status: 'AVAILABLE' },
  });
  return true;
}

export async function getAllReservations() {
  return prisma.tbl_reservations.findMany({
    include: {
      user: true,
      reserved_vehicles: true,
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function deleteReservation(reservationId: string) {
  // Optionally: check if reservation exists and its status before deleting
  return prisma.tbl_reservations.delete({
    where: { reservation_id: reservationId },
  });
} 