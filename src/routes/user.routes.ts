import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { validateBody } from '../middlewares/bodyValidator';
import { createUserSchema } from '../schemas/user.schema';
import { createUserController, getUsersGroupedByUnitsController } from '../controllers/user.controllers';

const usersRoutes = Router();

/**
 * @swagger
 * /v2/users:
 *   post:
 *     summary: Create a new user and assign to a position
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User data with position assignment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - user_nid
 *               - user_phone
 *               - user_gender
 *               - user_dob
 *               - position_id
 *               - email
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               user_nid:
 *                 type: string
 *               user_phone:
 *                 type: string
 *                 description: Must be 10 to 15 characters
 *               user_gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               user_dob:
 *                 type: string
 *                 format: date
 *               street_address:
 *                 type: string
 *                 nullable: true
 *               position_id:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
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
 *                 data:
 *                   $ref: '#/components/schemas/User'  # define this schema in your Swagger components if you want
 *       400:
 *         description: Position not found, inactive, or position outside organization
 *       403:
 *         description: User lacks permission to create users
 *       409:
 *         description: User with this email, phone, or nid already exists
 *       500:
 *         description: Internal server error
 */

usersRoutes.post(
  '/',
  authenticateToken,
  attachPositionAccess,
  validateBody(createUserSchema),
  createUserController
);

/**
 * @swagger
 * /v2/users/:
 *   get:
 *     summary: Get users grouped by units in the same organization
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users grouped by their units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   unit_id:
 *                     type: string
 *                   unit_name:
 *                     type: string
 *                   users:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         user_gender:
 *                           type: string
 *                         user_phone:
 *                           type: string
 *                         position_id:
 *                           type: string
 *                         position_name:
 *                           type: string
 *       403:
 *         description: Forbidden - Access denied
 */

usersRoutes.get(
  '/',
  authenticateToken,
  attachPositionAccess,
  getUsersGroupedByUnitsController
);

export default usersRoutes;
