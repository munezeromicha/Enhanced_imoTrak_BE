import { Router } from 'express';
import * as controller from '../controllers/vehicleIssue.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';

const issueRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicle Issues
 *   description: Endpoints for managing vehicle issue reports
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleIssue:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         issue_title:
 *           type: string
 *         issue_status:
 *           type: string
 *         issue_description:
 *           type: string
 *         reserved_vehicle_id:
 *           type: string
 *         issue_date:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /v2/issues:
 *   get:
 *     summary: Get all reported vehicle issues
 *     tags: [Vehicle Issues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicle issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle issues retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       issue_id:
 *                         type: string
 *                       issue_title:
 *                         type: string
 *                       issue_status:
 *                         type: string
 *                       issue_description:
 *                         type: string
 *                       issue_date:
 *                         type: string
 *                         format: date-time
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       reserved_vehicle_id:
 *                         type: string
 *                       reserved_vehicle:
 *                         type: object
 *                         properties:
 *                           reserved_vehicle_id:
 *                             type: string
 *                           vehicle_id:
 *                             type: string
 *                           reservation_id:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           starting_odometer:
 *                             type: number
 *                           returned_odometer:
 *                             type: number
 *                             nullable: true
 *                           fuel_provided:
 *                             type: number
 *                           returned_date:
 *                             type: string
 *                             format: date-time
 *                           vehicle:
 *                             type: object
 *                             properties:
 *                               vehicle_id:
 *                                 type: string
 *                               plate_number:
 *                                 type: string
 *                               transmission_mode:
 *                                 type: string
 *                               vehicle_model_id:
 *                                 type: string
 *                               vehicle_photo:
 *                                 type: string
 *                                 format: uri
 *                               vehicle_year:
 *                                 type: integer
 *                               vehicle_capacity:
 *                                 type: integer
 *                               vehicle_status:
 *                                 type: string
 *                               energy_type:
 *                                 type: string
 *                               last_service_date:
 *                                 type: string
 *                                 format: date-time
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               organization_id:
 *                                 type: string
 *                           reservation:
 *                             type: object
 *                             properties:
 *                               reservation_id:
 *                                 type: string
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               reservation_purpose:
 *                                 type: string
 *                               start_location:
 *                                 type: string
 *                               reservation_destination:
 *                                 type: string
 *                               departure_date:
 *                                 type: string
 *                                 format: date-time
 *                               expected_returning_date:
 *                                 type: string
 *                                 format: date-time
 *                               description:
 *                                 type: string
 *                               passengers:
 *                                 type: integer
 *                               reservation_status:
 *                                 type: string
 *                               reviewed_at:
 *                                 type: string
 *                                 format: date-time
 *                               rejection_comment:
 *                                 type: string
 *                               user_id:
 *                                 type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

issueRoutes.get('/', authenticateToken, attachPositionAccess, controller.getAll);

/**
 * @swagger
 * /v2/issues/{id}:
 *   get:
 *     summary: Get a vehicle issue by ID
 *     tags: [Vehicle Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the issue to retrieve
 *     responses:
 *       200:
 *         description: Vehicle issue details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: issue retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     issue_id:
 *                       type: string
 *                     issue_title:
 *                       type: string
 *                     issue_status:
 *                       type: string
 *                     issue_description:
 *                       type: string
 *                     issue_date:
 *                       type: string
 *                       format: date-time
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     reserved_vehicle_id:
 *                       type: string
 *                     reserved_vehicle:
 *                       type: object
 *                       properties:
 *                         reserved_vehicle_id:
 *                           type: string
 *                         vehicle_id:
 *                           type: string
 *                         reservation_id:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         starting_odometer:
 *                           type: number
 *                         returned_odometer:
 *                           type: number
 *                           nullable: true
 *                         fuel_provided:
 *                           type: number
 *                         returned_date:
 *                           type: string
 *                           format: date-time
 *                         vehicle:
 *                           type: object
 *                           properties:
 *                             vehicle_id:
 *                               type: string
 *                             plate_number:
 *                               type: string
 *                             transmission_mode:
 *                               type: string
 *                             vehicle_model_id:
 *                               type: string
 *                             vehicle_photo:
 *                               type: string
 *                               format: uri
 *                             vehicle_year:
 *                               type: integer
 *                             vehicle_capacity:
 *                               type: integer
 *                             vehicle_status:
 *                               type: string
 *                             energy_type:
 *                               type: string
 *                             last_service_date:
 *                               type: string
 *                               format: date-time
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                             organization_id:
 *                               type: string
 *                         reservation:
 *                           type: object
 *                           properties:
 *                             reservation_id:
 *                               type: string
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                             reservation_purpose:
 *                               type: string
 *                             start_location:
 *                               type: string
 *                             reservation_destination:
 *                               type: string
 *                             departure_date:
 *                               type: string
 *                               format: date-time
 *                             expected_returning_date:
 *                               type: string
 *                               format: date-time
 *                             description:
 *                               type: string
 *                             passengers:
 *                               type: integer
 *                             reservation_status:
 *                               type: string
 *                             reviewed_at:
 *                               type: string
 *                               format: date-time
 *                             rejection_comment:
 *                               type: string
 *                             user_id:
 *                               type: string
 *       404:
 *         description: Issue not found
 */

issueRoutes.get('/:id', authenticateToken, attachPositionAccess, controller.getById);

/**
 * @swagger
 * /v2/issues:
 *   post:
 *     summary: Create a new vehicle issue
 *     tags: [Vehicle Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - issue_title
 *               - issue_description
 *               - reserved_vehicle_id
 *               - issue_status
 *               - issue_date
 *             properties:
 *               issue_title:
 *                 type: string
 *               issue_description:
 *                 type: string
 *               reserved_vehicle_id:
 *                 type: string
 *               issue_status:
 *                 type: string
 *               issue_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Issue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleIssue'
 */
issueRoutes.post('/', authenticateToken, attachPositionAccess, controller.create);

/**
 * @swagger
 * /v2/issues/{id}:
 *   put:
 *     summary: Update an existing vehicle issue
 *     tags: [Vehicle Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the issue to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               issue_title:
 *                 type: string
 *               issue_description:
 *                 type: string
 *               reserved_vehicle_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleIssue'
 *       404:
 *         description: Issue not found
 */
issueRoutes.put('/:id', authenticateToken, attachPositionAccess, controller.update);

/**
 * @swagger
 * /v2/issues/{id}:
 *   delete:
 *     summary: Delete a vehicle issue
 *     tags: [Vehicle Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the issue to delete
 *     responses:
 *       204:
 *         description: Issue deleted successfully
 *       404:
 *         description: Issue not found
 */
issueRoutes.delete('/:id', authenticateToken, attachPositionAccess, controller.remove);

export default issueRoutes;
