import { Router } from 'express';
import * as controller from '../controllers/vehicleIssue.controller';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { authenticateToken } from '../middlewares/auth.middleware';

const issueRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicle Issues
 *   description: Endpoints for managing vehicle issue reports
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleIssue'
 */
issueRoutes.get('/', attachPositionAccess, authenticateToken, controller.getAll);

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
 *               $ref: '#/components/schemas/VehicleIssue'
 *       404:
 *         description: Issue not found
 */
issueRoutes.get('/:id', controller.getById);

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
 *               - issue_description
 *               - reserved_vehicle_id
 *             properties:
 *               issue_description:
 *                 type: string
 *               reserved_vehicle_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Issue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleIssue'
 */
issueRoutes.post('/', controller.create);

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
issueRoutes.put('/:id', controller.update);

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
issueRoutes.delete('/:id', controller.remove);

export default issueRoutes;
