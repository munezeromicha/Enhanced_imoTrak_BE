// src/services/reservation.services.ts
import { PrismaClient, RequestStatus } from '@prisma/client';
import { createNotification } from './notification.service';
import {
  assertDriverNotOnAnotherVehicleInReservation,
  assertNoDuplicateDriversInPayload,
} from '../utils/driverAssignment';
import { AppError } from '../utils/Error';
const prisma = new PrismaClient();

// Helper function to check for date conflicts between reservations
async function checkVehicleDateConflicts(vehicleId: string, departureDate: Date, expectedReturnDate: Date, excludeReservationId?: string) {
  const conflictingReservations = await prisma.tbl_reserved_vehicles.findMany({
    where: {
      vehicle_id: vehicleId,
      reservation: {
        reservation_status: {
          in: [RequestStatus.ACCEPTED, RequestStatus.APPROVED, RequestStatus.IN_PROGRESS]
        },
        ...(excludeReservationId && { reservation_id: { not: excludeReservationId } })
      }
    },
    include: {
      reservation: true
    }
  });

  // Check for date overlaps
  for (const reservedVehicle of conflictingReservations) {
    const reservation = reservedVehicle.reservation;
    const reservationDeparture = new Date(reservation.departure_date);
    const reservationReturn = new Date(reservation.expected_returning_date);
    
    // Check if dates overlap
    if (
      (departureDate < reservationReturn && expectedReturnDate > reservationDeparture) ||
      (reservationDeparture < expectedReturnDate && reservationReturn > departureDate)
    ) {
      return {
        hasConflict: true,
        conflictingReservation: reservation
      };
    }
  }
  
  return { hasConflict: false };
}

// Helper function to check if vehicle is available for a specific date range
export async function isVehicleAvailableForDateRange(vehicleId: string, departureDate: Date, expectedReturnDate: Date, excludeReservationId?: string) {
  const vehicle = await prisma.tbl_vehicles.findUnique({ where: { vehicle_id: vehicleId } });
  if (!vehicle) return { available: false, reason: 'Vehicle not found' };
  
  // Check if vehicle is in maintenance or out of service
  if (vehicle.vehicle_status === 'MAINTENANCE' || vehicle.vehicle_status === 'OUT_OF_SERVICE') {
    return { available: false, reason: `Vehicle is ${vehicle.vehicle_status.toLowerCase()}` };
  }
  
  // Check for date conflicts
  const conflictCheck = await checkVehicleDateConflicts(vehicleId, departureDate, expectedReturnDate, excludeReservationId);
  if (conflictCheck.hasConflict) {
    return { 
      available: false, 
      reason: `Vehicle has conflicting reservation from ${conflictCheck.conflictingReservation?.departure_date} to ${conflictCheck.conflictingReservation?.expected_returning_date}` 
    };
  }
  
  return { available: true };
}

// Function to get available vehicles for a specific date range and organization
export async function getAvailableVehiclesForDateRange(departureDate: string, expectedReturnDate: string, organizationId: string) {
  const departure = new Date(departureDate);
  const returnDate = new Date(expectedReturnDate);
  
  // Validate date range
  if (departure >= returnDate) {
    throw new Error('Departure date must be before return date');
  }
  
  if (departure < new Date()) {
    throw new Error('Departure date cannot be in the past');
  }
  
  // Get all vehicles in the organization
  const allVehicles = await prisma.tbl_vehicles.findMany({
    where: { 
      organization_id: organizationId,
      vehicle_status: { not: 'OUT_OF_SERVICE' } // Exclude out of service vehicles
    },
    include: {
      vehicle_model: true,
      reservations: {
        where: {
          reservation: {
            reservation_status: {
              in: [RequestStatus.ACCEPTED, RequestStatus.APPROVED, RequestStatus.IN_PROGRESS]
            }
          }
        },
        include: {
          reservation: true
        }
      }
    }
  });

  const availableVehicles = allVehicles.filter(vehicle => {
    // Check if vehicle has any conflicting reservations
    const hasConflict = vehicle.reservations.some(reservedVehicle => {
      const reservation = reservedVehicle.reservation;
      const reservationDeparture = new Date(reservation.departure_date);
      const reservationReturn = new Date(reservation.expected_returning_date);
      
      // Check for date overlap
      return (
        (departure < reservationReturn && returnDate > reservationDeparture) ||
        (reservationDeparture < returnDate && reservationReturn > departure)
      );
    });

    // Vehicle is available if it's not in maintenance and has no conflicts
    return !hasConflict && vehicle.vehicle_status !== 'MAINTENANCE';
  });

  return availableVehicles.map(vehicle => ({
    vehicle_id: vehicle.vehicle_id,
    plate_number: vehicle.plate_number,
    vehicle_model: {
      vehicle_model_id: vehicle.vehicle_model.vehicle_model_id,
      vehicle_model_name: vehicle.vehicle_model.vehicle_model_name,
      vehicle_type: vehicle.vehicle_model.vehicle_type,
      vehicle_capacity: vehicle.vehicle_model.vehicle_capacity,
      manufacturer_name: vehicle.vehicle_model.manufacturer_name,
    },
    vehicle_status: vehicle.vehicle_status,
    energy_type: vehicle.energy_type,
    vehicle_year: vehicle.vehicle_year,
    transmission_mode: vehicle.transmission_mode,
    last_service_date: vehicle.last_service_date,
  }));
}

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
  const user = await prisma.tbl_users.findUnique({
    where: { user_id: data.user_id },
    include: {
      position_assignments: {
        include: {
          position: {
            include: { unit: { include: { organization: true } } },
          },
        },
      },
    },
  });
  const orgId =
    user?.position_assignments[0]?.position.unit.organization.organization_id;
  if (orgId) {
    const approverAssignments = await prisma.tbl_user_position_assignments.findMany({
      where: {
        position: {
          unit: { organization_id: orgId },
          position_access: { path: ['reservations', 'update'], equals: true },
        },
      },
      include: { user: { include: { auth: true } } },
    });
    const notified = new Set<string>();
    for (const assignment of approverAssignments) {
      if (
        assignment.user.user_id !== data.user_id &&
        !notified.has(assignment.user.user_id)
      ) {
        notified.add(assignment.user.user_id);
        await createNotification({
          user_id: assignment.user.user_id,
          notification_title: 'New Reservation Request',
          notification_message: `A new reservation request has been submitted and requires your review.`,
          email: assignment.user.auth?.email || undefined,
        });
      }
    }
  }
  return reservation;
}

