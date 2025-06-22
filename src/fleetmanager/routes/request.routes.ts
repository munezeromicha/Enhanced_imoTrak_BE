import { Router } from "express";
import { authenticateFleetManager } from "../../middleware/auth.middleware";
import { FleetRequestController } from "../controllers/request.controller";

const fleetRequestRoutes = Router();

/**
 * @swagger
 * /fleetmanager/requests:
 *   get:
 *     summary: Get all fleet requests
 *     description: Retrieves all fleet requests made by staff, including related vehicle and requester info.
 *     tags:
 *       - Fleet Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of fleet requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   vehicle_id:
 *                     type: string
 *                     nullable: true
 *                   requested_at:
 *                     type: string
 *                     format: date-time
 *                   trip_purpose:
 *                     type: string
 *                   start_location:
 *                     type: string
 *                   end_location:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *                   reviewed_at:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   comments:
 *                     type: string
 *                     nullable: true
 *                   requester_id:
 *                     type: string
 *                   reviewed_by:
 *                     type: string
 *                     nullable: true
 *                   full_name:
 *                     type: string
 *                   passengers_number:
 *                     type: integer
 *                   vehicle:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: string
 *                       plate_number:
 *                         type: string
 *                       vehicle_type:
 *                         type: string
 *                       vehicle_model:
 *                         type: string
 *                       manufacturer:
 *                         type: string
 *                         nullable: true
 *                       year:
 *                         type: integer
 *                         nullable: true
 *                       capacity:
 *                         type: integer
 *                         nullable: true
 *                       status:
 *                         type: string
 *                   requester:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       email:
 *                         type: string
 *       403:
 *         description: Unauthorized - missing or invalid role
 *       500:
 *         description: Internal server error
 */


fleetRequestRoutes.route('/')
    .get(authenticateFleetManager, FleetRequestController.getRequest);


/**
 * @swagger
 * /fleetmanager/requests/approve:
 *   post:
 *     summary: Approve a fleet request
 *     description: Approves a pending fleet request by assigning an available vehicle from the manager's organization.
 *     tags:
 *       - Fleet Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *               - vehicleId
 *             properties:
 *               requestId:
 *                 type: string
 *                 example: "dbe11b3e-52f7-49f5-b7e0-267847e89361"
 *               vehicleId:
 *                 type: string
 *                 example: "5b9b5fbd-4b35-4646-bb93-60a4d8120f1e"
 *     responses:
 *       200:
 *         description: Request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     vehicle_id:
 *                       type: string
 *                     reviewed_at:
 *                       type: string
 *                       format: date-time
 *                     reviewed_by:
 *                       type: string
 *       400:
 *         description: Missing required fields (requestId or vehicleId)
 *       403:
 *         description: Unauthorized or invalid role
 *       404:
 *         description: Request or vehicle not found
 *       409:
 *         description: Request is not pending or vehicle is unavailable
 *       500:
 *         description: Internal server error
 */

fleetRequestRoutes.route('/approve')
  .post(authenticateFleetManager, FleetRequestController.approveRequest);


/**
 * @swagger
 * /fleetmanager/requests/reject:
 *   post:
 *     summary: Reject a fleet request
 *     description: Fleet managers can reject pending requests in their organization with a comment.
 *     tags:
 *       - Fleet Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *               - comment
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: ID of the request to reject
 *               comment:
 *                 type: string
 *                 description: Reason for rejection
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *       400:
 *         description: Invalid input or business rule violation
 *       403:
 *         description: Unauthorized or organization mismatch
 *       404:
 *         description: Request or manager not found
 *       500:
 *         description: Internal server error
 */

fleetRequestRoutes
  .route('/reject')
  .post(authenticateFleetManager, FleetRequestController.rejectRequest);


export default fleetRequestRoutes;