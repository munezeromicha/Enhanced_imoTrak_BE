// src/services/reservation.services.ts
import { PrismaClient, RequestStatus } from '@prisma/client';
import { createNotification } from './notification.service';
const prisma = new PrismaClient();

export async function createReservation(data: {
  reservation_purpose: string;
  start_location: string;
  reservation_destination: string;
  departure_date: string;
  expected_returning_date: string;
  description: string;
  passengers: number;
  user_id: string;
}) {
  const reservation = await prisma.tbl_reservations.create({
    data: {
      reservation_purpose: data.reservation_purpose,
      start_location: data.start_location,
      reservation_destination: data.reservation_destination,
      departure_date: new Date(data.departure_date),
      expected_returning_date: new Date(data.expected_returning_date),
      description: data.description,
      passengers: data.passengers,
      user_id: data.user_id,
      reservation_status: RequestStatus.UNDER_REVIEW,
    },
  });
  // Notify approvers in the same org
  const user = await prisma.tbl_users.findUnique({ where: { user_id: data.user_id }, include: { positions: { include: { unit: { include: { organization: true } } } } } });
  const orgId = user?.positions[0]?.unit.organization.organization_id;
  if (orgId) {
    // Find all users with approve/reject/cancel access in this org
    const approverPositions = await prisma.tbl_position.findMany({
      where: {
        unit: { organization_id: orgId },
        position_access: { path: ['reservations', 'update'], equals: true },
      },
      include: { user: { include: { auth: true } } },
    });
    for (const pos of approverPositions) {
      if (pos.user && pos.user.user_id !== data.user_id) { // skip requester
        await createNotification({
          user_id: pos.user.user_id,
          notification_title: 'New Reservation Request',
          notification_message: `A new reservation request has been submitted and requires your review.`,
          email: pos.user.auth?.email || undefined,
        });
      }
    }
  }
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

  const updated = await prisma.tbl_reservations.update({
    where: { reservation_id: reservationId },
    data: {
      reservation_status: RequestStatus.CANCELED,
      rejection_comment: reason,
      reviewed_at: new Date(),
    },
  });
  // Notify requester
  const requester = await prisma.tbl_users.findUnique({ where: { user_id: reservation.user_id }, include: { auth: true } });
  await createNotification({
    user_id: reservation.user_id,
    notification_title: 'Reservation Canceled',
    notification_message: `Your reservation request has been canceled. Reason: ${reason || 'N/A'}`,
    email: requester?.auth?.email || undefined,
  });
  return updated;
}

export async function updateReservationStatus(reservationId: string, status: RequestStatus, reviewerId: string, reason?: string) {
  // Permission check: reviewer only (enforced in controller)
  const reservation = await prisma.tbl_reservations.findUnique({
    where: { reservation_id: reservationId },
    include: { reserved_vehicles: true },
  });
  if (!reservation) throw new Error('Reservation not found');

  // Only allow status update if not already COMPLETED or CANCELED
  if (([RequestStatus.COMPLETED, RequestStatus.CANCELED] as RequestStatus[]).includes(reservation.reservation_status)) {
    throw new Error('Cannot update status of a completed or canceled reservation');
  }

  // If REJECTED or CANCELED, require reason
  if ((status === RequestStatus.REJECTED || status === RequestStatus.CANCELED) && !reason) {
    throw new Error('Reason is required for rejection or cancellation');
  }

  let newStatus = status;
  // Enhancement: If status is APPROVED, check if all conditions are met to auto-move to IN_PROGRESS
  if (status === RequestStatus.APPROVED) {
    const now = new Date();
    const departureMet = now >= reservation.departure_date;
    const vehiclesAssigned = reservation.reserved_vehicles.length > 0;
    const allOdometerFuelSet = reservation.reserved_vehicles.length > 0 && reservation.reserved_vehicles.every(rv => rv.starting_odometer > 0 && rv.fuel_provided !== null);
    if (departureMet && vehiclesAssigned && allOdometerFuelSet) {
      newStatus = RequestStatus.IN_PROGRESS;
    }
  }

  // Enhancement: If status is COMPLETED, check all reserved vehicles have returned_odometer
  if (status === RequestStatus.COMPLETED) {
    const reservedVehicles = await prisma.tbl_reserved_vehicles.findMany({ where: { reservation_id: reservationId } });
    const allReturned = reservedVehicles.length > 0 && reservedVehicles.every(rv => rv.returned_odometer !== null);
    if (!allReturned) {
      throw new Error('All reserved vehicles must have returned_odometer to complete reservation');
    }
  }

  const updated = await prisma.tbl_reservations.update({
    where: { reservation_id: reservationId },
    data: {
      reservation_status: newStatus,
      rejection_comment: reason,
      reviewed_at: new Date(),
    },
  });
  // Notify requester
  const requester = await prisma.tbl_users.findUnique({ where: { user_id: reservation.user_id }, include: { auth: true } });
  let title = '';
  let message = '';
  if (newStatus === RequestStatus.APPROVED) {
    title = 'Reservation Approved';
    message = 'Your reservation request has been approved.';
  } else if (newStatus === RequestStatus.IN_PROGRESS) {
    title = 'Reservation In Progress';
    message = 'Your reservation is now in progress.';
  } else if (newStatus === RequestStatus.REJECTED) {
    title = 'Reservation Rejected';
    message = `Your reservation request has been rejected. Reason: ${reason || 'N/A'}`;
  } else if (newStatus === RequestStatus.CANCELED) {
    title = 'Reservation Canceled';
    message = `Your reservation request has been canceled. Reason: ${reason || 'N/A'}`;
  } else if (newStatus === RequestStatus.COMPLETED) {
    title = 'Reservation Completed';
    message = 'Your reservation has been completed.';
  }
  if (title && requester) {
    await createNotification({
      user_id: reservation.user_id,
      notification_title: title,
      notification_message: message,
      email: requester?.auth?.email || undefined,
    });
  }
  return updated;
}

