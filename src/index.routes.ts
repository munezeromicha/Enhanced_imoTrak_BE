import { Router } from "express";
import Authrouter from "./auth/auth.routes";
import orgRoutes from "./admin/routes/organization.routes";
import userRoutes from "./admin/routes/user.routes";

const routes = Router()

routes.use('/org', orgRoutes);
routes.use('/auth', Authrouter);
routes.use('/users', userRoutes);

export default routes;