import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin-only user management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
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
router.get('/:id', authenticateAdmin, UserController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
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
 *               - username
 *               - password_hash
 *               - email
 *               - full_name
 *               - organization_id
 *               - role_id
 *             properties:
 *               username:
 *                 type: string
 *               password_hash:
 *                 type: string
 *               email:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               organization_id:
 *                 type: string
 *               role_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticateAdmin, UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *               role_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticateAdmin, UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticateAdmin, UserController.delete);

export default router;
