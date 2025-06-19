import express from 'express';
import { HRController } from '../controllers/hr.controller';
import { authenticateHR } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HR Management
 *   description: HR operations for managing staff and fleet managers
 */

/**
 * @swagger
 * /hr/roles:
 *   get:
 *     summary: Get available roles for HR to assign
 *     tags: [HR Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of available roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *                   name:
 *                     type: string
 *                     example: "staff"
 *                   description:
 *                     type: string
 *                     example: "Staff member with basic permissions"
 *       '403':
 *         description: Forbidden – only HR users can access this endpoint
 */
router.get('/roles', authenticateHR, HRController.getAvailableRoles);

/**
 * @swagger
 * /hr/users:
 *   get:
 *     summary: Get all staff and fleet managers created by HR
 *     tags: [HR Management]
 *     security:
 *       - bearerAuth: []
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
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+250788123456"
 *                   nid:
 *                     type: string
 *                     example: "1199930098765432"
 *                   gender:
 *                     type: string
 *                     enum: [MALE, FEMALE]
 *                     example: "MALE"
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: "1990-04-15"
 *                   streetAddress:
 *                     type: string
 *                     example: "KN 7 Ave, Kigali"
 *                   role:
 *                     type: string
 *                     example: "staff"
 *                   organizationName:
 *                     type: string
 *                     example: "Acme Corp"
 *                   status:
 *                     type: string
 *                     example: "active"
 *       '403':
 *         description: Forbidden – only HR users can access this endpoint
 */
router.get('/users', authenticateHR, HRController.getAllUsers);

/**
 * @swagger
 * /hr/users/{id}:
 *   get:
 *     summary: Get a staff or fleet manager by ID
 *     tags: [HR Management]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 phone:
 *                   type: string
 *                 nid:
 *                   type: string
 *                 gender:
 *                   type: string
 *                   enum: [MALE, FEMALE]
 *                 dob:
 *                   type: string
 *                   format: date
 *                 streetAddress:
 *                   type: string
 *                 role:
 *                   type: string
 *                 organizationName:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden – only HR users can access this endpoint
 */
router.get('/users/:id', authenticateHR, HRController.getUserById);

/**
 * @swagger
 * /hr/users:
 *   post:
 *     summary: Create a new staff or fleet manager
 *     tags: [HR Management]
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
 *               - phone
 *               - nid
 *               - gender
 *               - dob
 *               - streetAddress
 *               - roleId
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+250788123456"
 *               nid:
 *                 type: string
 *                 example: "1199930098765432"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: "MALE"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-04-15"
 *               streetAddress:
 *                 type: string
 *                 example: "KN 7 Ave, Kigali"
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *                 description: Role ID for staff or fleetmanager
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phone:
 *                       type: string
 *                     nid:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                     dob:
 *                       type: string
 *                       format: date
 *                     streetAddress:
 *                       type: string
 *                     role:
 *                       type: string
 *                     organizationName:
 *                       type: string
 *                     status:
 *                       type: string
 *                 temporaryPassword:
 *                   type: string
 *                   example: "Abc123!@"
 *                   description: 8-character temporary password for the user
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Forbidden – only HR users can access this endpoint
 *       409:
 *         description: Conflict - email or NID already exists
 */
router.post('/users', authenticateHR, HRController.createUser);

/**
 * @swagger
 * /hr/users/{id}:
 *   put:
 *     summary: Update a staff or fleet manager
 *     tags: [HR Management]
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
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+250788123456"
 *               nid:
 *                 type: string
 *                 example: "1199930098765432"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: "MALE"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-04-15"
 *               streetAddress:
 *                 type: string
 *                 example: "KN 7 Ave, Kigali"
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *                 description: Role ID for staff or fleetmanager
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phone:
 *                       type: string
 *                     nid:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                     dob:
 *                       type: string
 *                       format: date
 *                     streetAddress:
 *                       type: string
 *                     role:
 *                       type: string
 *                     organizationName:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Forbidden – only HR users can access this endpoint
 *       404:
 *         description: User not found
 *       409:
 *         description: Conflict - email or NID already exists
 */
router.put('/users/:id', authenticateHR, HRController.updateUser);

/**
 * @swagger
 * /hr/users/{id}:
 *   delete:
 *     summary: Delete a staff or fleet manager
 *     tags: [HR Management]
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
 *       403:
 *         description: Forbidden – only HR users can access this endpoint
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', authenticateHR, HRController.deleteUser);

export default router; 