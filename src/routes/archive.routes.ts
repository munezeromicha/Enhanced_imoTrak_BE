import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { requireHubSuperAdmin } from '../middlewares/requirePermission';
import {
  listArchiveController,
  permanentlyDeleteOrganizationController,
  permanentlyDeletePositionController,
  permanentlyDeleteUnitController,
  restoreOrganizationController,
  restorePositionController,
  restoreUnitController,
} from '../controllers/archive.controller';

const archiveRoutes = Router();

archiveRoutes.use(authenticateToken, attachPositionAccess, requireHubSuperAdmin());

/**
 * @swagger
 * /v2/archive:
 *   get:
 *     summary: List archived organizations, units, and positions
 *     tags: [Archive]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archived items retrieved
 *       403:
 *         description: Hub SuperAdmin only
 */
archiveRoutes.get('/', listArchiveController);

archiveRoutes.post('/organizations/:id/restore', restoreOrganizationController);
archiveRoutes.delete('/organizations/:id', permanentlyDeleteOrganizationController);

archiveRoutes.post('/units/:id/restore', restoreUnitController);
archiveRoutes.delete('/units/:id', permanentlyDeleteUnitController);

archiveRoutes.post('/positions/:id/restore', restorePositionController);
archiveRoutes.delete('/positions/:id', permanentlyDeletePositionController);

export default archiveRoutes;
