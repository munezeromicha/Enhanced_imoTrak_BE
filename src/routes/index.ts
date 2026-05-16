import { Router } from "express";
import authRoutes from "./auth.routes";
import organizationRoutes from "./organization.routes";
import usersRoutes from "./user.routes";
import vehicleRoutes from "./vehicle.routes";
import reservationRoutes from "./reservation.routes"
import issueRoutes from "./vehicleIssue.routes";
import notificationRoutes from './notification.routes';
import historyRoutes from "./audit.routes";
import contactRoutes from "./contact.route";

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/organizations', organizationRoutes);
routes.use('/users', usersRoutes);
routes.use('/', vehicleRoutes);
routes.use('/', historyRoutes);
routes.use('/reservations', reservationRoutes);
routes.use('/issues', issueRoutes);
routes.use('/notifications', notificationRoutes);
routes.use('/contacts', contactRoutes);

export default routes;