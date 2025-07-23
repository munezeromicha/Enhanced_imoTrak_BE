import { NextFunction, Request, Response, RequestHandler,Router } from 'express';
import { getUserNotifications, deleteNotification, sendNotification } from '../controllers/notification.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/bodyValidator';
import { createNotificationSchema } from '../schemas/notification.schema';
import { AuthenticatedRequest } from '../types/access';


function withAuthUser(handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => any): RequestHandler {
    return (req, res, next) => handler(req as AuthenticatedRequest, res, next);
  }

const router = Router();

/**
 * @swagger
 * /v2/notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */
router.get('/', authenticateToken, withAuthUser(getUserNotifications));

/**
 * @swagger
 * /v2/notifications/{id}:
 *   delete:
 *     summary: Mark notification as read (delete)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification deleted
 */
router.delete('/:id', authenticateToken, withAuthUser(deleteNotification));

/**
 * @swagger
 * /v2/notifications:
 *   post:
 *     summary: Send a notification (for testing)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification sent
 */
router.post('/', authenticateToken, validateBody(createNotificationSchema), withAuthUser(sendNotification));

export default router; 