// src/routes/reservation.routes.ts
import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  updateReservationStatus,
  assignVehicle,
  completeReservation,
  getAllReservations,
  deleteReservation,
  updateOdometerFuel,
  getMyReservations,
  updateReservationReason,
  assignVehicleWithOdometerFuel,
  getReservationById,
} from '../controllers/reservation.controllers';
import { validateBody } from '../middlewares/bodyValidator';
import {
  createReservationSchema,
  cancelReservationSchema,
  updateReservationStatusSchema,
  assignVehicleSchema,
  startReservationSchema,
  completeReservationSchema,
  odometerFuelSchema,
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
 * /v2/reservations:
 *   post:
 *     summary: Create a new reservation
 *     security:
 *       - bearerAuth: []
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
 *             description: "Trip to Musanze for business meeting."
 *             passengers: 4
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
 * /v2/reservations/{id}/cancel:
 *   post:
 *     summary: Cancel a reservation
 *     security:
 *       - bearerAuth: []
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
 * /v2/reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     security:
 *       - bearerAuth: []
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
 * /v2/reservations/{id}/assign-vehicle:
 *   post:
 *     summary: Assign a vehicle to a reservation
 *     security:
 *       - bearerAuth: []
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
 * /v2/reservations/{reservedVehicleId}/odometer-fuel:
 *   post:
 *     summary: Update starting odometer and fuel provided
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/OdometerFuel'
 *           example:
 *             starting_odometer: 12000
 *             fuel_provided: 50
 *     responses:
 *       200:
 *         description: Odometer and fuel updated
 *       400:
 *         description: Bad request
 */
router.post('/:reservedVehicleId/odometer-fuel', authenticateToken, attachPositionAccess, validateBody(odometerFuelSchema), withAuthUser(updateOdometerFuel));

/**
 * @openapi
 * /v2/reservations/{reservedVehicleId}/complete:
 *   post:
 *     summary: Complete a reservation (vehicle return)
 *     security:
 *       - bearerAuth: []
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

/**
 * @openapi
 * /v2/reservations/{id}/reason:
 *   patch:
 *     summary: Update the rejection/cancellation reason for a reservation
 *     security:
 *       - bearerAuth: []
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
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Updated reason for rejection or cancellation."
 *     responses:
 *       200:
 *         description: Reason updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Bad request
 */
router.patch('/:id/reason', authenticateToken, attachPositionAccess, withAuthUser(updateReservationReason));

/**
 * @openapi
 * /v2/reservations:
 *   get:
 *     summary: Get all reservation requests
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Reservations
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Bad request
 */
router.get(
  '/',
  authenticateToken,
  attachPositionAccess,
  withAuthUser(getAllReservations)
);

/**
 * @openapi
 * /v2/reservations/my:
 *   get:
 *     summary: Get reservations for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Reservations
 *     responses:
 *       200:
 *         description: List of user's reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Bad request
 */
router.get(
  '/my',
  authenticateToken,
  attachPositionAccess,
  withAuthUser(getMyReservations)
);

/**
 * @openapi
 * /v2/reservations/{id}/assign-vehicle-odometer:
 *   post:
 *     summary: Assign a vehicle to a reservation and set odometer/fuel in one call
 *     security:
 *       - bearerAuth: []
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
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: string
 *                 format: uuid
 *               starting_odometer:
 *                 type: integer
 *                 default: 0
 *                 example: 0
 *               fuel_provided:
 *                 type: integer
 *                 default: 0
 *                 example: 0
 *           example:
 *             vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *             starting_odometer: 0
 *             fuel_provided: 0
 *     responses:
 *       200:
 *         description: Vehicle assigned with odometer/fuel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request
 */
router.post('/:id/assign-vehicle-odometer', authenticateToken, attachPositionAccess, withAuthUser(assignVehicleWithOdometerFuel));

/**
 * @openapi
 * /v2/reservations/{id}:
 *   get:
 *     summary: Get a single reservation by ID with all details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *             example:
 *               data:
 *                 reservation_id: "b3b1c2d3-e4f5-6789-abcd-1234567890ef"
 *                 reservation_purpose: "Business meeting"
 *                 start_location: "Kigali HQ"
 *                 reservation_destination: "Musanze Branch"
 *                 departure_date: "2024-08-01T09:00:00Z"
 *                 expected_returning_date: "2024-08-01T18:00:00Z"
 *                 description: "Trip to Musanze for business meeting."
 *                 passengers: 4
 *                 reservation_status: "APPROVED"
 *                 created_at: "2024-08-01T08:00:00Z"
 *                 reviewed_at: "2024-08-01T10:00:00Z"
 *                 rejection_comment: null
 *                 user:
 *                   user_id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                 reserved_vehicles:
 *                   - reserved_vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                     starting_odometer: 12000
 *                     fuel_provided: 50
 *                     returned_odometer: null
 *                     returned_date: null
 *                     vehicle:
 *                       vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *                       vehicle_name: "Toyota Land Cruiser"
 *                       vehicle_model: "Land Cruiser 2020"
 *                       vehicle_status: "OCCUPIED"
 *                       license_plate: "RAB123A"
 *       404:
 *         description: Reservation not found
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get('/:id', authenticateToken, attachPositionAccess, withAuthUser(getReservationById));

/**
 * @openapi
 * /v2/reservations/{id}:
 *   delete:
 *     summary: Delete a specific reservation by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reservation deleted
 *       400:
 *         description: Bad request
 */
router.delete(
  '/:id',
  authenticateToken,
  attachPositionAccess,
  withAuthUser(deleteReservation)
);

export default router; 