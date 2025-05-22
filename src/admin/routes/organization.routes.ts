import express from 'express';
import { registerOrganization } from '../controllers/organization.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Register a new organization (Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: University of Rwanda
 *               address:
 *                 type: string
 *                 example: KN 7 Ave, Kigali
 *               phone:
 *                 type: string
 *                 example: +250 798 234 675
 *               email:
 *                 type: string
 *                 example: universityofrwanda@ur.ac.rw
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       403:
 *         description: Forbidden
 */
router.post('/organizations', authenticateAdmin, registerOrganization);

export default router;
