import { Router } from 'express';
import {
    handleCreateOrganization,
    handleGetAllOrganizations,
} from '../controllers/org.controllers';
import { upload } from '../middlewares/multer';
import {
    validateCreateOrganization,
} from '../middlewares/validationMiddlewares';

const organisationRoutes = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     tbl_organizations:
 *       type: object
 *       properties:
 *         organization_id:
 *           type: string
 *           format: uuid
 *           example: "8395c735-5a48-47b0-8cee-2e4f00516e03"
 *           description: Unique identifier for the organization
 *         organization_name:
 *           type: string
 *           example: "Acme Corp"
 *           description: Name of the organization
 *         street_address:
 *           type: string
 *           example: "123 Main St"
 *           description: Street address of the organization
 *         organization_phone:
 *           type: string
 *           example: "1234567890"
 *           description: Phone number of the organization
 *         organization_email:
 *           type: string
 *           format: email
 *           example: "admin@acme.com"
 *           description: Email address of the organization
 *         organization_logo:
 *           type: string
 *           format: uri
 *           example: "https://cdn.acme.com/logo.png"
 *           description: URL of the organization logo (optional)
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-10T20:31:18.391Z"
 *           description: Timestamp of when the organization was created
 *         organization_customId:
 *           type: string
 *           example: "ACME-001"
 *           description: Custom internal organization ID
 *         organization_status:
 *           type: string
 *           example: "ACTIVE"
 *           description: Status of the organization (e.g., ACTIVE, INACTIVE)
 */

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization management APIs
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               organization_name:
 *                 type: string
 *                 example: Acme Corp
 *               street_address:
 *                 type: string
 *                 example: 123 Main St
 *               organization_phone:
 *                 type: string
 *                 example: '1234567890'
 *               organization_email:
 *                 type: string
 *                 format: email
 *                 example: admin@acme.com
 *               organisation_logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for organization logo
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
 *                   example: Organization created successfully
 *                 data:
 *                   $ref: '#/components/schemas/tbl_organizations'
 *       500:
 *         description: Failed to create organization
 */

organisationRoutes.post('/', upload.single('organisation_logo'), validateCreateOrganization, handleCreateOrganization);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: A list of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organizations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/tbl_organizations'
 *       500:
 *         description: Failed to fetch organizations
 */

organisationRoutes.get('/', handleGetAllOrganizations);


export default organisationRoutes;