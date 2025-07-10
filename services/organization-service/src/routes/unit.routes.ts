import { Router } from 'express';
import {
    handleCreateUnit,
    handleGetAllUnits,
    handleGetUnitsByOrg
} from '../controllers/unit.controllers';
import { validateCreateUnit } from '../middlewares/validationMiddlewares';

const unitRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Units
 *   description: Unit management APIs
 */

/**
 * @swagger
 * /units:
 *   post:
 *     summary: Create a new unit under an organization
 *     tags: [Units]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_name:
 *                 type: string
 *                 example: Human Resources
 *               organization_id:
 *                 type: string
 *                 format: uuid
 *                 example: 8395c735-5a48-47b0-8cee-2e4f00516e03
 *     responses:
 *       201:
 *         description: Unit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unit created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     unit_id:
 *                       type: string
 *                       format: uuid
 *                       example: 3e6dbb6c-92e9-472f-9a9c-b1fcaa5aabf2
 *                     unit_name:
 *                       type: string
 *                       example: Human Resources
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-10T20:31:18.391Z
 *                     organization_id:
 *                       type: string
 *                       format: uuid
 *                       example: 8395c735-5a48-47b0-8cee-2e4f00516e03
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create unit
 */

/**
 * @swagger
 * /units:
 *   get:
 *     summary: Get all units
 *     tags: [Units]
 *     responses:
 *       200:
 *         description: A list of units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Units fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       unit_id:
 *                         type: string
 *                         format: uuid
 *                         example: 3e6dbb6c-92e9-472f-9a9c-b1fcaa5aabf2
 *                       unit_name:
 *                         type: string
 *                         example: Finance
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-07-10T20:31:18.391Z
 *                       organization_id:
 *                         type: string
 *                         format: uuid
 *                         example: 8395c735-5a48-47b0-8cee-2e4f00516e03
 *       500:
 *         description: Failed to fetch units
 */

unitRoutes.get('/', handleGetAllUnits);
unitRoutes.post('/', validateCreateUnit, handleCreateUnit);

/**
 * @swagger
 * /units/org/{organization_id}:
 *   get:
 *     summary: Get all units belonging to a specific organization
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: organization_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the organization
 *     responses:
 *       200:
 *         description: A list of units under the organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Units fetched successfully for organization
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       unit_id:
 *                         type: string
 *                         format: uuid
 *                         example: d328ecf9-bd8f-44e3-bbb6-7d758f0a6a31
 *                       unit_name:
 *                         type: string
 *                         example: Engineering
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       organization_id:
 *                         type: string
 *                         format: uuid
 *       404:
 *         description: Organization not found or has no units
 *       500:
 *         description: Server error
 */


unitRoutes.get('/org/:organization_id', handleGetUnitsByOrg);



export default unitRoutes;
