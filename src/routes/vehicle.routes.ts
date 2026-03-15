import { Router } from 'express';
import {
  createVehicleModelController,
  getAllVehicleModelsController,
  getVehicleModelByIdController,
  updateVehicleModelController,
  deleteVehicleModelController,
  createVehicleController,
  getAllVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
  deleteVehicleController,
  updateVehicleLocationsController,
  streamVehicleLocationController
} from '../controllers/vehicle.controllers';
import { authenticateQueryToken, authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { validateBody } from '../middlewares/bodyValidator';
import { upload } from '../middlewares/multer';
import { locationUpdateSchema, vehicleModelSchema, vehicleModelUpdateSchema, vehicleSchema, vehicleUpdateSchema } from '../schemas/vehicle.schema';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: VehicleModels
 *     description: CRUD for vehicle models
 *   - name: Vehicles
 *     description: CRUD for vehicles
 *
 * note: All endpoints below are prefixed with /v2 (e.g., /v2/vehicle-models)
 *
 * components:
 *   schemas:
 *     VehicleModel:
 *       type: object
 *       required:
 *         - vehicle_model_name
 *         - vehicle_type
 *         - manufacturer_name
 *         - vehicle_capacity
 *       properties:
 *         vehicle_model_id:
 *           type: string
 *         vehicle_model_name:
 *           type: string
 *         vehicle_type:
 *           type: string
 *           enum: [AMBULANCE, SEDAN, SUV, TRUCK, VAN, MOTORCYCLE, BUS, OTHER]
 *         manufacturer_name:
 *           type: string
 *         vehicle_capacity:
 *           type: integer
 *           example: 15
 *         created_at:
 *           type: string
 *           format: date-time
 *     Vehicle:
 *       type: object
 *       required:
 *         - plate_number
 *         - transmission_mode
 *         - vehicle_model_id
 *         - vehicle_photo
 *         - vehicle_year
 *         - energy_type
 *         - organization_id
 *       properties:
 *         vehicle_id:
 *           type: string
 *         plate_number:
 *           type: string
 *         transmission_mode:
 *           type: string
 *           enum: [MANUAL, AUTOMATIC, SEMI_AUTOMATIC]
 *         vehicle_model_id:
 *           type: string
 *         vehicle_photo:
 *           type: string
 *         vehicle_year:
 *           type: integer
 *         vehicle_status:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_SERVICE]
 *         energy_type:
 *           type: string
 *         last_service_date:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *         organization_id:
 *           type: string
 *
 * /v2/vehicle-models:
 *   post:
 *     summary: Create a vehicle model
 *     tags: [VehicleModels]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Do NOT include `vehicle_model_id` or `created_at` in the request body. These are auto-generated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleModel'
 *           example:
 *             vehicle_model_name: "Toyota Hiace"
 *             vehicle_type: "VAN"
 *             manufacturer_name: "Toyota"
 *             vehicle_capacity: 15
 *     responses:
 *       201:
 *         description: Vehicle model created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleModel'
 *   get:
 *     summary: Get all vehicle models
 *     tags: [VehicleModels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicle models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleModel'
 *
 * /v2/vehicle-models/{id}:
 *   get:
 *     summary: Get a vehicle model by ID
 *     tags: [VehicleModels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle model found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleModel'
 *       404:
 *         description: Vehicle model not found
 *   put:
 *     summary: Update a vehicle model
 *     tags: [VehicleModels]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Do NOT include `vehicle_model_id` or `created_at` in the request body. These are auto-generated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleModel'
 *     responses:
 *       200:
 *         description: Vehicle model updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleModel'
 *   delete:
 *     summary: Delete a vehicle model
 *     tags: [VehicleModels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle model deleted
 *
 * /v2/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: Filter by availability - only vehicles available in the date range (ISO date or date-time)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: End of availability range (use with startDate)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *   post:
 *     summary: Create a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Do NOT include `vehicle_id`, `created_at`, or `last_service_date` in the request body. These are auto-generated.
 *       To upload an image, use `multipart/form-data` and provide the image file as `vehicle_photo`.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               plate_number:
 *                 type: string
 *                 example: RAC123A
 *               transmission_mode:
 *                 type: string
 *                 enum: [MANUAL, AUTOMATIC, SEMI_AUTOMATIC]
 *                 example: MANUAL
 *               vehicle_model_id:
 *                 type: string
 *                 example: REPLACE_WITH_MODEL_ID
 *               vehicle_photo:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               vehicle_year:
 *                 type: integer
 *                 example: 2018
 *               energy_type:
 *                 type: string
 *                 example: Diesel
 *               organization_id:
 *                 type: string
 *                 example: REPLACE_WITH_ORG_ID
 *     responses:
 *       201:
 *         description: Vehicle created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *
 * /v2/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Do NOT include `vehicle_id`, `created_at`, or `last_service_date` in the request body. These are auto-generated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle deleted
 */

// Vehicle Models CRUD
router.post('/vehicle-models', authenticateToken, attachPositionAccess, validateBody(vehicleModelSchema), createVehicleModelController);
router.get('/vehicle-models', authenticateToken, attachPositionAccess, getAllVehicleModelsController);
router.get('/vehicle-models/:id', authenticateToken, attachPositionAccess, getVehicleModelByIdController);
router.put('/vehicle-models/:id', authenticateToken, attachPositionAccess, validateBody(vehicleModelUpdateSchema), updateVehicleModelController);
router.delete('/vehicle-models/:id', authenticateToken, attachPositionAccess, deleteVehicleModelController);

// Vehicles CRUD
router.post('/vehicles', authenticateToken, attachPositionAccess, upload.single('vehicle_photo'), validateBody(vehicleSchema), createVehicleController);
router.get('/vehicles', authenticateToken, attachPositionAccess, getAllVehiclesController);
router.get('/vehicles/:id', authenticateToken, attachPositionAccess, getVehicleByIdController);
router.put('/vehicles/:id', authenticateToken, attachPositionAccess, validateBody(vehicleUpdateSchema), updateVehicleController);
router.delete('/vehicles/:id', authenticateToken, attachPositionAccess, deleteVehicleController);

// Vehicle locations

/**
 * @openapi
 * /v2/vehicles/{id}/locations:
 *   post:
 *     summary: Submit live geolocation data for a vehicle
 *     description: Receives geolocation updates from a vehicle's GPS device or mobile browser and updates the vehicle's current location.
 *     tags:
 *       - Vehicle Location
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: UUID of the vehicle to update location for
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
 *                 description: Vehicle UUID (should match path param)
 *               coords:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     format: float
 *                     minimum: -90
 *                     maximum: 90
 *                   longitude:
 *                     type: number
 *                     format: float
 *                     minimum: -180
 *                     maximum: 180
 *                   altitude:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                   accuracy:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                   altitudeAccuracy:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                     nullable: true
 *                   heading:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                     maximum: 360
 *                     nullable: true
 *                   speed:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                     nullable: true
 *               timestamp:
 *                 type: number
 *                 format: int64
 *                 description: Unix timestamp in milliseconds
 *     responses:
 *       200:
 *         description: Location successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Location received
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodValidationError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – User does not have access to this vehicle
 *       404:
 *         description: Vehicle not found
 */
router.get('/vehicles/:id/locations/stream',  authenticateQueryToken, attachPositionAccess, streamVehicleLocationController);

/**
 * @openapi
 * /v2/vehicles/{id}/locations/stream:
 *   get:
 *     summary: Stream live geolocation updates for a vehicle
 *     description: |
 *       Opens a Server-Sent Events (SSE) connection that streams real-time location updates of the specified vehicle.
 *       The client must provide a valid access token as a query parameter for authorization.
 *     tags:
 *       - Vehicle Location
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: UUID of the vehicle to stream locations for
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: token
 *         in: query
 *         required: true
 *         description: JWT access token for authorization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SSE stream started successfully
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: |
 *                 Server-Sent Events stream that sends JSON payloads with vehicle location updates.
 *                 Each event's data field contains a JSON object with vehicle location information.
 *       401:
 *         description: Unauthorized – invalid or missing token
 *       403:
 *         description: Forbidden – User does not have permission to view vehicle locations
 *       404:
 *         description: Vehicle not found
 */

router.post('/vehicles/:id/locations', validateBody(locationUpdateSchema), updateVehicleLocationsController);


export default router; 