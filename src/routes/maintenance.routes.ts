import { Router } from 'express';
import * as controller from '../controllers/maintenance.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';

const maintenanceRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicle Maintenance
 *   description: Track vehicle maintenance jobs, their history and the supervisor leading each one
 */

/**
 * @swagger
 * /v2/maintenance:
 *   get:
 *     summary: List maintenance records for the caller's organization
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Maintenance records retrieved successfully
 *       403:
 *         description: Access denied
 */
maintenanceRoutes.get('/', authenticateToken, attachPositionAccess, controller.getAll);

/**
 * @swagger
 * /v2/maintenance/vehicle/{vehicleId}:
 *   get:
 *     summary: Full maintenance history for one vehicle, newest first
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Maintenance history retrieved successfully
 *       404:
 *         description: Vehicle not found
 */
maintenanceRoutes.get('/vehicle/:vehicleId', authenticateToken, attachPositionAccess, controller.getForVehicle);

/**
 * @swagger
 * /v2/maintenance/{id}:
 *   get:
 *     summary: Get a single maintenance record with its supervisor history
 *     tags: [Vehicle Maintenance]
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
 *         description: Maintenance record retrieved successfully
 *       404:
 *         description: Record not found
 */
maintenanceRoutes.get('/:id', authenticateToken, attachPositionAccess, controller.getById);

/**
 * @swagger
 * /v2/maintenance:
 *   post:
 *     summary: Open a maintenance job for a vehicle
 *     description: >
 *       Creates a job and assigns its first supervisor (defaults to the caller).
 *       When started immediately the vehicle is flagged MAINTENANCE. A vehicle
 *       may only have one open job at a time.
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicle_id, title]
 *             properties:
 *               vehicle_id: { type: string, format: uuid }
 *               title: { type: string }
 *               description: { type: string }
 *               maintenance_type:
 *                 type: string
 *                 enum: [PREVENTIVE, CORRECTIVE, INSPECTION, REPAIR, TIRE, BODYWORK, OTHER]
 *               scheduled_date: { type: string, format: date-time }
 *               service_provider: { type: string }
 *               odometer_km: { type: integer }
 *               supervisor_user_id: { type: string, format: uuid }
 *               start_now: { type: boolean }
 *     responses:
 *       201:
 *         description: Maintenance job created successfully
 *       409:
 *         description: Vehicle already has an Assign maintenance job
 */
maintenanceRoutes.post('/', authenticateToken, attachPositionAccess, controller.create);

/**
 * @swagger
 * /v2/maintenance/{id}:
 *   put:
 *     summary: Update an Assign maintenance job
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Maintenance job updated successfully }
 *       400: { description: Job is closed and cannot be edited }
 */
maintenanceRoutes.put('/:id', authenticateToken, attachPositionAccess, controller.update);

/**
 * @swagger
 * /v2/maintenance/{id}/start:
 *   patch:
 *     summary: Move a scheduled job to in-progress and flag the vehicle
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Maintenance started }
 */
maintenanceRoutes.patch('/:id/start', authenticateToken, attachPositionAccess, controller.start);

/**
 * @swagger
 * /v2/maintenance/{id}/complete:
 *   patch:
 *     summary: Complete a job and return the vehicle to service
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [work_performed]
 *             properties:
 *               work_performed: { type: string }
 *               cost: { type: number }
 *               currency: { type: string }
 *               odometer_km: { type: integer }
 *               restore_vehicle_status:
 *                 type: string
 *                 enum: [AVAILABLE, OUT_OF_SERVICE]
 *     responses:
 *       200: { description: Maintenance completed }
 */
maintenanceRoutes.patch('/:id/complete', authenticateToken, attachPositionAccess, controller.complete);

/**
 * @swagger
 * /v2/maintenance/{id}/cancel:
 *   patch:
 *     summary: Cancel an Assign maintenance job
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Maintenance cancelled }
 */
maintenanceRoutes.patch('/:id/cancel', authenticateToken, attachPositionAccess, controller.cancel);

/**
 * @swagger
 * /v2/maintenance/{id}/supervisor:
 *   patch:
 *     summary: Hand the job to a different supervisor
 *     description: The outgoing supervisor is retained in history with an unassigned_at timestamp.
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id: { type: string, format: uuid }
 *               handover_note: { type: string }
 *     responses:
 *       200: { description: Maintenance supervisor updated }
 */
maintenanceRoutes.patch('/:id/supervisor', authenticateToken, attachPositionAccess, controller.assignSupervisor);

/**
 * @swagger
 * /v2/maintenance/{id}:
 *   delete:
 *     summary: Delete a maintenance record
 *     tags: [Vehicle Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 */
maintenanceRoutes.delete('/:id', authenticateToken, attachPositionAccess, controller.remove);

export default maintenanceRoutes;
