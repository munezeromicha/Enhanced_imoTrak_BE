import { Router } from 'express';
import { assignUserToPositionController, createOrganizationController, createPositionController, createUnitController, deleteOrganizationController, deletePositionController, deleteUnitController, getOrganizationsController, getPositionsController, getPositionsInUnitController, getSingleOrganizationController, getSinglePositionController, getSingleUnitController, getUnitsController, getUnitsInOrganization, updateOrganizationController, updatePositionController, updateUnitController } from '../controllers/organization.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { validateBody } from '../middlewares/bodyValidator';
import { createPositionSchema, createUnitSchema, organizationSchema, updateOrganizationSchema, updateUnitSchema } from '../schemas/organization.schema';
import { upload } from '../middlewares/multer';
import { assignUserToPositionSchema } from '../schemas/position.schema';

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
 *       - Units
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
 * /v2/organizations/units:
 *   get:
 *     summary: Get all units in the requester's organization
 *     tags:
 *       - Units
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of units with their positions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 units:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       unit_id:
 *                         type: string
 *                       unit_name:
 *                         type: string
 *                       unit_status:
 *                         type: string
 *                       organization_id:
 *                         type: string
 *                       positions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             position_id:
 *                               type: string
 *                             position_title:
 *                               type: string
 *                             position_status:
 *                               type: string
 *                             user_id:
 *                               type: string
 *                               nullable: true
 *       403:
 *         description: You do not have permission to view units
 *       401:
 *         description: Unauthorized
 */

organizationRoutes.get(
  '/units',
  authenticateToken,
  attachPositionAccess,
  getUnitsController
);

/**
 * @swagger
 * /v2/organizations/units/{unit_id}/positions:
 *   get:
 *     summary: Get all positions in a unit along with assigned users
 *     tags:
 *       - Position
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
 *                 $ref: '#/components/schemas/PositionAccess'
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

/**
 * @swagger
 * /v2/organizations/{organization_id}:
 *   patch:
 *     summary: Update an existing organization's details (excluding status)
 *     tags:
 *       - Organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organization_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the organization to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               organization_name:
 *                 type: string
 *               organization_email:
 *                 type: string
 *                 format: email
 *               organization_phone:
 *                 type: string
 *               organization_logo:
 *                 type: string
 *                 format: binary
 *               street_address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - You do not have permission
 *       404:
 *         description: Organization not found
 */

organizationRoutes.patch(
  '/:organization_id',
  authenticateToken,
  attachPositionAccess,
  upload.single('organization_logo'),
  validateBody(updateOrganizationSchema),
  updateOrganizationController
);

/**
 * @swagger
 * /v2/organizations/{organization_id}:
 *   delete:
 *     summary: Soft delete an organization and cascade update related units and positions
 *     tags:
 *       - Organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organization_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the organization to delete
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden - No permission
 *       404:
 *         description: Organization not found
 */

organizationRoutes.delete(
  '/:organization_id',
  authenticateToken,
  attachPositionAccess,
  deleteOrganizationController
);

/**
 * @swagger
 * /v2/organizations/units/{unit_id}:
 *   get:
 *     summary: Get a specific unit by ID
 *     tags:
 *       - Units
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unit_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the unit to retrieve
 *     responses:
 *       200:
 *         description: Unit retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                     type: object
 *                     properties:
 *                       unit_id:
 *                         type: string
 *                       unit_name:
 *                         type: string
 *                       unit_status:
 *                         type: string
 *                       organization_id:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date
 *                       positions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             position_id:
 *                               type: string
 *                             position_title:
 *                               type: string
 *                             position_status:
 *                               type: string
 *                             user_id:
 *                               type: string
 *                               nullable: true
 *       403:
 *         description: Forbidden - No access to this unit
 *       404:
 *         description: Unit not found
 */

organizationRoutes.get(
  '/units/:unit_id',
  authenticateToken,
  attachPositionAccess,
  getSingleUnitController
);

/**
 * @swagger
 * /v2/organizations/units/{unit_id}:
 *   patch:
 *     summary: Update a unit's name (within user's organization only)
 *     tags:
 *       - Units
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unit_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the unit to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_name:
 *                 type: string
 *                 description: New name for the unit
 *             required:
 *               - unit_name
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Unit'
 *       400:
 *         description: Validation error or bad request
 *       403:
 *         description: Forbidden - user not allowed to update this unit
 *       404:
 *         description: Unit not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 */

organizationRoutes.patch(
  '/units/:unit_id',
  authenticateToken,
  attachPositionAccess,
  validateBody(updateUnitSchema),
  updateUnitController
);

/**
 * @swagger
 * /v2/organizations/units/{unit_id}:
 *   delete:
 *     summary: Soft delete a unit by ID
 *     tags:
 *       - Units
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unit_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the unit to delete
 *     responses:
 *       200:
 *         description: Unit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unit deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User does not have permission to delete units or does not belong to the organization
 *       404:
 *         description: Not Found - Unit not found
 */

organizationRoutes.delete(
  '/units/:unit_id',
  authenticateToken,
  attachPositionAccess,
  deleteUnitController
);

/**
 * @swagger
 * /v2/organizations/positions/{position_id}:
 *   get:
 *     summary: Get a specific position by ID
 *     tags:
 *       - Position
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: position_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the position
 *     responses:
 *       200:
 *         description: Position retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Position'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 */

organizationRoutes.get(
  '/positions/:position_id',
  authenticateToken,
  attachPositionAccess,
  getSinglePositionController
);

