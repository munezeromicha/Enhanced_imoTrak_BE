// src/routes/reservation.routes.ts
import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  updateReservationStatus,
  assignMultipleVehicles,
  completeReservation,
  getAllReservations,
  deleteReservation,
  getMyReservations,
  updateReservationReason,
  assignMultipleVehiclesWithOdometerFuel,
  getReservationById,
  updateMultipleVehiclesWithOdometerFuel,
  getAvailableVehicles,
  addVehicleToReservation,
  removeVehicleFromReservation,
} from '../controllers/reservation.controllers';
import { validateBody } from '../middlewares/bodyValidator';
import {
  createReservationSchema,
  cancelReservationSchema,
  updateReservationStatusSchema,
  assignVehicleSchema,
  assignMultipleVehiclesSchema,
  assignMultipleVehiclesWithOdometerFuelSchema,
  completeReservationSchema,
  getAvailableVehiclesSchema,
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
 * /v2/reservations/{id}/assign-multiple-vehicles:
 *   post:
 *     summary: Assign multiple vehicles to a reservation at once (sets status to ACCEPTED)
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
 *               vehicle_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 minItems: 1
 *                 example: ["c4d5e6f7-1234-5678-9abc-def012345678", "d5e6f7a8-2345-6789-abcd-ef0123456789"]
 *           example:
 *             vehicle_ids: ["c4d5e6f7-1234-5678-9abc-def012345678", "d5e6f7a8-2345-6789-abcd-ef0123456789"]
 *     responses:
 *       200:
 *         description: Multiple vehicles assigned (reservation status set to ACCEPTED)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "2 vehicle(s) assigned successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reserved_vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           vehicle_name:
 *                             type: string
 *                           vehicle_model:
 *                             type: string
 *                           license_plate:
 *                             type: string
 *                           vehicle_status:
 *                             type: string
 *             example:
 *               message: "2 vehicle(s) assigned successfully"
 *               data:
 *                 - reserved_vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                   vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *                   vehicle:
 *                     vehicle_name: "Toyota Land Cruiser"
 *                     vehicle_model: "Land Cruiser 2020"
 *                     license_plate: "RAB123A"
 *                     vehicle_status: "AVAILABLE"
 *                 - reserved_vehicle_id: "e6f7a8b9-3456-7890-bcde-f1234567890a"
 *                   vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                   vehicle:
 *                     vehicle_name: "Toyota Hilux"
 *                     vehicle_model: "Hilux 2021"
 *                     license_plate: "RAB456B"
 *                     vehicle_status: "AVAILABLE"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicles not available: c4d5e6f7-1234-5678-9abc-def012345678"
 */
router.post('/:id/assign-multiple-vehicles', authenticateToken, attachPositionAccess, validateBody(assignMultipleVehiclesSchema), withAuthUser(assignMultipleVehicles));

/**
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
 * /v2/reservations/available-vehicles:
 *   post:
 *     summary: Get available vehicles for a specific date range
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departure_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-01T09:00:00Z"
 *               expected_returning_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-01T18:00:00Z"
 *           example:
 *             departure_date: "2024-08-01T09:00:00Z"
 *             expected_returning_date: "2024-08-01T18:00:00Z"
 *     responses:
 *       200:
 *         description: List of available vehicles for the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Found 5 available vehicle(s) for the specified date range"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       plate_number:
 *                         type: string
 *                       vehicle_model:
 *                         type: object
 *                         properties:
 *                           vehicle_model_id:
 *                             type: string
 *                           vehicle_model_name:
 *                             type: string
 *                           vehicle_type:
 *                             type: string
 *                           vehicle_capacity:
 *                             type: integer
 *                           manufacturer_name:
 *                             type: string
 *                       vehicle_status:
 *                         type: string
 *                       energy_type:
 *                         type: string
 *                       vehicle_year:
 *                         type: integer
 *                       transmission_mode:
 *                         type: string
 *                       last_service_date:
 *                         type: string
 *                         format: date-time
 *                 count:
 *                   type: integer
 *                   example: 5
 *             example:
 *               message: "Found 5 available vehicle(s) for the specified date range"
 *               data:
 *                 - vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *                   plate_number: "RAB123A"
 *                   vehicle_model:
 *                     vehicle_model_id: "model-uuid-1"
 *                     vehicle_model_name: "Land Cruiser 2020"
 *                     vehicle_type: "SUV"
 *                     vehicle_capacity: 8
 *                     manufacturer_name: "Toyota"
 *                   vehicle_status: "AVAILABLE"
 *                   energy_type: "Diesel"
 *                   vehicle_year: 2020
 *                   transmission_mode: "AUTOMATIC"
 *                   last_service_date: "2024-07-15T10:00:00Z"
 *       400:
 *         description: Bad request - invalid date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Departure date must be in the future and return date must be after departure date"
 */
router.post(
  '/available-vehicles',
  authenticateToken,
  attachPositionAccess,
  validateBody(getAvailableVehiclesSchema),
  withAuthUser(getAvailableVehicles)
);

/**
/**
 * @openapi
 * /v2/reservations/{id}/assign-multiple-vehicles-odometer:
 *   patch:
 *     summary: Update multiple vehicles with odometer and fuel data for an existing reservation
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
 *               vehicles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     vehicle_id:
 *                       type: string
 *                       format: uuid
 *                     starting_odometer:
 *                       type: integer
 *                       default: 0
 *                       example: 12000
 *                     fuel_provided:
 *                       type: integer
 *                       default: 0
 *                       example: 50
 *                 minItems: 1
 *           example:
 *             vehicles:
 *               - vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *                 starting_odometer: 12000
 *                 fuel_provided: 50
 *               - vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                 starting_odometer: 13000
 *                 fuel_provided: 60
 *     responses:
 *       200:
 *         description: Multiple vehicles updated with odometer/fuel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "2 vehicle(s) updated successfully with odometer/fuel"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reserved_vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       starting_odometer:
 *                         type: integer
 *                       fuel_provided:
 *                         type: integer
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           vehicle_name:
 *                             type: string
 *                           vehicle_model:
 *                             type: string
 *                           license_plate:
 *                             type: string
 *                           vehicle_status:
 *                             type: string
 *             example:
 *               message: "2 vehicle(s) updated successfully with odometer/fuel"
 *               data:
 *                 - reserved_vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                   vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *                   starting_odometer: 12000
 *                   fuel_provided: 50
 *                   vehicle:
 *                     vehicle_name: "Toyota Land Cruiser"
 *                     vehicle_model: "Land Cruiser 2020"
 *                     license_plate: "RAB123A"
 *                     vehicle_status: "AVAILABLE"
 *                 - reserved_vehicle_id: "e6f7a8b9-3456-7890-bcde-f1234567890a"
 *                   vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                   starting_odometer: 13000
 *                   fuel_provided: 60
 *                   vehicle:
 *                     vehicle_name: "Toyota Hilux"
 *                     vehicle_model: "Hilux 2021"
 *                     license_plate: "RAB456B"
 *                     vehicle_status: "AVAILABLE"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicles not assigned to this reservation: c4d5e6f7-1234-5678-9abc-def012345678"
 */
router.patch('/:id/assign-multiple-vehicles-odometer', authenticateToken, attachPositionAccess, validateBody(assignMultipleVehiclesWithOdometerFuelSchema), withAuthUser(updateMultipleVehiclesWithOdometerFuel));

/**
 * @openapi
 * /v2/reservations/{id}/add-vehicle:
 *   post:
 *     summary: Add a vehicle to a reservation
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
 *           example:
 *             vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *     responses:
 *       200:
 *         description: Vehicle added to reservation
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
 *                     properties:
 *                       reserved_vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           vehicle_name:
 *                             type: string
 *                           vehicle_model:
 *                             type: string
 *                           license_plate:
 *                             type: string
 *                           vehicle_status:
 *                             type: string
 *             example:
 *               message: "Vehicle added successfully"
 *               data:
 *                 - reserved_vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                   vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *                   vehicle:
 *                     vehicle_name: "Toyota Land Cruiser"
 *                     vehicle_model: "Land Cruiser 2020"
 *                     license_plate: "RAB123A"
 *                     vehicle_status: "AVAILABLE"
 *       400:
 *         description: Bad request - vehicle not available or already in reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicle not available or already in this reservation: c4d5e6f7-1234-5678-9abc-def012345678"
 */
router.post('/:id/add-vehicle', authenticateToken, attachPositionAccess, validateBody(assignVehicleSchema), withAuthUser(addVehicleToReservation));

/**
 * @openapi
 * /v2/reservations/{id}/remove-vehicle:
 *   post:
 *     summary: Remove a vehicle from a reservation
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
 *           example:
 *             vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *     responses:
 *       200:
 *         description: Vehicle removed from reservation
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
 *                     properties:
 *                       reserved_vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       vehicle_id:
 *                         type: string
 *                         format: uuid
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           vehicle_name:
 *                             type: string
 *                           vehicle_model:
 *                             type: string
 *                           license_plate:
 *                             type: string
 *                           vehicle_status:
 *                             type: string
 *             example:
 *               message: "Vehicle removed successfully"
 *               data:
 *                 - reserved_vehicle_id: "d5e6f7a8-2345-6789-abcd-ef0123456789"
 *                   vehicle_id: "c4d5e6f7-1234-5678-9abc-def012345678"
 *                   vehicle:
 *                     vehicle_name: "Toyota Land Cruiser"
 *                     vehicle_model: "Land Cruiser 2020"
 *                     license_plate: "RAB123A"
 *                     vehicle_status: "AVAILABLE"
 *       400:
 *         description: Bad request - vehicle not in reservation or not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicle not in this reservation or not found: c4d5e6f7-1234-5678-9abc-def012345678"
 */
router.post('/:id/remove-vehicle', authenticateToken, attachPositionAccess, validateBody(assignVehicleSchema), withAuthUser(removeVehicleFromReservation));

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