export async function cancelReservation(reservationId: string, reason: string, userId: string, isReviewer: boolean) {
  // Permission check: user can cancel their own, reviewer can cancel any
  const reservation = await prisma.tbl_reservations.findUnique({ 
    where: { reservation_id: reservationId },
    include: { reserved_vehicles: true }
  });
  if (!reservation) throw new Error('Reservation not found');

  // Only allow cancel if status is UNDER_REVIEW or APPROVED
  if (!([RequestStatus.UNDER_REVIEW, RequestStatus.APPROVED] as RequestStatus[]).includes(reservation.reservation_status)) {
    throw new Error('Journey has already started, Can not cancel this reservation');
  }

  // If not reviewer, must be the owner
  if (!isReviewer && reservation.user_id !== userId) {
    throw new Error('Not authorized to cancel this reservation');
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Update reservation status with cancellation tracking
    const updatedReservation = await tx.tbl_reservations.update({
      where: { reservation_id: reservationId },
      data: {
        reservation_status: RequestStatus.CANCELED,
        rejection_comment: reason,
        canceled_at: new Date(),
        canceled_by: userId, // Track who canceled the reservation
      },
    });

    // Handle vehicle status if reservation had assigned vehicles
    if (reservation.reserved_vehicles && reservation.reserved_vehicles.length > 0) {
      for (const reservedVehicle of reservation.reserved_vehicles) {
        // Check if this vehicle is being used by any other active reservations
        const otherActiveReservations = await tx.tbl_reserved_vehicles.findMany({
          where: {
            vehicle_id: reservedVehicle.vehicle_id,
            reservation: {
              reservation_status: {
                in: [RequestStatus.ACCEPTED, RequestStatus.APPROVED, RequestStatus.IN_PROGRESS]
              },
              reservation_id: { not: reservationId }
            }
          }
        });

        // Only mark vehicle as AVAILABLE if it's not being used by other active reservations
        if (otherActiveReservations.length === 0) {
          await tx.tbl_vehicles.update({
            where: { vehicle_id: reservedVehicle.vehicle_id },
            data: { vehicle_status: 'AVAILABLE' },
          });
        }
      }
    }

    return updatedReservation;
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
  let updateData: any = {
    reservation_status: newStatus,
    rejection_comment: reason,
  };
  
  // Track who performed the action and when
  if (status === RequestStatus.ACCEPTED || status === RequestStatus.REJECTED) {
    updateData.reviewed_by = reviewerId;
    updateData.reviewed_at = new Date();
  } else if (status === RequestStatus.APPROVED) {
    updateData.approved_by = reviewerId;
    updateData.approved_at = new Date();
  } else if (status === RequestStatus.COMPLETED) {
    updateData.completed_by = reviewerId;
    updateData.completed_at = new Date();
  }
  
  // Enhancement: If status is APPROVED, set to ACCEPTED instead
  // if (status === RequestStatus.APPROVED) {
  //   newStatus = RequestStatus.ACCEPTED;
  // }
  
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
    data: updateData,
  });
  
  // Notify requester
  const requester = await prisma.tbl_users.findUnique({ where: { user_id: reservation.user_id }, include: { auth: true } });
  let title = '';
  let message = '';
  if (newStatus === RequestStatus.ACCEPTED) {
    title = 'Reservation Accepted';
    message = 'Your reservation request has been accepted. Vehicles can now be assigned.';
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
    title = 'Returned Successfully!';
    message = 'Your vehicle has been returned successfully.';
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

export async function assignVehicle(reservationId: string, vehicleId: string, reviewerId: string, organizationId: string) {
  // Permission check: reviewer only (enforced in controller)
  // Only assign if reservation is ACCEPTED and not IN_PROGRESS
  const reservation = await prisma.tbl_reservations.findUnique({ 
    where: { 
      reservation_id: reservationId,
      user: {
        position_assignments: {
          some: {
            position: {
              unit: {
                organization_id: organizationId,
              },
            },
          },
        },
      },
    }
  });
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.reservation_status === RequestStatus.IN_PROGRESS) {
    throw new Error('Cannot assign vehicle when reservation is in progress');
  }
  if (reservation.reservation_status !== RequestStatus.ACCEPTED) {
    throw new Error('Reservation must be accepted before assigning a vehicle');
  }
  
  const vehicle = await prisma.tbl_vehicles.findUnique({ 
    where: { 
      vehicle_id: vehicleId,
      organization_id: organizationId
    } 
  });
  if (!vehicle) throw new Error('Vehicle not found');
  
  // Check if vehicle is available for the specific date range
  const availabilityCheck = await isVehicleAvailableForDateRange(
    vehicleId, 
    reservation.departure_date, 
    reservation.expected_returning_date,
    reservationId
  );
  
  if (!availabilityCheck.available) {
    throw new Error(`Vehicle is not available: ${availabilityCheck.reason}`);
  }
  
  // Assign vehicle (no need to mark as OCCUPIED since we're using date-based availability)
  await prisma.$transaction(async (tx) => {
    await tx.tbl_reserved_vehicles.create({
      data: {
        vehicle_id: vehicleId,
        reservation_id: reservationId,
        starting_odometer: 0, // Will be set when reservation is IN_PROGRESS
        returned_odometer: null,
        fuel_provided: null,
      },
    });
    
    // Update reservation status to APPROVED after vehicle assignment
    await tx.tbl_reservations.update({
      where: { reservation_id: reservationId },
      data: { reservation_status: RequestStatus.APPROVED },
    });
  });
  
  // Return all reserved vehicles for this reservation
  const reservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
  });
  return reservedVehicles;
}

