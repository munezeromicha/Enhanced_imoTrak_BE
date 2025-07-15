import { Router } from 'express';
import { createOrganizationController, getOrganizationsController } from '../controllers/organization.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { validateBody } from '../middlewares/bodyValidator';
import { organizationSchema } from '../schemas/organization.schema';
import { upload } from '../middlewares/multer';

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - organization_name
 *               - organization_email
 *               - organization_phone
 *               - organization_logo
 *               - street_address
 *             properties:
 *               organization_name:
 *                 type: string
 *               organization_email:
 *                 type: string
 *                 format: email
 *               organization_phone:
 *                 type: string
 *                 pattern: '^\\?[0-9]{10,15}$'
 *                 example: '250788123456'
 *                 description: Phone number must be 10 to 15 digits
 *               organization_logo:
 *                 type: string
 *                 format: binary
 *               street_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       403:
 *         description: Forbidden - No permission
 *       400:
 *         description: Validation error
 */

organizationRoutes.post(
  '/',
  authenticateToken,
  attachPositionAccess,
  upload.single('organization_logo'),
  validateBody(organizationSchema),
  createOrganizationController
);

/**
 * @swagger
 * /v2/organizations:
 *   get:
 *     summary: Get a paginated list of organizations
 *     tags:
 *       - Organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of organizations per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED, DELETED]
 *         description: Filter organizations by status
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organizations retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Organization'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 35
 *                         pages:
 *                           type: integer
 *                           example: 4
 *       403:
 *         description: Forbidden - No permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to view organizations
 */

organizationRoutes.get(
  '/',
  authenticateToken,
  attachPositionAccess,
  getOrganizationsController
);


export default organizationRoutes;
