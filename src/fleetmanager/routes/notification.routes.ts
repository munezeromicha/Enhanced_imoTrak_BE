import express from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateFleetManager} from '../../middleware/auth.middleware';
import { authenticateAdmin } from '../../middleware/auth.middleware';

const notificationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management and delivery
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications (fleet manager only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       403:
 *         description: Forbidden – only fleet managers can access this endpoint
 */
notificationRouter.get('/', authenticateAdmin, NotificationController.getAll);

/**
 * @swagger
 * /staff/notification/mark-all-read:
 *   post:
 *     summary: Mark all current user's notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All notifications marked as read"
 *       403:
 *         description: Forbidden – only authenticated staff can access this endpoint
 */
notificationRouter.post('/mark-all-read', authenticateFleetManager, NotificationController.markAllAsRead);

/**
 * @swagger
 * /staff/notification/mark:
 *   post:
 *     summary: Mark a specific notification as read or unread
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notificationId
 *               - read
 *             properties:
 *               notificationId:
 *                 type: string
 *                 format: uuid
 *                 example: "d74e4ac9-1234-4a2e-9999-abcd12345678"
 *               read:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notification status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read"
 *       403:
 *         description: Forbidden – only authenticated staff can access this endpoint
 */
notificationRouter.post('/mark', authenticateFleetManager, NotificationController.markAs);

/**
 * @swagger
 * /staff/notification/send:
 *   post:
 *     summary: Send a new notification (fleet manager only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - title
 *               - body
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *                 example: "a8b2c3d4-5678-9abc-def0-123456789abc"
 *               title:
 *                 type: string
 *                 example: "Trip Approved"
 *               body:
 *                 type: string
 *                 example: "Your trip request #12345 has been approved."
 *               data:
 *                 type: object
 *                 additionalProperties: true
 *                 example: { "tripId": "12345", "action": "approved" }
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification sent"
 *       403:
 *         description: Forbidden – only fleet managers can access this endpoint
 */
notificationRouter.post('/send', authenticateAdmin, NotificationController.send);

/**
 * @swagger
 * /staff/notification/user:
 *   get:
 *     summary: Get current user's notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user-specific notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       403:
 *         description: Forbidden – only authenticated staff can access this endpoint
 */
notificationRouter.get('/user', authenticateFleetManager, NotificationController.getUserNotifications);

export default notificationRouter;
