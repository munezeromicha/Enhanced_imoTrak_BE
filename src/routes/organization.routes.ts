import { Router } from 'express';
import { createOrganizationController } from '../controllers/organization.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';

const organizationRoutes = Router();

/**
 * @swagger
 * /v2/organizations:
 *   post:
 *     summary: Register a new organization
 *     tags:
 *       - Organization
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organization_name
 *             properties:
 *               organization_name:
 *                 type: string
 *               organization_email:
 *                 type: string
 *               organization_phone:
 *                 type: string
 *               organization_logo:
 *                 type: string
 *               street_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       403:
 *         description: Forbidden - No permission
 *       400:
 *         description: Validation error
 */
organizationRoutes.post('/', authenticateToken, attachPositionAccess, createOrganizationController);

export default organizationRoutes;
