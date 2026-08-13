// auth.routes.ts
import { Router } from 'express';
import { forgotPasswordController, loginController, loginWithPositionController, logoutController, resendInvitationController, setPasswordAndVerifyController, ssoLoginController, ssoLoginWithPositionController, updatePasswordController, verifyUserByEmailController } from '../controllers/auth.controllers';
import { authenticateToken, authenticateVerifyToken } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/bodyValidator';
import { setPasswordAndVerifySchema, updatePasswordSchema } from '../schemas/auth.schema';
import { assignUserToPositionSchema } from '../schemas/position.schema';
import { AppError } from '../utils/Error';

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
 * /v2/auth/sso:
 *   post:
 *     summary: Exchange a validated UR SSO token for ImoTrak positions
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_token:
 *                 type: string
 *               access_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: SSO identity mapped to local positions
 *       401:
 *         description: Invalid SSO token
 *       403:
 *         description: Account not provisioned or has no position
 */
authRoutes.post('/sso', ssoLoginController);
authRoutes.post('/sso/login', ssoLoginController);

/**
 * @swagger
 * /v2/auth/sso/{position_id}:
 *   post:
 *     summary: Complete UR SSO login with an ImoTrak position
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: position_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
authRoutes.post('/sso/:position_id', ssoLoginWithPositionController);

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

/**
 * @swagger
 * /v2/auth/update-password:
 *   patch:
 *     summary: Update the authenticated user's password
 *     description: Allows a logged-in user to update their password by providing their current password and a new one.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: old_password123
 *               newPassword:
 *                 type: string
 *                 example: new_secure_password456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     auth_id:
 *                       type: string
 *                       format: uuid
 *                       example: 0b35ee08-af58-4a22-b85f-fbd6c5160454
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: superadmin@tekinova.rw
 *                     updated_at:
 *                       type: string
 *                       nullable: true
 *                       format: date-time
 *                       example: null
 *                     user_status:
 *                       type: string
 *                       enum: [ACTIVE, INACTIVE, SUSPENDED]
 *                       example: ACTIVE
 *       401:
 *         description: Invalid current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 */

authRoutes.patch(
    '/update-password',
    authenticateToken,
    validateBody(updatePasswordSchema),
    updatePasswordController
);

/**
 * @swagger
 * /v2/auth/forgot-password:
 *   post:
 *     summary: Reset password for a user account
 *     description: Generates a new random password and emails it to the user if the account exists and is active.
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *       404:
 *         description: Account not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       400:
 *         description: Request body validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 */


/**
 * @swagger
 * /v2/auth/verify:
 *   get:
 *     summary: Verify a user's email using an invitation token
 *     description: Verifies the user's account using a JWT token provided via email. If the user is already verified, a conflict is returned. If successful, a new access token is returned, and the invitation token is blacklisted.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT invitation token sent via email
 *     responses:
 *       200:
 *         description: User verified successfully and access token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User verified successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is required and must be a string
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid invitation or expired
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       409:
 *         description: User is already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is already verified
 */

authRoutes.get('/verify', authenticateVerifyToken, verifyUserByEmailController);

/**
 * @swagger
 * /v2/auth/set-password-and-verify:
 *   post:
 *     summary: Set account password and verify user account
 *     description: >
 *       Allows a user to set their password and verify their account using a valid token. 
 *       This endpoint requires an access token passed in the `Authorization` header (Bearer token).
 *       If the account is already verified, it will return a 409 conflict.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Account verified and password set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verified and password set successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     auth_id:
 *                       type: string
 *                       format: uuid
 *                       example: 1a2b3c4d-5e6f-7890-abcd-1234567890ef
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-06T12:00:00.000Z
 *                     user_status:
 *                       type: string
 *                       enum: [ACTIVE, INACTIVE, SUSPENDED]
 *                       example: ACTIVE
 *       400:
 *         description: Missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password is required and must be a string
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is required and must be a string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       409:
 *         description: Account is already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account is already verified
 */

authRoutes.post('/set-password-and-verify', authenticateToken, validateBody(setPasswordAndVerifySchema), setPasswordAndVerifyController);

authRoutes.post('/forgot-password', validateBody(assignUserToPositionSchema), forgotPasswordController)

/**
 * @swagger
 * /v2/auth/resend-invitation:
 *   post:
 *     summary: Resend invitation link to user
 *     description: Resends the invitation email containing a new JWT token if the user is not verified.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Invitation link resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invitation link resent successfully
 *       400:
 *         description: Missing email in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       409:
 *         description: User is already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is already verified
 */

authRoutes.post('/resend-invitation', resendInvitationController);

authRoutes.post('/:position_id', loginWithPositionController);



export default authRoutes;
