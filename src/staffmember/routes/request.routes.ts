import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { authenticateStaff } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRequest:
 *       type: object
 *       required:
 *         - trip_purpose
 *         - start_location
 *         - end_location
 *         - start_date
 *         - end_date
 *         - full_name
 *       properties:
 *         vehicle_id:
 *           type: string
 *           description: ID of the vehicle to request (optional)
 *         trip_purpose:
 *           type: string
 *           description: Purpose of the trip
 *           example: "Client meeting"
 *         start_location:
 *           type: string
 *           description: Starting location of the trip
 *           example: "Office Building A"
 *         end_location:
 *           type: string
 *           description: Destination of the trip
 *           example: "Client Office Downtown"
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the trip
 *           example: "2024-01-15T09:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: End date and time of the trip
 *           example: "2024-01-15T17:00:00Z"
 *         full_name:
 *           type: string
 *           description: Full name of the person making the request
 *           example: "John Doe"
 *         passengers_number:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Number of passengers
 *           example: 2
 *         comments:
 *           type: string
 *           description: Additional comments about the request
 *           example: "Need parking space at destination"
 *     
 *     UpdateRequest:
 *       type: object
 *       properties:
 *         trip_purpose:
 *           type: string
 *           description: Purpose of the trip
 *         start_location:
 *           type: string
 *           description: Starting location of the trip
 *         end_location:
 *           type: string
 *           description: Destination of the trip
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the trip
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: End date and time of the trip
 *         full_name:
 *           type: string
 *           description: Full name of the person making the request
 *         passengers_number:
 *           type: integer
 *           minimum: 1
 *           description: Number of passengers
 *         comments:
 *           type: string
 *           description: Additional comments about the request
 *     
 *     RequestResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Request ID
 *         vehicle_id:
 *           type: string
 *           nullable: true
 *           description: ID of the requested vehicle
 *         requested_at:
 *           type: string
 *           format: date-time
 *           description: When the request was created
 *         trip_purpose:
 *           type: string
 *           description: Purpose of the trip
 *         start_location:
 *           type: string
 *           description: Starting location
 *         end_location:
 *           type: string
 *           description: Destination
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Start date and time
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: End date and time
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *           description: Request status
 *         reviewed_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: When the request was reviewed
 *         comments:
 *           type: string
 *           nullable: true
 *           description: Comments on the request
 *         requester_id:
 *           type: string
 *           description: ID of the requester
 *         reviewed_by:
 *           type: string
 *           nullable: true
 *           description: ID of the reviewer
 *         full_name:
 *           type: string
 *           description: Full name of the requester
 *         passengers_number:
 *           type: integer
 *           description: Number of passengers
 *         vehicle:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *             plate_number:
 *               type: string
 *             vehicle_type:
 *               type: string
 *             vehicle_model:
 *               type: string
 *             manufacturer:
 *               type: string
 *               nullable: true
 *             year:
 *               type: integer
 *               nullable: true
 *             capacity:
 *               type: integer
 *               nullable: true
 *             status:
 *               type: string
 *         requester:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *     
 *     AvailableVehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Vehicle ID
 *         plate_number:
 *           type: string
 *           description: Vehicle plate number
 *         vehicle_type:
 *           type: string
 *           description: Type of vehicle
 *         vehicle_model:
 *           type: string
 *           description: Vehicle model
 *         manufacturer:
 *           type: string
 *           nullable: true
 *           description: Vehicle manufacturer
 *         year:
 *           type: integer
 *           nullable: true
 *           description: Vehicle year
 *         capacity:
 *           type: integer
 *           nullable: true
 *           description: Vehicle passenger capacity
 *         odometer:
 *           type: integer
 *           description: Current odometer reading
 *         fuel_type:
 *           type: string
 *           nullable: true
 *           description: Type of fuel
 *         last_service_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Last service date
 */

/**
 * @swagger
 * tags:
 *   name: Staff Requests
 *   description: Staff member car request management
 */

/**
 * @swagger
 * /staff/requests:
 *   get:
 *     summary: Get all requests for the authenticated staff member
 *     tags: [Staff Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RequestResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only staff members can access
 *       500:
 *         description: Internal server error
 */
router.get('/requests', authenticateStaff, RequestController.getMyRequests);

/**
 * @swagger
 * /staff/requests/{id}:
 *   get:
 *     summary: Get a specific request by ID
 *     tags: [Staff Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only staff members can access
 *       404:
 *         description: Request not found
 *       500:
 *         description: Internal server error
 */
router.get('/requests/:id', authenticateStaff, RequestController.getRequestById);

/**
 * @swagger
 * /staff/vehicles/available:
 *   get:
 *     summary: Get all available vehicles in the staff member's organization
 *     tags: [Staff Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AvailableVehicle'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only staff members can access
 *       500:
 *         description: Internal server error
 */
router.get('/vehicles/available', authenticateStaff, RequestController.getAvailableVehicles);

/**
 * @swagger
 * /staff/requests:
 *   post:
 *     summary: Create a new car request
 *     tags: [Staff Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequest'
 *           example:
 *             trip_purpose: "Client meeting"
 *             start_location: "Office Building A"
 *             end_location: "Client Office Downtown"
 *             start_date: "2024-01-15T09:00:00Z"
 *             end_date: "2024-01-15T17:00:00Z"
 *             full_name: "John Doe"
 *             passengers_number: 2
 *             comments: "Need parking space at destination"
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request created successfully"
 *                 request:
 *                   $ref: '#/components/schemas/RequestResponse'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only staff members can access
 *       409:
 *         description: Conflict - duplicate request
 *       500:
 *         description: Internal server error
 */
router.post('/requests', authenticateStaff, RequestController.createRequest);

/**
 * @swagger
 * /staff/requests/{id}:
 *   put:
 *     summary: Update an existing request (only if pending)
 *     tags: [Staff Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRequest'
 *           example:
 *             trip_purpose: "Updated client meeting"
 *             passengers_number: 3
 *             comments: "Updated requirements"
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request updated successfully"
 *                 request:
 *                   $ref: '#/components/schemas/RequestResponse'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only staff members can access
 *       404:
 *         description: Request not found or cannot be updated
 *       500:
 *         description: Internal server error
 */
router.put('/requests/:id', authenticateStaff, RequestController.updateRequest);

/**
 * @swagger
 * /staff/requests/{id}/cancel:
 *   patch:
 *     summary: Cancel a pending request
 *     tags: [Staff Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request cancelled successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only staff members can access
 *       404:
 *         description: Request not found or cannot be cancelled
 *       500:
 *         description: Internal server error
 */
router.patch('/requests/:id/cancel', authenticateStaff, RequestController.cancelRequest);

export default router; 