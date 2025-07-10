import { Router } from 'express';
import { handleCreateOrganization } from '../controllers/index.controllers';
import { upload } from '../middlewares/multer';
import { validateCreateOrganization } from '../middlewares/validateCreateOrg';

const router = Router();

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

router.post('/', upload.single('organisation_logo'), validateCreateOrganization, handleCreateOrganization);

export default router;