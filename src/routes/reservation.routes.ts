// src/routes/reservation.routes.ts
import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  updateReservationStatus,
  assignVehicle,
  startReservation,
  completeReservation,
} from '../controllers/reservation.controllers';
import { validateBody } from '../middlewares/bodyValidator';
import {
  createReservationSchema,
  cancelReservationSchema,
  updateReservationStatusSchema,
  assignVehicleSchema,
  startReservationSchema,
  completeReservationSchema,
} from '../schemas/reservation.schema';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../types/access';

function withAuthUser(handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => any): RequestHandler {
  return (req, res, next) => handler(req as AuthenticatedRequest, res, next);
}

const router = Router();

/**
 * @openapi
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservation'
 *           example:
 *             reservation_purpose: "Business meeting"
 *             start_location: "Kigali HQ"
 *             reservation_destination: "Musanze Branch"
 *             departure_date: "2024-08-01T09:00:00Z"
 *             expected_returning_date: "2024-08-01T18:00:00Z"
 *     responses:
 *       201:
 *         description: Reservation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *             example:
 *               reservation_id: "b3b1c2d3-e4f5-6789-abcd-1234567890ef"
 *               created_at: "2024-08-01T08:00:00Z"
 *               reservation_purpose: "Business meeting"
 *               start_location: "Kigali HQ"
 *               reservation_destination: "Musanze Branch"
 *               departure_date: "2024-08-01T09:00:00Z"
 *               expected_returning_date: "2024-08-01T18:00:00Z"
 *               reservation_status: "UNDER_REVIEW"
 *               reviewed_at: null
 *               rejection_comment: null
 *               user_id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *               reserved_vehicles: []
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateToken, attachPositionAccess, validateBody(createReservationSchema), withAuthUser(createReservation));

/**
 * @openapi
 * /reservations/{id}/cancel:
 *   post:
 *     summary: Cancel a reservation
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelReservation'
 *           example:
 *             reason: "Change of plans"
 *     responses:
 *       200:
 *         description: Reservation canceled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *             example:
 *               reservation_id: "b3b1c2d3-e4f5-6789-abcd-1234567890ef"
 *               reservation_status: "CANCELED"
 *               rejection_comment: "Change of plans"
 *       400:
 *         description: Bad request
 */
router.post('/:id/cancel', authenticateToken, attachPositionAccess, validateBody(cancelReservationSchema), withAuthUser(cancelReservation));

/**
 * @openapi
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservationStatus'
 *           example:
 *             status: "APPROVED"
 *             reason: "All requirements met"
 *     responses:
 *       200:
 *         description: Reservation status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *             example:
 *               reservation_id: "b3b1c2d3-e4f5-6789-abcd-1234567890ef"
 *               reservation_status: "APPROVED"
 *               reviewed_at: "2024-08-01T10:00:00Z"
 *       400:
 *         description: Bad request
 */
router.patch('/:id/status', authenticateToken, attachPositionAccess, validateBody(updateReservationStatusSchema), withAuthUser(updateReservationStatus));

/**
 * @openapi
 * /reservations/{id}/assign-vehicle:
 *   post:
 *     summary: Assign a vehicle to a reservation
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignVehicle'
 *           example:
 *             vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *     responses:
 *       200:
 *         description: Vehicle assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *             example:
 *               reservation_id: "b3b1c2d3-e4f5-6789-abcd-1234567890ef"
 *               reservation_status: "APPROVED"
 *               reserved_vehicles:
 *                 - reserved_vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                   vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *       400:
 *         description: Bad request
 */
router.post('/:id/assign-vehicle', authenticateToken, attachPositionAccess, validateBody(assignVehicleSchema), withAuthUser(assignVehicle));

/**
 * @openapi
 * /reservations/{reservedVehicleId}/start:
 *   post:
 *     summary: Start a reservation (vehicle pickup)
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: reservedVehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartReservation'
 *           example:
 *             starting_odometer: 12000
 *             fuel_provided: 50
 *     responses:
 *       200:
 *         description: Reservation started
 *       400:
 *         description: Bad request
 */
router.post('/:reservedVehicleId/start', authenticateToken, attachPositionAccess, validateBody(startReservationSchema), withAuthUser(startReservation));

/**
 * @openapi
 * /reservations/{reservedVehicleId}/complete:
 *   post:
 *     summary: Complete a reservation (vehicle return)
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: reservedVehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteReservation'
 *           example:
 *             returned_odometer: 12500
 *     responses:
 *       200:
 *         description: Reservation completed
 *       400:
 *         description: Bad request
 */
router.post('/:reservedVehicleId/complete', authenticateToken, attachPositionAccess, validateBody(completeReservationSchema), withAuthUser(completeReservation));

export default router; 