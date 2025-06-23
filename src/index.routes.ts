import { Router } from "express";
import Authrouter from "./auth/auth.routes";
import orgRoutes from "./admin/routes/organization.routes";
import userRoutes from "./admin/routes/user.routes";
import hrRoutes from "./HR/routes/hr.routes";
import vehicleRoutes from "./fleetmanager/routes/vehicle.routes";
import staffRoutes from "./staffmember/routes/request.routes";
import fleetRequestRoutes from "./fleetmanager/routes/request.routes";
import notificationRouter from "./fleetmanager/routes/vehicle.routes";

const routes = Router()

routes.use('/org', orgRoutes);
routes.use('/auth', Authrouter);
routes.use('/users', userRoutes);
routes.use('/hr', hrRoutes);
routes.use('/fleetmanager/vehicles', vehicleRoutes);
routes.use('/fleetmanager/requests', fleetRequestRoutes)
routes.use('/fleetmanager/notification', notificationRouter);
routes.use('/staff', staffRoutes);

export default routes;