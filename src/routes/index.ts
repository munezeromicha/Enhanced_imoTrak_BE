import { Router } from "express";
import authROutes from "./auth.routes";

const routes = Router();

routes.use('/auth', authROutes)

export default routes;