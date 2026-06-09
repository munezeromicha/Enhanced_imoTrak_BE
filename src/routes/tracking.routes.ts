import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import {
  getFleetOverviewController,
  getVehicleTrackingDetailController,
  getVehicleTrackHistoryController,
  getTrackingDashboardController,
  reverseGeocodeController,
} from '../controllers/tracking.controller';

const trackingRoutes = Router();

trackingRoutes.use(authenticateToken, attachPositionAccess);

trackingRoutes.get('/fleet', getFleetOverviewController);
trackingRoutes.get('/dashboard', getTrackingDashboardController);
trackingRoutes.get('/geocode/reverse', reverseGeocodeController);
trackingRoutes.get('/vehicles/:vehicleId', getVehicleTrackingDetailController);
trackingRoutes.get('/vehicles/:vehicleId/tracks', getVehicleTrackHistoryController);

export default trackingRoutes;
