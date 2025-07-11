import { Router } from 'express';
import organisationRoutes from './org.routes';
import unitRoutes from './unit.routes';
import positionRoutes from './position.routes';

const router = Router();

router.use('/', organisationRoutes);
router.use('/units', unitRoutes);
router.use('/positions', positionRoutes)

export default router;