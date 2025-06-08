import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all HRs [Human Resources] (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, All]
 *         description: Filter users by status
 *       - in: query
 *         name: dobYear
 *         schema:
 *           type: string
 *           example: "1990"
 *         description: Filter users by year of birth (e.g. 1990)
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: string
 *         description: Filter users by role ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial match on first or last name
 *     responses:
 *       '200':
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                     example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *                   firstName:
 *                     type: string
 *                     example: "Alice"
 *                   lastName:
 *                     type: string
 *                     example: "Johnson"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "alice.johnson@example.com"
 *                   orgName:
 *                     type: string
 *                     example: "Acme Corp"
 *                   role:
 *                     type: string
 *                     example: "Admin"
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: "1990-04-15"
 *                   phone:
 *                     type: string
 *                     nullable: true
 *                     example: "+1234567890"
 *                   status:
 *                     type: string
 *                     example: "active"
 *       '403':
 *         description: Forbidden – only admins can access this endpoint
 */
router.get('/', authenticateAdmin, UserController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/users/:id', authenticateAdmin, UserController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new HR (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phone
 *               - nid
 *               - role
 *               - gender
 *               - dob
 *               - organizationId
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Uwakane"
 *               lastName:
 *                 type: string
 *                 example: "Dodiye"
 *               email:
 *                 type: string
 *                 example: "uwakane.dod@example.com"
 *               password:
 *                 type: string
 *                 example: "SecureP@ss123"
 *               phone:
 *                 type: string
 *                 example: "+250788123456"
 *               nid:
 *                 type: string
 *                 example: "1199930098765432"
 *               gender:
 *                 type: string
 *                 example: "Female"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-04-15"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               role:
 *                 type: string
 *                 example: "User"
 *               organizationId:
 *                 type: string
 *                 example: "60f7b6c95d2c4a1a7a5b1234"
 *               streetAddress:
 *                 type: string
 *                 example: "KN 7 Ave, Kigali"
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Forbidden
 */
router.post('/users', authenticateAdmin, UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a HR by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "updated.jane@example.com"
 *               phone:
 *                 type: string
 *                 example: "+250788000111"
 *               password:
 *                 type: string
 *                 example: "NewPass123!"
 *               role:
 *                 type: string
 *                 example: "Admin"
 *               status:
 *                 type: string
 *                 example: "Active"
 *               streetAddress:
 *                 type: string
 *                 example: "KG 541 St, Kigali"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id', authenticateAdmin, UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a HR by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', authenticateAdmin, UserController.delete);

export default router;
