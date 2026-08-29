import { Router } from 'express';
import { fetchAuditLogs, createAuditLog } from '../controllers/auditController';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { requirePermission } from '../middlewares/requirePermission';

const historyRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Audit Logs
 *     description: API for viewing and managing audit logs
 *
 * components:
 *   schemas:
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the audit log
 *         email:
 *           type: string
 *           description: Email of the user who performed the action
 *         action:
 *           type: string
 *           description: Action performed by the user
 *         table_name:
 *           type: string
 *           description: Table affected by the action
 *         record_id:
 *           type: string
 *           description: ID of the affected record
 *         old_value:
 *           type: object
 *           description: Previous state of the record
 *         new_value:
 *           type: object
 *           description: New state of the record
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the action happened
 *         ip_address:
 *           type: string
 *         user_agent:
 *           type: string
 */


/**
 * @swagger
 * /v2/history:
 *   get:
 *     summary: Retrieve audit logs with optional filters
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user's name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by user's email
 *       - in: query
 *         name: organization
 *         schema:
 *           type: string
 *         description: Filter by organization name
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved audit logs
 */
// Reading the activity log is an administrative act: it requires the users
// module's view permission, and the service pins it to the caller's tenant.
historyRoutes.get(
  '/history',
  authenticateToken,
  attachPositionAccess,
  requirePermission('users.view'),
  fetchAuditLogs
);
historyRoutes.post(
  '/history',
  authenticateToken,
  attachPositionAccess,
  requirePermission('users.update'),
  createAuditLog
);


export default historyRoutes;
