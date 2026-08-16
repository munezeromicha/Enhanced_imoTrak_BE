import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import {
  approveInumaAccessController,
  assignInumaUserPositionController,
  listPendingInumaAccessController,
  previewInumaPositionsController,
  rejectInumaAccessController,
  syncInumaPositionsController,
} from '../controllers/inuma-access.controllers';

const inumaAccessRoutes = Router();

inumaAccessRoutes.get(
  '/positions/preview',
  authenticateToken,
  attachPositionAccess,
  previewInumaPositionsController
);

inumaAccessRoutes.post(
  '/sync-positions',
  authenticateToken,
  attachPositionAccess,
  syncInumaPositionsController
);

inumaAccessRoutes.get(
  '/pending',
  authenticateToken,
  attachPositionAccess,
  listPendingInumaAccessController
);

inumaAccessRoutes.post(
  '/:userId/approve',
  authenticateToken,
  attachPositionAccess,
  approveInumaAccessController
);

// Reassign an already-approved campus user to a different existing position.
inumaAccessRoutes.post(
  '/:userId/position',
  authenticateToken,
  attachPositionAccess,
  assignInumaUserPositionController
);

inumaAccessRoutes.post(
  '/:userId/reject',
  authenticateToken,
  attachPositionAccess,
  rejectInumaAccessController
);

export default inumaAccessRoutes;
