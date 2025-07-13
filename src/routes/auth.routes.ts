// auth.routes.ts
import { Router } from 'express';
import { loginController } from '../controllers/auth.controllers';

const authROutes = Router();

/**
 * @swagger
 * /v2/auth/login:
 *   post:
 *     summary: User login with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: superadmin@tekinova.rw
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: supersecurepassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       position_id:
 *                         type: string
 *                       position_name:
 *                         type: string
 *                       unit_id:
 *                         type: string
 *                       unit_name:
 *                         type: string
 *                       organisation_id:
 *                         type: string
 *                       organization_name:
 *                         type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 */
authROutes.post('/login', loginController);

export default authROutes;
