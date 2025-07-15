import { Router } from 'express';
import { createOrganizationController, createPositionController, createUnitController, deletePositionController, getOrganizationsController, getPositionsInUnitController } from '../controllers/organization.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { validateBody } from '../middlewares/bodyValidator';
import { createPositionSchema, createUnitSchema, organizationSchema } from '../schemas/organization.schema';
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

/**
 * @swagger
 * /v2/organizations/units:
 *   post:
 *     summary: Create a new unit inside an organization
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
 *               - unit_name
 *               - organization_id
 *             properties:
 *               unit_name:
 *                 type: string
 *               organization_id:
 *                 type: string
 *                 format: uuid
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
 *                 data:
 *                   $ref: '#/components/schemas/Unit'
 *       403:
 *         description: Forbidden - No permission
 *       404:
 *         description: Organization not found
 *       409:
 *         description: Unit name already exists in this organization
 *       400:
 *         description: Validation error
 */

organizationRoutes.post(
  '/units',
  authenticateToken,
  attachPositionAccess,
  validateBody(createUnitSchema),
  createUnitController
);

/**
 * @swagger
 * /v2/organizations/units/{unit_id}/positions:
 *   get:
 *     summary: Get all positions in a unit along with assigned users
 *     tags:
 *       - unit
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unit_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the unit to retrieve positions for
 *     responses:
 *       200:
 *         description: A list of positions with assigned users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Positions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       position_id:
 *                         type: string
 *                         format: uuid
 *                       position_name:
 *                         type: string
 *                       position_status:
 *                         type: string
 *                       user:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           user_id:
 *                             type: string
 *                             format: uuid
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *       403:
 *         description: Forbidden - User does not have permission
 *       404:
 *         description: Unit not found or does not belong to your organization
 *       500:
 *         description: Internal server error
 */

organizationRoutes.get(
  '/units/:unit_id/positions',
  authenticateToken,
  attachPositionAccess,
  getPositionsInUnitController
);

/**
 * @swagger
 * /v2/organizations/positions:
 *   post:
 *     summary: Create a new position in a unit
 *     tags:
 *       - Position
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - position_name
 *               - position_description
 *               - unit_id
 *               - position_access
 *             properties:
 *               position_name:
 *                 type: string
 *               position_description:
 *                 type: string
 *               unit_id:
 *                 type: string
 *                 format: uuid
 *               position_access:
 *                 type: object
 *                 properties:
 *                   organizations:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                       view:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       delete:
 *                         type: boolean
 *                   units:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                       view:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       delete:
 *                         type: boolean
 *                   positions:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                       view:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       delete:
 *                         type: boolean
 *                   users:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                       view:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       delete:
 *                         type: boolean
 *     responses:
 *       201:
 *         description: Position created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Position'
 *       403:
 *         description: Forbidden - No permission or outside your organization
 *       404:
 *         description: Unit not found or inactive
 *       409:
 *         description: Position name already exists in this unit
 */

organizationRoutes.post(
  '/positions',
  authenticateToken,
  attachPositionAccess,
  validateBody(createPositionSchema),
  createPositionController
);

/**
 * @swagger
 * /v2/organizations/positions/{positionId}:
 *   delete:
 *     summary: Soft delete a position
 *     tags:
 *       - Position
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: positionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the position to be deleted
 *     responses:
 *       200:
 *         description: Position deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Position deleted (soft) successfully
 *       403:
 *         description: Forbidden - Not allowed
 *       404:
 *         description: Position not found
 */

organizationRoutes.delete(
  '/positions/:positionId',
  authenticateToken,
  attachPositionAccess,
  deletePositionController
);



export default organizationRoutes;
