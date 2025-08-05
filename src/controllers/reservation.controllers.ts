import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.services';
import {
  createReservationSchema,
  cancelReservationSchema,
  updateReservationStatusSchema,
  assignVehicleSchema,
  assignMultipleVehiclesSchema,
  assignMultipleVehiclesWithOdometerFuelSchema,
  startReservationSchema,
  completeReservationSchema,
  odometerFuelSchema,
} from '../schemas/reservation.schema';
import { z } from 'zod';
import { RequestStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types/access';

function checkPermission(req: AuthenticatedRequest, action: keyof AuthenticatedRequest['user']['position_access']['reservations']) {
  if (!req.user?.position_access?.reservations?.[action]) {
    throw new Error('Forbidden: insufficient reservation permissions');
  }
}

export const createReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'create');
    const body = createReservationSchema.parse(req.body);
    const user_id = req.user.user_id;
    const reservation = await reservationService.createReservation({ ...body, user_id });
    res.status(201).json({ message: 'Reservation created', data: reservation });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const cancelReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'cancel');
    const { reason } = cancelReservationSchema.parse(req.body);
    const reservationId = req.params.id;
    const user_id = req.user.user_id;
    const isReviewer = req.user.position_access.reservations.update && req.user.position_access.reservations.view;
    const reservation = await reservationService.cancelReservation(reservationId, reason, user_id, isReviewer);
    res.status(200).json({ message: 'Reservation canceled', data: reservation });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const updateReservationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'update');
    const { status, reason } = updateReservationStatusSchema.parse(req.body);
    const reservationId = req.params.id;
    const reviewerId = req.user.user_id;
    const reservation = await reservationService.updateReservationStatus(reservationId, status as RequestStatus, reviewerId, reason);
    res.status(200).json({ message: 'Reservation status updated', data: reservation });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const assignVehicle = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'assignVehicle');
    const { vehicle_id } = assignVehicleSchema.parse(req.body);
    const reservationId = req.params.id;
    const reviewerId = req.user.user_id;
    const organizationId = req.user.organization_id;
    const reservedVehicle = await reservationService.assignVehicle(reservationId, vehicle_id, reviewerId, organizationId);
    res.status(200).json({ message: 'Vehicle assigned', data: reservedVehicle });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const assignMultipleVehicles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'assignVehicle');
    const { vehicle_ids } = assignMultipleVehiclesSchema.parse(req.body);
    const reservationId = req.params.id;
    const reviewerId = req.user.user_id;
    const organizationId = req.user.organization_id;
    const reservedVehicles = await reservationService.assignMultipleVehicles(reservationId, vehicle_ids, reviewerId, organizationId);
    res.status(200).json({ 
      message: `${vehicle_ids.length} vehicle(s) assigned successfully`, 
      data: reservedVehicles 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const updateOdometerFuel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'odometerFuel');
    const { starting_odometer, fuel_provided } = odometerFuelSchema.parse(req.body);
    const reservedVehicleId = req.params.reservedVehicleId;
    const user_id = req.user.user_id;
    await reservationService.updateOdometerFuel(reservedVehicleId, starting_odometer, fuel_provided, user_id);
    res.status(200).json({ message: 'Odometer and fuel updated' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const completeReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'complete');
    const { returned_odometer } = completeReservationSchema.parse(req.body);
    const reservedVehicleId = req.params.reservedVehicleId;
    const user_id = req.user.user_id;
    await reservationService.completeReservation(reservedVehicleId, returned_odometer, user_id);
    res.status(200).json({ message: 'Reservation completed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const getAllReservations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'view');
    const organizationId = req.user.organization_id;
    const reservations = await reservationService.getAllReservations(organizationId);
    res.status(200).json({ data: reservations });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const deleteReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'delete');
    const reservationId = req.params.id;
    await reservationService.deleteReservation(reservationId);
    res.status(200).json({ message: 'Reservation deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const getMyReservations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'viewOwn');
    const user_id = req.user.user_id;
    const reservations = await reservationService.getReservationsByUserId(user_id);
    res.status(200).json({ data: reservations });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const updateReservationReason = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'updateReason');
    const { reason } = req.body;
    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason is required' });
    }
    const reservationId = req.params.id;
    const user_id = req.user.user_id;
    const updated = await reservationService.updateReservationReason(reservationId, reason, user_id);
    res.status(200).json({ message: 'Reason updated', data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const assignVehicleWithOdometerFuel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'assignVehicle');
    const { vehicle_id, starting_odometer = 0, fuel_provided = 0 } = req.body;
    if (!vehicle_id) {
      return res.status(400).json({ message: 'vehicle_id is required' });
    }
    const reservationId = req.params.id;
    const reviewerId = req.user.user_id;
    const reservedVehicles = await reservationService.assignVehicleWithOdometerFuel(
      reservationId,
      vehicle_id,
      reviewerId,
      starting_odometer,
      fuel_provided
    );
    res.status(200).json({ message: 'Vehicle assigned with odometer/fuel', data: reservedVehicles });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const assignMultipleVehiclesWithOdometerFuel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'assignVehicle');
    const { vehicles } = assignMultipleVehiclesWithOdometerFuelSchema.parse(req.body);
    const reservationId = req.params.id;
    const reviewerId = req.user.user_id;
    const organizationId = req.user.organization_id;
    const reservedVehicles = await reservationService.assignMultipleVehiclesWithOdometerFuel(
      reservationId,
      vehicles,
      reviewerId,
      organizationId
    );
    res.status(200).json({ 
      message: `${vehicles.length} vehicle(s) assigned successfully with odometer/fuel`, 
      data: reservedVehicles 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const updateMultipleVehiclesWithOdometerFuel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'assignVehicle');
    const { vehicles } = assignMultipleVehiclesWithOdometerFuelSchema.parse(req.body);
    const reservationId = req.params.id;
    const reviewerId = req.user.user_id;
    const organizationId = req.user.organization_id;
    const reservedVehicles = await reservationService.updateMultipleVehiclesWithOdometerFuel(
      reservationId,
      vehicles,
      reviewerId,
      organizationId
    );
    res.status(200).json({ 
      message: `${vehicles.length} vehicle(s) updated successfully with odometer/fuel`, 
      data: reservedVehicles 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const getAvailableVehicles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'assignVehicle');
    const { departure_date, expected_returning_date } = req.body;
    const organizationId = req.user.organization_id;
    
    const availableVehicles = await reservationService.getAvailableVehiclesForDateRange(
      departure_date,
      expected_returning_date,
      organizationId
    );
    
    res.status(200).json({ 
      message: `Found ${availableVehicles.length} available vehicle(s) for the specified date range`,
      data: availableVehicles,
      count: availableVehicles.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const getReservationById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if user has view permission or if they own the reservation
    const hasViewPermission = req.user?.position_access?.reservations?.view;
    const hasViewOwnPermission = req.user?.position_access?.reservations?.viewOwn;
    
    if (!hasViewPermission && !hasViewOwnPermission) {
      return res.status(403).json({ message: 'Forbidden: insufficient reservation permissions' });
    }
    
    const reservationId = req.params.id;
    const organizationId = req.user.organization_id;
    const reservation = await reservationService.getReservationById(reservationId, organizationId);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    // If user only has viewOwn permission, check if they own the reservation
    if (!hasViewPermission && hasViewOwnPermission && reservation.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Forbidden: can only view own reservations' });
    }
    
    res.status(200).json({ data: reservation });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
}; 