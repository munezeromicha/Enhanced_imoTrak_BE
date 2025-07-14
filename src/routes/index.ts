import { Router } from "express";
import authRoutes from "./auth.routes";
import organizationRoutes from "./organization.routes";

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/organizations', organizationRoutes);
export default routes;