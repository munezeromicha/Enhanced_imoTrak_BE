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
    }
}


