import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.services';
import {
  createReservationSchema,
  cancelReservationSchema,
  updateReservationStatusSchema,
  assignVehicleSchema,
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
    checkPermission(req, 'update');
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
    checkPermission(req, 'update');
    const { vehicle_id } = assignVehicleSchema.parse(req.body);
    const reservationId = req.params.id;
    const reviewerId = req.user.user_id;
    const reservedVehicle = await reservationService.assignVehicle(reservationId, vehicle_id, reviewerId);
    res.status(200).json({ message: 'Vehicle assigned', data: reservedVehicle });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const startReservation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'update');
    const reservedVehicleId = req.params.reservedVehicleId;
    const user_id = req.user.user_id;
    await reservationService.startReservation(reservedVehicleId, user_id);
    res.status(200).json({ message: 'Reservation started' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
};

export const updateOdometerFuel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    checkPermission(req, 'update');
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
    checkPermission(req, 'update');
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
    const reservations = await reservationService.getAllReservations();
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