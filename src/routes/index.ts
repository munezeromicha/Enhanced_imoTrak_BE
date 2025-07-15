import { Router } from "express";
import authRoutes from "./auth.routes";
import organizationRoutes from "./organization.routes";
import usersRoutes from "./user.routes";
import vehicleRoutes from "./vehicle.routes";

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/organizations', organizationRoutes);
routes.use('/users', usersRoutes)
routes.use('/', vehicleRoutes);

export default routes;