export async function assignMultipleVehicles(reservationId: string, vehicleIds: string[], reviewerId: string, organizationId: string) {
  // Permission check: reviewer only (enforced in controller)
  // Only assign if reservation is ACCEPTED and not IN_PROGRESS
  const reservation = await prisma.tbl_reservations.findUnique({ 
    where: { 
      reservation_id: reservationId,
      user: {
        position_assignments: {
          some: {
            position: {
              unit: {
                organization_id: organizationId,
              },
            },
          },
        },
      },
    }
  });
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.reservation_status !== RequestStatus.UNDER_REVIEW) {
    throw new Error('Reservation must be In_review before assigning vehicles');
  }

  // Check if all vehicles exist and are available for the date range
  const vehicles = await prisma.tbl_vehicles.findMany({
    where: { 
      vehicle_id: { in: vehicleIds },
      organization_id: organizationId
    },
  });

  if (vehicles.length !== vehicleIds.length) {
    throw new Error('One or more vehicles not found');
  }

  // Check availability for each vehicle
  const unavailableVehicles = [];
  for (const vehicleId of vehicleIds) {
    const availabilityCheck = await isVehicleAvailableForDateRange(
      vehicleId,
      reservation.departure_date,
      reservation.expected_returning_date,
      reservationId
    );
    
    if (!availabilityCheck.available) {
      unavailableVehicles.push({ vehicleId, reason: availabilityCheck.reason });
    }
  }

  if (unavailableVehicles.length > 0) {
    const unavailableReasons = unavailableVehicles.map(v => `${v.vehicleId}: ${v.reason}`).join(', ');
    throw new Error(`Vehicles not available: ${unavailableReasons}`);
  }

  // Assign all vehicles in a transaction and update reservation status to ACCEPTED
  const reservedVehicles = await prisma.$transaction(async (tx) => {
    const createdReservedVehicles = [];
    
    for (const vehicleId of vehicleIds) {
      const reservedVehicle = await tx.tbl_reserved_vehicles.create({
        data: {
          vehicle_id: vehicleId,
          reservation_id: reservationId,
          starting_odometer: 0, // Will be set when reservation is IN_PROGRESS
          returned_odometer: null,
          fuel_provided: null,
        },
      });
      createdReservedVehicles.push(reservedVehicle);
    }
    
    // Update reservation status to ACCEPTED after vehicle assignment
    await tx.tbl_reservations.update({
      where: { reservation_id: reservationId },
      data: { 
        reservation_status: RequestStatus.ACCEPTED,
        reviewed_by: reviewerId, // Track who reviewed/accepted the reservation
        reviewed_at: new Date(), // Track when it was reviewed/accepted
      },
    });
    
    return createdReservedVehicles;
  });

  // Return all reserved vehicles for this reservation
  const allReservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
    include: {
      vehicle: true,
    },
  });
  
  return allReservedVehicles;
}

