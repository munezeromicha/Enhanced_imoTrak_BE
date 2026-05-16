import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { validateBody } from '../middlewares/bodyValidator';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { createUserController, deleteUserController, getAllUnverifiedUsersController, getSingleUnverifiedUserController, getSingleUserWithPositionsController, getUsersWithPositionsController, updateMyProfileController, updateUserController } from '../controllers/user.controllers';
import { upload } from '../middlewares/multer';

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
 *     summary: Get users and their positions, units, and organizations
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organization_id
 *         schema:
 *           type: string
 *         description: Optional organization ID to filter users by organization
 *     responses:
 *       200:
 *         description: List of users with their positions, units, and organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       user_gender:
 *                         type: string
 *                         enum: [MALE, FEMALE]
 *                       user_phone:
 *                         type: string
 *                       positions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             position_id:
 *                               type: string
 *                             position_name:
 *                               type: string
 *                             position_description:
 *                               type: string
 *                             position_status:
 *                               type: string
 *                               enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *                             unit:
 *                               type: object
 *                               properties:
 *                                 unit_id:
 *                                   type: string
 *                                 unit_name:
 *                                   type: string
 *                                 organization:
 *                                   type: object
 *                                   properties:
 *                                     organization_id:
 *                                       type: string
 *                                     organization_name:
 *                                       type: string
 *                                     organization_email:
 *                                       type: string
 *                                     organization_phone:
 *                                       type: string
 *       403:
 *         description: Forbidden - Access denied
 */

usersRoutes.get(
  '/',
  authenticateToken,
  attachPositionAccess,
  getUsersWithPositionsController
);

/**
 * @swagger
 * /v2/users/{user_id}:
 *   get:
 *     summary: Get a single user's profile with positions, unit, and organization
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     user_gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                     user_phone:
 *                       type: string
 *                     street_address:
 *                       type: string
 *                     user_dob:
 *                       type: string
 *                       format: date-time
 *                     user_nid:
 *                       type: string
 *                     user_photo:
 *                       type: string
 *                       nullable: true
 *                     positions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           position_id:
 *                             type: string
 *                           position_name:
 *                             type: string
 *                           position_description:
 *                             type: string
 *                           position_status:
 *                             type: string
 *                             enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *                           unit:
 *                             type: object
 *                             properties:
 *                               unit_id:
 *                                 type: string
 *                               unit_name:
 *                                 type: string
 *                               organization:
 *                                 type: object
 *                                 properties:
 *                                   organization_id:
 *                                     type: string
 *                                   organization_name:
 *                                     type: string
 *                                   organization_email:
 *                                     type: string
 *                                   organization_phone:
 *                                     type: string
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: User not found
 */

usersRoutes.get(
  '/:user_id',
  authenticateToken,
  attachPositionAccess,
  getSingleUserWithPositionsController
);

// Self-service profile update (authenticated user)
usersRoutes.patch(
  '/me',
  authenticateToken,
  upload.single('user_photo'),
  validateBody(updateUserSchema),
  updateMyProfileController
);

/**
 * @swagger
 * /v2/users/{user_id}:
 *   patch:
 *     summary: Update an existing user's personal profile information
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user to update
 *     requestBody:
 *       description: Fields to update in user profile (partial allowed)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     user_gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                     user_phone:
 *                       type: string
 *                     positions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           position_id:
 *                             type: string
 *                             format: uuid
 *                           position_name:
 *                             type: string
 *                           position_description:
 *                             type: string
 *                           position_status:
 *                             type: string
 *                             enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *                           unit:
 *                             type: object
 *                             properties:
 *                               unit_id:
 *                                 type: string
 *                                 format: uuid
 *                               unit_name:
 *                                 type: string
 *                               organization:
 *                                 type: object
 *                                 properties:
 *                                   organization_id:
 *                                     type: string
 *                                     format: uuid
 *                                   organization_name:
 *                                     type: string
 *                                   organization_email:
 *                                     type: string
 *                                     format: email
 *                                   organization_phone:
 *                                     type: string
 *       400:
 *         description: Invalid request or user not found
 *       403:
 *         description: Forbidden - no permission to update user
 *       500:
 *         description: Internal server error
 */

usersRoutes.patch(
  '/:user_id',
  authenticateToken,
  attachPositionAccess,
  validateBody(updateUserSchema),
  updateUserController
);

usersRoutes.delete(
  '/:user_id',
  authenticateToken,
  attachPositionAccess,
  deleteUserController
);

/**
 * @openapi
 * /api/users/unverified/{organization_id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all unverified user from an organization
 *     description: Returns all unverified users along with their positions, units, and organization details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organization_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the organization to filter unverified users by
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     user_gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                     user_phone:
 *                       type: string
 *                     positions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           position_id:
 *                             type: string
 *                           position_name:
 *                             type: string
 *                           position_description:
 *                             type: string
 *                           position_status:
 *                             type: string
 *                             enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *                           unit:
 *                             type: object
 *                             properties:
 *                               unit_id:
 *                                 type: string
 *                               unit_name:
 *                                 type: string
 *                               organization:
 *                                 type: object
 *                                 properties:
 *                                   organization_id:
 *                                     type: string
 *                                   organization_name:
 *                                     type: string
 *                                   organization_email:
 *                                     type: string
 *                                   organization_phone:
 *                                     type: string
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: Organization has to be specified or no unverified user found
 *       400:
 *         description: User is already verified
  */
 usersRoutes.get(
  '/unverified/:organization_id',
  authenticateToken,
  attachPositionAccess,
  getAllUnverifiedUsersController
);

/**
 * @openapi
 * /api/users/unverified/{organization_id}/user_id:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a single unverified user from an organization
 *     description: Returns the first unverified user in the specified organization, including their position, unit, and organization details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organization_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the organization to search for unverified users
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     user_gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                     user_phone:
 *                       type: string
 *                     positions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           position_id:
 *                             type: string
 *                           position_name:
 *                             type: string
 *                           position_description:
 *                             type: string
 *                           position_status:
 *                             type: string
 *                             enum: [ACTIVE, INACTIVE, DELETED, SUSPENDED]
 *                           unit:
 *                             type: object
 *                             properties:
 *                               unit_id:
 *                                 type: string
 *                               unit_name:
 *                                 type: string
 *                               organization:
 *                                 type: object
 *                                 properties:
 *                                   organization_id:
 *                                     type: string
 *                                   organization_name:
 *                                     type: string
 *                                   organization_email:
 *                                     type: string
 *                                   organization_phone:
 *                                     type: string
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: Organization has to be specified or no unverified user found
 *       400:
 *         description: User is already verified
 */
usersRoutes.get(
  '/unverified/:organization_id/:user_id',
  authenticateToken,
  attachPositionAccess,
  getSingleUnverifiedUserController
);

export default usersRoutes;
