import { Router } from 'express';
import organisationRoutes from './org.routes';
import unitRoutes from './unit.routes';

const router = Router();

router.use('/', organisationRoutes);
router.use('/units', unitRoutes)

export default router;