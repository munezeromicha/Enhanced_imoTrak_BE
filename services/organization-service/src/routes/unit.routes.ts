import { Router } from 'express';
import { handleCreateUnit } from '../controllers/unit.controllers';
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

unitRoutes.post('/', validateCreateUnit, handleCreateUnit);

export default unitRoutes;
