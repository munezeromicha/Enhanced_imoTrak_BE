import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { Request, Response, NextFunction } from "express";
import { fleetRequest } from "../services/request.service";

export const FleetRequestController = {
    getRequest: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if(!req.user!.role)
                res.status(403).json({message: "Unauthorized"})
            const requests = await fleetRequest.getRequests(req.user!.id);   
            res.status(200).json(requests)
        } catch (error) {
            next(error)
        }
    },

    approveRequest: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const managerId = req.user?.id;
            const { requestId, vehicleId } = req.body;

            // Check if user is authenticated and has a role
            if (!req.user?.role) {
            return res.status(403).json({ message: "Unauthorized" });
            }

            if (!requestId || !vehicleId) {
            return res.status(400).json({ message: "requestId and vehicleId are required" });
            }

            const approvedRequest = await fleetRequest.approveRequest(requestId, managerId, vehicleId);
            return res.status(200).json({
            message: "Request approved successfully",
            data: approvedRequest
            });
        } catch (error) {
            next(error);
        }
    }
}