/**
 * @swagger
 * /v2/organizations/positions/{position_id}:
 *   patch:
 *     summary: Update a position
 *     tags:
 *       - Position
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: position_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the position to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position_name:
 *                 type: string
 *               position_description:
 *                 type: string
 *               position_access:
 *                 $ref: '#/components/schemas/PositionAccess'
 *     responses:
 *       200:
 *         description: Position updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 */

organizationRoutes.patch(
  '/positions/:position_id',
  authenticateToken,
  attachPositionAccess,
  updatePositionController
);

/**
 * @swagger
 * /v2/organizations/{organization_id}/units:
 *   get:
 *     summary: Retrieve all units in a specific organization
 *     tags:
 *       - Organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organization_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the organization to retrieve units from
 *     responses:
 *       200:
 *         description: List of units retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unit retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       unit_id:
 *                         type: string
 *                         format: uuid
 *                       unit_name:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       organization_id:
 *                         type: string
 *                         format: uuid
 *                       status:
 *                         type: string
 *                         enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *                       positions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             position_id:
 *                               type: string
 *                             position_name:
 *                               type: string
 *                             position_description:
 *                               type: string
 *                             position_access:
 *                               type: object
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                             position_status:
 *                               type: string
 *       403:
 *         description: Forbidden - User does not have permission to view units of this organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to view units of this organization
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

organizationRoutes.get(
  '/:organization_id/units', 
  authenticateToken,
  attachPositionAccess,
  getUnitsInOrganization
);

/**
 * @swagger
 * /v2/organizations/positions:
 *   get:
 *     summary: Get all positions (optionally filtered by organization)
 *     tags:
 *       - Position
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Positions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: positions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       position_id:
 *                         type: string
 *                       position_name:
 *                         type: string
 *                       position_description:
 *                         type: string
 *                       position_access:
 *                         type: object
 *                         description: JSON object defining access permissions
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       user_id:
 *                         type: string
 *                         nullable: true
 *                       unit_id:
 *                         type: string
 *                       position_status:
 *                         type: string
 *                       unit:
 *                         type: object
 *                         properties:
 *                           unit_id:
 *                             type: string
 *                           unit_name:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           organization_id:
 *                             type: string
 *                           status:
 *                             type: string
 *                           organization:
 *                             type: object
 *                             properties:
 *                               organization_id:
 *                                 type: string
 *                               organization_name:
 *                                 type: string
 *                               street_address:
 *                                 type: string
 *                               organization_phone:
 *                                 type: string
 *                               organization_email:
 *                                 type: string
 *                               organization_logo:
 *                                 type: string
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               organization_customId:
 *                                 type: string
 *                               organization_status:
 *                                 type: string
 *       500:
 *         description: Server error
 */

organizationRoutes.get(
  '/positions',
  authenticateToken,
  attachPositionAccess,
  getPositionsController
);

/**
 * @swagger
 * /v2/organizations/{organization_id}:
 *   get:
 *     summary: Get a specific organization by ID
 *     tags:
 *       - Organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organization_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the organization
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     organization_id:
 *                       type: string
 *                       format: uuid
 *                     organization_name:
 *                       type: string
 *                     street_address:
 *                       type: string
 *                     organization_phone:
 *                       type: string
 *                     organization_email:
 *                       type: string
 *                     organization_logo:
 *                       type: string
 *                       format: uri
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     organization_customId:
 *                       type: string
 *                     organization_status:
 *                       type: string
 *                     units:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           unit_id:
 *                             type: string
 *                             format: uuid
 *                           unit_name:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           organization_id:
 *                             type: string
 *                             format: uuid
 *                           status:
 *                             type: string
 *             example:
 *               message: Organization retrieved successfully
 *               data:
 *                 organization_id: "88c42823-4039-4017-b6c1-162c8c1346e3"
 *                 organization_name: "Hab~Jass Shop"
 *                 street_address: "kigali"
 *                 organization_phone: "0786779666"
 *                 organization_email: "habibundayishimiye@gmail.com"
 *                 organization_logo: "https://res.cloudinary.com/daxuxhhxr/image/upload/v1752835554/Imotrak/organization_logo/go9uhbjur4givgnzjf9a.png"
 *                 created_at: "2025-07-18T10:45:55.103Z"
 *                 organization_customId: "ORG-20250718-AZIPLG"
 *                 organization_status: "ACTIVE"
 *                 units:
 *                   - unit_id: "1ba03d12-eef4-4371-88f8-079a3df4eab8"
 *                     unit_name: "Jass"
 *                     created_at: "2025-07-18T10:47:45.007Z"
 *                     organization_id: "88c42823-4039-4017-b6c1-162c8c1346e3"
 *                     status: "ACTIVE"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Organization not found
 */

organizationRoutes.get(
  '/:organization_id',
  authenticateToken,
  attachPositionAccess,
  getSingleOrganizationController
);

/**
 * @swagger
 * /v2/organizations/positions/{position_id}/assign:
 *   patch:
 *     summary: Assign a user to a position
 *     tags:
 *       - Position
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: position_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the position to assign a user to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: User successfully assigned to position
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User assigned to position successfully
 *                 data:
 *                   $ref: '#/components/schemas/Position'
 *       403:
 *         description: Forbidden – Not authorized to assign this position
 *       404:
 *         description: Position or user not found
 *       409:
 *         description: Conflict – Position already assigned
 */

organizationRoutes.patch(
  '/positions/:position_id/assign',
  authenticateToken,
  validateBody(assignUserToPositionSchema),
  attachPositionAccess,
  assignUserToPositionController
)

export default organizationRoutes;