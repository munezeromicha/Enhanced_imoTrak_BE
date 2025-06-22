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

export default fleetRequestRoutes;