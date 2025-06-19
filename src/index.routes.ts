import { Router } from "express";
import Authrouter from "./auth/auth.routes";
import orgRoutes from "./admin/routes/organization.routes";
import userRoutes from "./admin/routes/user.routes";
import hrRoutes from "./HR/routes/hr.routes";
import vehicleRoutes from "./fleetmanager/routes/vehicle.routes";

const routes = Router()

routes.use('/org', orgRoutes);
routes.use('/auth', Authrouter);
routes.use('/users', userRoutes);
routes.use('/hr', hrRoutes);
routes.use('/fleetmanager/vehicles', vehicleRoutes);

export default routes;