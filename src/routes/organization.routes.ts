import { Router } from 'express';
import { createOrganizationController } from '../controllers/organization.controllers';
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


export default organizationRoutes;
