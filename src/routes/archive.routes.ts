import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import { attachAuthContext, requirePermission } from '../middlewares/requirePermission';
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

const ARCHIVE_PAGE_ACCESS = [
  'archive.view',
  'archive.organizations',
  'archive.units',
  'archive.positions',
];

archiveRoutes.use(authenticateToken, attachPositionAccess, attachAuthContext());

/**
 * @swagger
 * /v2/archive:
 *   get:
 *     summary: List archived organizations, units, and positions in the caller's scope
 *     tags: [Archive]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archived items retrieved
 *       403:
 *         description: Missing archive permission
 */
archiveRoutes.get('/', requirePermission(ARCHIVE_PAGE_ACCESS), listArchiveController);

archiveRoutes.post(
  '/organizations/:id/restore',
  requirePermission('archive.restore'),
  restoreOrganizationController
);
archiveRoutes.delete(
  '/organizations/:id',
  requirePermission('archive.delete'),
  permanentlyDeleteOrganizationController
);

archiveRoutes.post(
  '/units/:id/restore',
  requirePermission('archive.restore'),
  restoreUnitController
);
archiveRoutes.delete(
  '/units/:id',
  requirePermission('archive.delete'),
  permanentlyDeleteUnitController
);

archiveRoutes.post(
  '/positions/:id/restore',
  requirePermission('archive.restore'),
  restorePositionController
);
archiveRoutes.delete(
  '/positions/:id',
  requirePermission('archive.delete'),
  permanentlyDeletePositionController
);

export default archiveRoutes;