export async function assignMultipleVehiclesWithOdometerFuel(reservationId: string, vehiclesData: Array<{vehicle_id: string, starting_odometer: number, fuel_provided: number, driver_id?: string | null}>, reviewerId: string, organizationId: string) {
  // Permission check: reviewer only (enforced in controller)
  const reservation = await prisma.tbl_reservations.findUnique({ 
    where: { 
      reservation_id: reservationId,
      user: {
        position_assignments: {
          some: {
            position: {
              unit: {
                organization_id: organizationId,
              },
            },
          },
        },
      },
    }
  });
  if (!reservation) throw new Error('Reservation not found');

  assertNoDuplicateDriversInPayload(vehiclesData);

  if (reservation.reservation_status === RequestStatus.IN_PROGRESS) {
    throw new Error('Cannot assign vehicles when reservation is in progress');
  }
  if (reservation.reservation_status !== RequestStatus.ACCEPTED) {
    throw new Error('Reservation must be accepted before assigning vehicles');
  }

  const vehicleIds = vehiclesData.map(v => v.vehicle_id);

  // Check if all vehicles exist and are available for the date range
  const vehicles = await prisma.tbl_vehicles.findMany({
    where: { 
      vehicle_id: { in: vehicleIds },
      organization_id: organizationId
    },
  });

  if (vehicles.length !== vehicleIds.length) {
    throw new Error('One or more vehicles not found');
  }

  // Check availability for each vehicle
  const unavailableVehicles = [];
  for (const vehicleId of vehicleIds) {
    const availabilityCheck = await isVehicleAvailableForDateRange(
      vehicleId,
      reservation.departure_date,
      reservation.expected_returning_date,
      reservationId
    );
    
    if (!availabilityCheck.available) {
      unavailableVehicles.push({ vehicleId, reason: availabilityCheck.reason });
    }
  }

  if (unavailableVehicles.length > 0) {
    const unavailableReasons = unavailableVehicles.map(v => `${v.vehicleId}: ${v.reason}`).join(', ');
    throw new Error(`Vehicles not available: ${unavailableReasons}`);
  }

  // Assign all vehicles with odometer/fuel in a transaction and update reservation status to APPROVED
  const reservedVehicles = await prisma.$transaction(async (tx) => {
    const createdReservedVehicles = [];
    
    for (const vehicleData of vehiclesData) {
      const reservedVehicle = await tx.tbl_reserved_vehicles.create({
        data: {
          vehicle_id: vehicleData.vehicle_id,
          reservation_id: reservationId,
          starting_odometer: vehicleData.starting_odometer,
          fuel_provided: vehicleData.fuel_provided,
          returned_odometer: null,
        },
      });
      createdReservedVehicles.push(reservedVehicle);

      if (vehicleData.driver_id) {
        await assertDriverNotOnAnotherVehicleInReservation(
          tx,
          reservationId,
          vehicleData.driver_id
        );
        await tx.tbl_reserved_vehicle_drivers.create({
          data: {
            reserved_vehicle_id: reservedVehicle.reserved_vehicle_id,
            driver_id: vehicleData.driver_id,
            is_active: true,
          },
        });

        // Set driver status to ON_TRIP
        await tx.tbl_drivers.update({
          where: { driver_id: vehicleData.driver_id },
          data: { driver_status: 'ON_TRIP' },
        });
      }
    }
    
    // Update reservation status to APPROVED after vehicle assignment
    await tx.tbl_reservations.update({
      where: { reservation_id: reservationId },
      data: { 
        reservation_status: RequestStatus.APPROVED,
        approved_by: reviewerId, // Track who approved the reservation
        approved_at: new Date(), // Track when it was approved
      },
    });
    
    return createdReservedVehicles;
  });

  // Return all reserved vehicles for this reservation with vehicle details
  const allReservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
    include: {
      vehicle: true,
      drivers: {
        include: {
          driver: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  
  return allReservedVehicles;
}

export async function updateMultipleVehiclesWithOdometerFuel(reservationId: string, vehiclesData: Array<{vehicle_id: string, starting_odometer: number, fuel_provided: number, driver_id?: string | null}>, reviewerId: string, organizationId: string) {
  // Permission check: reviewer only (enforced in controller)
  const reservation = await prisma.tbl_reservations.findUnique({ 
    where: { 
      reservation_id: reservationId,
      user: {
        position_assignments: {
          some: {
            position: {
              unit: {
                organization_id: organizationId,
              },
            },
          },
        },
      },
    },
    include: { reserved_vehicles: true }
  });
  if (!reservation) throw new Error('Reservation not found');

  assertNoDuplicateDriversInPayload(vehiclesData);
  
  // Only allow update if reservation is ACCEPTED or APPROVED and not IN_PROGRESS
  if (reservation.reservation_status === RequestStatus.IN_PROGRESS) {
    throw new Error('Cannot update vehicles when reservation is in progress');
  }
  if (!([RequestStatus.ACCEPTED, RequestStatus.APPROVED] as RequestStatus[]).includes(reservation.reservation_status)) {
    throw new Error('Reservation must be accepted or approved before updating vehicles');
  }

  const vehicleIds = vehiclesData.map(v => v.vehicle_id);

  // Check if all vehicles are already assigned to this reservation
  const existingReservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: {
      reservation_id: reservationId,
      vehicle_id: { in: vehicleIds }
    }
  });

  if (existingReservedVehicles.length !== vehicleIds.length) {
    const existingVehicleIds = existingReservedVehicles.map(rv => rv.vehicle_id);
    const missingVehicleIds = vehicleIds.filter(id => !existingVehicleIds.includes(id));
    throw new Error(`Vehicles not assigned to this reservation: ${missingVehicleIds.join(', ')}`);
  }

  // Update vehicles with odometer/fuel data in a transaction
  const updatedReservedVehicles = await prisma.$transaction(async (tx) => {
    const updatedVehicles = [];
    
    for (const vehicleData of vehiclesData) {
      const reservedVehiclesToUpdate = await tx.tbl_reserved_vehicles.findMany({
        where: {
          reservation_id: reservationId,
          vehicle_id: vehicleData.vehicle_id
        }
      });
      
      for (const rv of reservedVehiclesToUpdate) {
        await tx.tbl_reserved_vehicles.update({
          where: { reserved_vehicle_id: rv.reserved_vehicle_id },
          data: {
            starting_odometer: vehicleData.starting_odometer,
            fuel_provided: vehicleData.fuel_provided,
          },
        });

        // Manage driver assignment
        const activeAssignment = await tx.tbl_reserved_vehicle_drivers.findFirst({
          where: {
            reserved_vehicle_id: rv.reserved_vehicle_id,
            is_active: true
          }
        });

        if (vehicleData.driver_id) {
          if (!activeAssignment || activeAssignment.driver_id !== vehicleData.driver_id) {
            await assertDriverNotOnAnotherVehicleInReservation(
              tx,
              reservationId,
              vehicleData.driver_id,
              { excludeReservedVehicleId: rv.reserved_vehicle_id }
            );
            if (activeAssignment) {
              await tx.tbl_reserved_vehicle_drivers.update({
                where: { assignment_id: activeAssignment.assignment_id },
                data: {
                  is_active: false,
                  unassigned_at: new Date()
                }
              });

              await tx.tbl_drivers.update({
                where: { driver_id: activeAssignment.driver_id },
                data: { driver_status: 'AVAILABLE' }
              });
            }

            // Create new assignment
            await tx.tbl_reserved_vehicle_drivers.create({
              data: {
                reserved_vehicle_id: rv.reserved_vehicle_id,
                driver_id: vehicleData.driver_id,
                is_active: true
              }
            });

            await tx.tbl_drivers.update({
              where: { driver_id: vehicleData.driver_id },
              data: { driver_status: 'ON_TRIP' }
            });
          }
        } else {
          // If no driver_id, deactivate any active assignment
          if (activeAssignment) {
            await tx.tbl_reserved_vehicle_drivers.update({
              where: { assignment_id: activeAssignment.assignment_id },
              data: {
                is_active: false,
                unassigned_at: new Date()
              }
            });

            await tx.tbl_drivers.update({
              where: { driver_id: activeAssignment.driver_id },
              data: { driver_status: 'AVAILABLE' }
            });
          }
        }
      }
      
      updatedVehicles.push(vehicleData);
    }
    
    // Update reservation status to APPROVED after odometer/fuel update
    await tx.tbl_reservations.update({
      where: { reservation_id: reservationId },
      data: { 
        reservation_status: RequestStatus.APPROVED,
        approved_by: reviewerId, // Track who approved the reservation
        approved_at: new Date(), // Track when it was approved
      },
    });
    
    return updatedVehicles;
  });

  // Return all reserved vehicles for this reservation with vehicle details
  const allReservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
    include: {
      vehicle: true,
      drivers: {
        include: {
          driver: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  
  return allReservedVehicles;
}

export async function assignVehicleWithOdometerFuel(reservationId: string, vehicleId: string, reviewerId: string, startingOdometer: number = 0, fuelProvided: number = 0) {
  // Permission check: reviewer only (enforced in controller)
  // Only assign if reservation is ACCEPTED and not IN_PROGRESS
  const reservation = await prisma.tbl_reservations.findUnique({ where: { reservation_id: reservationId } });
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.reservation_status === RequestStatus.IN_PROGRESS) {
    throw new Error('Cannot assign vehicle when reservation is in progress');
  }
  if (reservation.reservation_status !== RequestStatus.ACCEPTED) {
    throw new Error('Reservation must be accepted before assigning a vehicle');
  }
  
  const vehicle = await prisma.tbl_vehicles.findUnique({ where: { vehicle_id: vehicleId } });
  if (!vehicle) throw new Error('Vehicle not found');
  
  // Check if vehicle is available for the specific date range
  const availabilityCheck = await isVehicleAvailableForDateRange(
    vehicleId,
    reservation.departure_date,
    reservation.expected_returning_date,
    reservationId
  );
  
  if (!availabilityCheck.available) {
    throw new Error(`Vehicle is not available: ${availabilityCheck.reason}`);
  }
  
  // Assign vehicle and set odometer/fuel (no need to mark as OCCUPIED since we're using date-based availability)
  await prisma.$transaction(async (tx) => {
    await tx.tbl_reserved_vehicles.create({
      data: {
        vehicle_id: vehicleId,
        reservation_id: reservationId,
        starting_odometer: startingOdometer,
        fuel_provided: fuelProvided,
        returned_odometer: null,
      },
    });
    
    // Update reservation status to APPROVED after vehicle assignment
    await tx.tbl_reservations.update({
      where: { reservation_id: reservationId },
      data: { reservation_status: RequestStatus.APPROVED },
    });
  });
  
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

export async function completeReservation(
  reservedVehicleId: string,
  returnedOdometer: number,
  userId: string,
  returnedFuelEnergy?: number | null,
) {
  // Permission check: only assigned user (enforced in controller)
  const reservedVehicle = await prisma.tbl_reserved_vehicles.findUnique({
    where: { reserved_vehicle_id: reservedVehicleId },
    include: { reservation: true, vehicle: true },
  });
  if (!reservedVehicle) throw new Error('Reserved vehicle not found');
  const reservation = reservedVehicle.reservation;
  if (!reservation) throw new Error('Reservation not found');
  // if (reservation.user_id !== userId) {
  //   throw new Error('Not authorized to complete this reservation');
  // }
  if (reservation.reservation_status !== RequestStatus.APPROVED) {
    throw new Error('Reservation must be APPROVED to complete');
  }

  const startingOdometer = reservedVehicle.starting_odometer;
  if (
    startingOdometer != null &&
    startingOdometer > 0 &&
    returnedOdometer <= startingOdometer
  ) {
    throw new AppError(
      `Returned odometer (${returnedOdometer}) must be greater than the starting odometer (${startingOdometer})`,
      400
    );
  }

  const energyType = (reservedVehicle.vehicle?.energy_type ?? '').toLowerCase();
  const needsEnergyReturn =
    energyType.includes('electric') || energyType.includes('hybrid') || energyType.includes('ev');
  if (needsEnergyReturn && (returnedFuelEnergy == null || returnedFuelEnergy < 0)) {
    throw new AppError(
      'Returned fuel (litres) or battery energy (kWh) is required for this vehicle type',
      400,
    );
  }

  // Update reserved vehicle with return information
  await prisma.tbl_reserved_vehicles.update({
    where: { reserved_vehicle_id: reservedVehicleId },
    data: {
      returned_odometer: returnedOdometer,
      returned_fuel_energy: returnedFuelEnergy ?? null,
      returned_date: new Date(),
      returned_by: userId, // Track who returned the vehicle
    },
  });

  // Deactivate active driver assignment and set driver back to AVAILABLE
  const activeAssignment = await prisma.tbl_reserved_vehicle_drivers.findFirst({
    where: {
      reserved_vehicle_id: reservedVehicleId,
      is_active: true,
    },
  });

  if (activeAssignment) {
    await prisma.tbl_reserved_vehicle_drivers.update({
      where: { assignment_id: activeAssignment.assignment_id },
      data: {
        is_active: false,
        unassigned_at: new Date(),
      },
    });

    await prisma.tbl_drivers.update({
      where: { driver_id: activeAssignment.driver_id },
      data: { driver_status: 'AVAILABLE' },
    });
  }
  
  // Check if this vehicle is being used by any other active reservations
  const otherActiveReservations = await prisma.tbl_reserved_vehicles.findMany({
    where: {
      vehicle_id: reservedVehicle.vehicle_id,
      reservation: {
        reservation_status: {
          in: [RequestStatus.ACCEPTED, RequestStatus.APPROVED, RequestStatus.IN_PROGRESS]
        },
        reservation_id: { not: reservation.reservation_id }
      }
    }
  });
  
  // Only mark vehicle as AVAILABLE if it's not being used by other active reservations
  if (otherActiveReservations.length === 0) {
    await prisma.tbl_vehicles.update({
      where: { vehicle_id: reservedVehicle.vehicle_id },
      data: { vehicle_status: 'AVAILABLE' },
    });
  }
  
  // Check if all reserved vehicles have returned_odometer set
  const allReserved = await prisma.tbl_reserved_vehicles.findMany({ where: { reservation_id: reservation.reservation_id } });
  const allReturned = allReserved.length > 0 && allReserved.every(rv => rv.returned_odometer !== null);
  if (allReturned) {
    await prisma.tbl_reservations.update({
      where: { reservation_id: reservation.reservation_id },
      data: { 
        reservation_status: RequestStatus.COMPLETED,
        completed_by: userId, // Track who completed the reservation
        completed_at: new Date(), // Track when it was completed
      },
    });
  }
  return true;
}

export async function getAllReservations(organizationId: string, user?: { user_id: string; position_access?: any }) {
  // Determine whether to scope results to this user's own/assigned reservations
  const hasFullView = user?.position_access?.reservations?.view;
  const hasViewAssigned = user?.position_access?.reservations?.viewAssigned;
  const scopeToAssigned = !hasFullView && hasViewAssigned;

  console.log('[DEBUG GET ALL RESERVATIONS]', {
    organizationId,
    user_id: user?.user_id,
    hasFullView,
    hasViewAssigned,
    scopeToAssigned,
    position_access: user?.position_access
  });

  // Base org filter — every reservation must belong to the same org
  const orgFilter: any = {
    user: {
      position_assignments: {
        some: {
          position: {
            unit: {
              organization_id: organizationId,
            },
          },
        },
      },
    },
  };

  let whereClause: any;

  if (scopeToAssigned && user) {
    // Driver: only see reservations they created OR are assigned to as a driver (within org)
    whereClause = {
      AND: [
        orgFilter,
        {
          OR: [
            { user_id: user.user_id },
            {
              reserved_vehicles: {
                some: {
                  drivers: {
                    some: {
                      driver: {
                        user_id: user.user_id,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    };
  } else {
    // Manager/admin: see all reservations in the org
    whereClause = orgFilter;
  }

  console.log('[DEBUG GET ALL RESERVATIONS WHERE CLAUSE]', JSON.stringify(whereClause, null, 2));

  // Get reservations from the specified organization
  return prisma.tbl_reservations.findMany({
    where: whereClause,
    include: {
      user: {
        include: {
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      reviewer: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      approver: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      completer: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      canceler: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      reserved_vehicles: {
        include: {
          vehicle: {
            include: {
              vehicle_model: true,
            }
          },
          drivers: {
            include: {
              driver: {
                include: {
                  user: true,
                },
              },
            },
          },
          returned_by_user: {
            select: {
              user_id: true,
              first_name: true,
              last_name: true,
              auth: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
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
    where: {
      OR: [
        { user_id: userId },
        {
          reserved_vehicles: {
            some: {
              drivers: {
                some: {
                  driver: {
                    user_id: userId,
                  },
                },
              },
            },
          },
        },
      ],
    },
    include: {
      user: true,
      reviewer: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      approver: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      completer: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      canceler: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      reserved_vehicles: {
        include: {
          vehicle: {
            include: {
              vehicle_model: true,
            }
          },
          drivers: {
            include: {
              driver: {
                include: {
                  user: true,
                },
              },
            },
          },
          returned_by_user: {
            select: {
              user_id: true,
              first_name: true,
              last_name: true,
              auth: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function getReservationById(reservationId: string, organizationId: string) {
  return prisma.tbl_reservations.findUnique({
    where: { 
      reservation_id: reservationId,
      user: {
        position_assignments: {
          some: {
            position: {
              unit: {
                organization_id: organizationId,
              },
            },
          },
        },
      },
    },
    include: {
      user: {
        include: {
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      reviewer: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      approver: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      completer: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      canceler: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          auth: {
            select: {
              email: true,
            },
          },
        },
      },
      reserved_vehicles: {
        include: {
          vehicle: {
            include: {
              vehicle_model: true,
            }
          },
          drivers: {
            include: {
              driver: {
                include: {
                  user: true,
                },
              },
            },
          },
          returned_by_user: {
            select: {
              user_id: true,
              first_name: true,
              last_name: true,
              auth: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
} 

export async function addVehicleToReservation(
  reservationId: string,
  vehicleId: string,
  reviewerId: string,
  organizationId: string,
  driverId?: string | null
) {
  // Permission check: reviewer only (enforced in controller)
  const reservation = await prisma.tbl_reservations.findUnique({ 
    where: { 
      reservation_id: reservationId,
      user: {
        position_assignments: {
          some: {
            position: {
              unit: {
                organization_id: organizationId,
              },
            },
          },
        },
      },
    },
    include: { reserved_vehicles: true }
  });
  
  if (!reservation) throw new Error('Reservation not found');
  
  // Only allow adding vehicles if reservation status is ACCEPTED, APPROVED, or IN_PROGRESS
  if (!([RequestStatus.ACCEPTED, RequestStatus.APPROVED, RequestStatus.IN_PROGRESS] as RequestStatus[]).includes(reservation.reservation_status)) {
    throw new Error('Can only add vehicles to reservations with ACCEPTED, APPROVED, or IN_PROGRESS status');
  }
  
  const vehicle = await prisma.tbl_vehicles.findUnique({ 
    where: { 
      vehicle_id: vehicleId,
      organization_id: organizationId
    } 
  });
  
  if (!vehicle) throw new Error('Vehicle not found');
  
  // Check if vehicle is already assigned to this reservation
  const existingAssignment = await prisma.tbl_reserved_vehicles.findFirst({
    where: {
      reservation_id: reservationId,
      vehicle_id: vehicleId
    }
  });
  
  if (existingAssignment) {
    throw new Error('Vehicle is already assigned to this reservation');
  }
  
  // Check if vehicle is available for the specific date range
  const availabilityCheck = await isVehicleAvailableForDateRange(
    vehicleId, 
    reservation.departure_date, 
    reservation.expected_returning_date,
    reservationId
  );
  
  if (!availabilityCheck.available) {
    throw new Error(`Vehicle is not available: ${availabilityCheck.reason}`);
  }
  
  // Add vehicle to reservation
  const reservedVehicle = await prisma.tbl_reserved_vehicles.create({
    data: {
      vehicle_id: vehicleId,
      reservation_id: reservationId,
      starting_odometer: 0, // Will be set when reservation is IN_PROGRESS
      returned_odometer: null,
      fuel_provided: null,
    },
  });

  if (driverId) {
    await assertDriverNotOnAnotherVehicleInReservation(
      prisma,
      reservationId,
      driverId
    );
    await prisma.tbl_reserved_vehicle_drivers.create({
      data: {
        reserved_vehicle_id: reservedVehicle.reserved_vehicle_id,
        driver_id: driverId,
        is_active: true,
      },
    });

    // Update driver status to ON_TRIP if reservation is already IN_PROGRESS or APPROVED
    const finalDriverStatus = (reservation.reservation_status === RequestStatus.IN_PROGRESS || reservation.reservation_status === RequestStatus.APPROVED)
      ? 'ON_TRIP'
      : 'AVAILABLE';
    await prisma.tbl_drivers.update({
      where: { driver_id: driverId },
      data: { driver_status: finalDriverStatus },
    });
  }
  
  // Return all reserved vehicles for this reservation
  const allReservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
    include: {
      vehicle: {
        include: {
          vehicle_model: true,
        }
      },
      drivers: {
        include: {
          driver: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  
  return allReservedVehicles;
}

export async function removeVehicleFromReservation(reservationId: string, vehicleId: string, reviewerId: string, organizationId: string) {
  // Permission check: reviewer only (enforced in controller)
  const reservation = await prisma.tbl_reservations.findUnique({ 
    where: { 
      reservation_id: reservationId,
      user: {
        position_assignments: {
          some: {
            position: {
              unit: {
                organization_id: organizationId,
              },
            },
          },
        },
      },
    },
    include: { reserved_vehicles: true }
  });
  
  if (!reservation) throw new Error('Reservation not found');
  
  // Only allow removing vehicles if reservation is ACCEPTED
  if (reservation.reservation_status !== RequestStatus.ACCEPTED) {
    throw new Error('Can only remove vehicles from reservations with ACCEPTED status');
  }
  
  // Check if vehicle is assigned to this reservation
  const existingAssignment = await prisma.tbl_reserved_vehicles.findFirst({
    where: {
      reservation_id: reservationId,
      vehicle_id: vehicleId
    }
  });
  
  if (!existingAssignment) {
    throw new Error('Vehicle is not assigned to this reservation');
  }
  
  // Remove vehicle from reservation
  await prisma.tbl_reserved_vehicles.delete({
    where: {
      reserved_vehicle_id: existingAssignment.reserved_vehicle_id
    }
  });
  
  // Return all remaining reserved vehicles for this reservation
  const remainingReservedVehicles = await prisma.tbl_reserved_vehicles.findMany({
    where: { reservation_id: reservationId },
    include: {
      vehicle: {
        include: {
          vehicle_model: true,
        }
      },
    },
  });
  
  return remainingReservedVehicles;
} 