import express from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticateFleetManager } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Fleet Manager - Vehicle Management
 *   description: Fleet manager operations for managing vehicles
 */

/**
 * @swagger
 * /fleetmanager/vehicles/statuses:
 *   get:
 *     summary: Get available vehicle status options
 *     tags: [Fleet Manager - Vehicle Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of vehicle status options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                     example: "AVAILABLE"
 *                   label:
 *                     type: string
 *                     example: "Available"
 *       '403':
 *         description: Forbidden – only fleet managers can access this endpoint
 */
router.get('/statuses', authenticateFleetManager, VehicleController.getVehicleStatuses);

/**
 * @swagger
 * /fleetmanager/vehicles:
 *   get:
 *     summary: Get all vehicles in the fleet manager's organization
 *     tags: [Fleet Manager - Vehicle Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *                   plate_number:
 *                     type: string
 *                     example: "RAA 123A"
 *                   vehicle_type:
 *                     type: string
 *                     example: "Sedan"
 *                   vehicle_model:
 *                     type: string
 *                     example: "Toyota Camry"
 *                   manufacturer:
 *                     type: string
 *                     example: "Toyota"
 *                   year:
 *                     type: integer
 *                     example: 2022
 *                   capacity:
 *                     type: integer
 *                     nullable: true
 *                     example: 5
 *                   odometer:
 *                     type: integer
 *                     example: 15000
 *                   status:
 *                     type: string
 *                     enum: [AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE]
 *                     example: "AVAILABLE"
 *                   fuel_type:
 *                     type: string
 *                     nullable: true
 *                     example: "Petrol"
 *                   last_service_date:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2024-01-15T00:00:00.000Z"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00.000Z"
 *                   organization_name:
 *                     type: string
 *                     example: "Acme Corp"
 *       '403':
 *         description: Forbidden – only fleet managers can access this endpoint
 */
router.get('/', authenticateFleetManager, VehicleController.getAllVehicles);

/**
 * @swagger
 * /fleetmanager/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Fleet Manager - Vehicle Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 plate_number:
 *                   type: string
 *                 vehicle_type:
 *                   type: string
 *                 vehicle_model:
 *                   type: string
 *                 manufacturer:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 capacity:
 *                   type: integer
 *                   nullable: true
 *                 odometer:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE]
 *                 fuel_type:
 *                   type: string
 *                   nullable: true
 *                 last_service_date:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 organization_name:
 *                   type: string
 *       404:
 *         description: Vehicle not found
 *       403:
 *         description: Forbidden – only fleet managers can access this endpoint
 */
router.get('/:id', authenticateFleetManager, VehicleController.getVehicleById);

/**
 * @swagger
 * /fleetmanager/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Fleet Manager - Vehicle Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plate_number
 *               - vehicle_type
 *               - vehicle_model
 *               - odometer
 *               - status
 *             properties:
 *               plate_number:
 *                 type: string
 *                 example: "RAA 123A"
 *                 description: Unique plate number
 *               vehicle_type:
 *                 type: string
 *                 example: "Sedan"
 *                 description: Type of vehicle (e.g., Sedan, SUV, Truck)
 *               vehicle_model:
 *                 type: string
 *                 example: "Toyota Camry"
 *                 description: Vehicle model
 *               manufacturer:
 *                 type: string
 *                 example: "Toyota"
 *                 description: Vehicle manufacturer (optional)
 *               year:
 *                 type: integer
 *                 example: 2022
 *                 description: Manufacturing year (optional)
 *               capacity:
 *                 type: integer
 *                 example: 5
 *                 description: Passenger capacity (optional)
 *               odometer:
 *                 type: integer
 *                 example: 15000
 *                 description: Current odometer reading
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE]
 *                 example: "AVAILABLE"
 *                 description: Current vehicle status
 *               fuel_type:
 *                 type: string
 *                 example: "Petrol"
 *                 description: Type of fuel (optional)
 *               last_service_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *                 description: Last service date (optional)
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicle created successfully"
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     plate_number:
 *                       type: string
 *                     vehicle_type:
 *                       type: string
 *                     vehicle_model:
 *                       type: string
 *                     manufacturer:
 *                       type: string
 *                     year:
 *                       type: integer
 *                     capacity:
 *                       type: integer
 *                       nullable: true
 *                     odometer:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE]
 *                     fuel_type:
 *                       type: string
 *                       nullable: true
 *                     last_service_date:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     organization_name:
 *                       type: string
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Forbidden – only fleet managers can access this endpoint
 *       409:
 *         description: Conflict - plate number already exists
 */
router.post('/', authenticateFleetManager, VehicleController.createVehicle);

/**
 * @swagger
 * /fleetmanager/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Fleet Manager - Vehicle Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plate_number:
 *                 type: string
 *                 example: "RAA 123A"
 *               vehicle_type:
 *                 type: string
 *                 example: "Sedan"
 *               vehicle_model:
 *                 type: string
 *                 example: "Toyota Camry"
 *               manufacturer:
 *                 type: string
 *                 example: "Toyota"
 *               year:
 *                 type: integer
 *                 example: 2022
 *               capacity:
 *                 type: integer
 *                 example: 5
 *               odometer:
 *                 type: integer
 *                 example: 15000
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE]
 *                 example: "AVAILABLE"
 *               fuel_type:
 *                 type: string
 *                 example: "Petrol"
 *               last_service_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicle updated successfully"
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     plate_number:
 *                       type: string
 *                     vehicle_type:
 *                       type: string
 *                     vehicle_model:
 *                       type: string
 *                     manufacturer:
 *                       type: string
 *                     year:
 *                       type: integer
 *                     capacity:
 *                       type: integer
 *                       nullable: true
 *                     odometer:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE]
 *                     fuel_type:
 *                       type: string
 *                       nullable: true
 *                     last_service_date:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     organization_name:
 *                       type: string
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Forbidden – only fleet managers can access this endpoint
 *       404:
 *         description: Vehicle not found
 *       409:
 *         description: Conflict - plate number already exists
 */
router.put('/:id', authenticateFleetManager, VehicleController.updateVehicle);

/**
 * @swagger
 * /fleetmanager/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Fleet Manager - Vehicle Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vehicle deleted successfully
 *       400:
 *         description: Bad request - vehicle has associated trips or requests
 *       403:
 *         description: Forbidden – only fleet managers can access this endpoint
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', authenticateFleetManager, VehicleController.deleteVehicle);

export default router; 