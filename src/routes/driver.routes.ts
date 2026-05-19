
import { Router } from 'express';
import * as controller from '../controllers/driver.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';

const driverRoutes = Router();

// Retrieve self driver context (must be before :id to prevent conflict)
driverRoutes.get('/self', authenticateToken, attachPositionAccess, controller.getSelfDriverProfile as any);

// Core Driver CRUD endpoints
driverRoutes.get('/', authenticateToken, attachPositionAccess, controller.getAllDrivers as any);
driverRoutes.post('/', authenticateToken, attachPositionAccess, controller.createDriver as any);
driverRoutes.get('/:id', authenticateToken, attachPositionAccess, controller.getDriverById as any);
driverRoutes.put('/:id', authenticateToken, attachPositionAccess, controller.updateDriver as any);

// Driver Trip & Status endpoints
driverRoutes.get('/:id/trip-history', authenticateToken, attachPositionAccess, controller.getDriverTripHistory as any);
driverRoutes.get('/:id/active-trip', authenticateToken, attachPositionAccess, controller.getDriverActiveTrip as any);

export default driverRoutes;
