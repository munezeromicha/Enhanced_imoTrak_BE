import express from 'express';
import { handleLogin, showRoles} from './auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const Authrouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user (or Super Admin)
 *     tags: [Auth]
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
 *                 example: admin@imotarak.rw
 *               password:
 *                 type: string
 *                 example: SuperSecure123!
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
Authrouter.post('/login', handleLogin);

/**
 * @swagger
 * /auth/roles:
 *   get:
 *     summary: Retrieve all system roles
 *     description: Returns a list of available roles in the system.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "9f0c0a7b-2f7e-4c4d-9b7e-5bc3cfb24f43"
 *                       name:
 *                         type: string
 *                         example: "admin"
 *                       description:
 *                         type: string
 *                         example: "System Super Admin with all privileges"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */
Authrouter.get('/roles', authenticateToken, showRoles);
export default Authrouter;