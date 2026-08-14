import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';
import {
  approveInumaAccessController,
  listPendingInumaAccessController,
  rejectInumaAccessController,
} from '../controllers/inuma-access.controllers';

const inumaAccessRoutes = Router();

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

inumaAccessRoutes.post(
  '/:userId/reject',
  authenticateToken,
  attachPositionAccess,
  rejectInumaAccessController
);

export default inumaAccessRoutes;
