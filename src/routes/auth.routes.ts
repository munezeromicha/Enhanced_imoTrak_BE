// auth.routes.ts
import { Router } from 'express';
import { loginController, loginWithPositionController, logoutController } from '../controllers/auth.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';

const authRoutes = Router();

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
authRoutes.post('/login', loginController);

/**
 * @swagger
 * /v2/auth/{position_id}:
 *   post:
 *     summary: Login using position context
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: position_id
 *         in: path
 *         required: true
 *         description: ID of the position the user is logging in under
 *         schema:
 *           type: string
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
 *         description: Login successful with position context
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sign in successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     organization:
 *                       $ref: '#/components/schemas/Organization'
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     position:
 *                       $ref: '#/components/schemas/Position'
 *                     unit:
 *                       $ref: '#/components/schemas/Unit'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Position does not belong to user or is inactive
 */

/**
 * @swagger
 * /v2/auth/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT access token
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *                 data:
 *                   type: null
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         organization_id:
 *           type: string
 *         organization_name:
 *           type: string
 *         street_address:
 *           type: string
 *         organization_phone:
 *           type: string
 *         organization_email:
 *           type: string
 *         organization_logo:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         organization_customId:
 *           type: string
 *         organization_status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         user_nid:
 *           type: string
 *         user_phone:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         user_dob:
 *           type: string
 *           format: date
 *         user_photo:
 *           type: string
 *         user_gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         street_address:
 *           type: string
 *         auth_id:
 *           type: string
 *
 *     Position:
 *       type: object
 *       properties:
 *         position_id:
 *           type: string
 *         position_name:
 *           type: string
 *         position_description:
 *           type: string
 *         position_access:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               view:
 *                 type: boolean
 *               create:
 *                 type: boolean
 *               update:
 *                 type: boolean
 *               delete:
 *                 type: boolean
 *         position_status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *         created_at:
 *           type: string
 *           format: date-time
 *         user_id:
 *           type: string
 *         unit_id:
 *           type: string
 *
 *     Unit:
 *       type: object
 *       properties:
 *         unit_id:
 *           type: string
 *         unit_name:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *         organization_id:
 *           type: string
 */
authRoutes.post('/logout', authenticateToken, logoutController);

authRoutes.post('/:position_id', loginWithPositionController);



export default authRoutes;