export async function updateReservationReason(reservationId: string, reason: string, userId: string) {
  // Optionally: check if user is allowed to update the reason (enforced in controller)
  const reservation = await prisma.tbl_reservations.findUnique({ where: { reservation_id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');
  // Only allow update if reservation is REJECTED or CANCELED
  if (!(reservation.reservation_status === RequestStatus.REJECTED || reservation.reservation_status === RequestStatus.CANCELED)) {
    throw new Error('Can only update reason for rejected or canceled reservations');
  }
  const updated = await prisma.tbl_reservations.update({
    where: { reservation_id: reservationId },
    data: { rejection_comment: reason },
  });
  return updated;
}

export async function assignVehicle(reservationId: string, vehicleId: string, reviewerId: string) {
  // Permission check: reviewer only (enforced in controller)
  // Only assign if reservation is APPROVED and not IN_PROGRESS
  const reservation = await prisma.tbl_reservations.findUnique({ where: { reservation_id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.reservation_status === RequestStatus.IN_PROGRESS) {
    throw new Error('Cannot assign vehicle when reservation is in progress');
  }
  if (reservation.reservation_status !== RequestStatus.APPROVED) {
    throw new Error('Reservation must be approved before assigning a vehicle');
  }
  const vehicle = await prisma.tbl_vehicles.findUnique({ where: { vehicle_id: vehicleId } });
  if (!vehicle) throw new Error('Vehicle not found');
  if (vehicle.vehicle_status !== 'AVAILABLE') {
    throw new Error('Vehicle is not available');
  }
  // Assign vehicle and mark as OCCUPIED
  await prisma.tbl_reserved_vehicles.create({
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
  // Return all reserved vehicles for this reservation
  const reservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
  });
  return reservedVehicles;
}

export async function assignVehicleWithOdometerFuel(reservationId: string, vehicleId: string, reviewerId: string, startingOdometer: number = 0, fuelProvided: number = 0) {
  // Permission check: reviewer only (enforced in controller)
  // Only assign if reservation is APPROVED and not IN_PROGRESS
  const reservation = await prisma.tbl_reservations.findUnique({ where: { reservation_id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.reservation_status === RequestStatus.IN_PROGRESS) {
    throw new Error('Cannot assign vehicle when reservation is in progress');
  }
  if (reservation.reservation_status !== RequestStatus.APPROVED) {
    throw new Error('Reservation must be approved before assigning a vehicle');
  }
  const vehicle = await prisma.tbl_vehicles.findUnique({ where: { vehicle_id: vehicleId } });
  if (!vehicle) throw new Error('Vehicle not found');
  if (vehicle.vehicle_status !== 'AVAILABLE') {
    throw new Error('Vehicle is not available');
  }
  // Assign vehicle and set odometer/fuel, mark as OCCUPIED
  await prisma.tbl_reserved_vehicles.create({
    data: {
      vehicle_id: vehicleId,
      reservation_id: reservationId,
      starting_odometer: startingOdometer,
      fuel_provided: fuelProvided,
      returned_odometer: null,
      returned_date: new Date(0), // Placeholder, will be set on return
    },
  });
  await prisma.tbl_vehicles.update({ where: { vehicle_id: vehicleId }, data: { vehicle_status: 'OCCUPIED' } });
  // Return all reserved vehicles for this reservation
  const reservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
  });
  return reservedVehicles;
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
  // Update reserved vehicle and vehicle status
  await prisma.tbl_reserved_vehicles.update({
    where: { reserved_vehicle_id: reservedVehicleId },
    data: {
      returned_odometer: returnedOdometer,
      returned_date: new Date(),
    },
  });
  await prisma.tbl_vehicles.update({
    where: { vehicle_id: reservedVehicle.vehicle_id },
    data: { vehicle_status: 'AVAILABLE' },
  });
  // Check if all reserved vehicles have returned_odometer set
  const allReserved = await prisma.tbl_reserved_vehicles.findMany({ where: { reservation_id: reservation.reservation_id } });
  const allReturned = allReserved.length > 0 && allReserved.every(rv => rv.returned_odometer !== null);
  if (allReturned) {
    await prisma.tbl_reservations.update({
      where: { reservation_id: reservation.reservation_id },
      data: { reservation_status: RequestStatus.COMPLETED },
    });
  }
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

export async function getReservationsByUserId(userId: string) {
  return prisma.tbl_reservations.findMany({
    where: { user_id: userId },
    include: {
      user: true,
      reserved_vehicles: true,
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function getReservationById(reservationId: string) {
  return prisma.tbl_reservations.findUnique({
    where: { reservation_id: reservationId },
    include: {
      user: true,
      reserved_vehicles: {
        include: {
          vehicle: true,
        },
      },
    },
  });
} 