import { Router } from "express";
import Authrouter from "./auth/auth.routes";
import orgRoutes from "./admin/routes/organization.routes";

const routes = Router()

routes.use('/org', orgRoutes);
routes.use('/auth', Authrouter);

export default routes;