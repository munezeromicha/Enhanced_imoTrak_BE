import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/Error';
import { position_accesses } from '../types/access';
import {
  approveInumaAccessRequest,
  listPendingInumaAccessRequests,
  reassignInumaUserPosition,
  rejectInumaAccessRequest,
} from '../services/inuma-approval.service';
import {
  getInumaPositionsPreview,
  syncInumaPositionsCatalog,
} from '../services/inuma-positions-sync.service';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access?: position_accesses;
  };
}

export async function listPendingInumaAccessController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const unitId =
      typeof req.query.unit_id === 'string' ? req.query.unit_id : undefined;

    const requests = await listPendingInumaAccessRequests({
      approverUserId: req.user!.user_id,
      unitId,
    });

    res.status(200).json({
      message: 'Pending access requests retrieved',
      data: requests,
    });
  } catch (error) {
    next(error);
  }
}

export async function approveInumaAccessController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    if (!userId) throw new AppError('Missing user id', 400);

    const positionId =
      typeof req.body?.position_id === 'string' ? req.body.position_id : undefined;

    const user = await approveInumaAccessRequest({
      approverUserId: req.user!.user_id,
      targetUserId: userId,
      positionId,
    });

    res.status(200).json({
      message: 'User access approved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function assignInumaUserPositionController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    if (!userId) throw new AppError('Missing user id', 400);

    const positionId =
      typeof req.body?.position_id === 'string' ? req.body.position_id : '';
    if (!positionId) throw new AppError('position_id is required', 400);

    const user = await reassignInumaUserPosition({
      approverUserId: req.user!.user_id,
      targetUserId: userId,
      positionId,
    });

    res.status(200).json({
      message: 'Position assigned successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectInumaAccessController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    if (!userId) throw new AppError('Missing user id', 400);

    const result = await rejectInumaAccessRequest({
      approverUserId: req.user!.user_id,
      targetUserId: userId,
    });

    res.status(200).json({
      message: 'User access request rejected',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function previewInumaPositionsController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const positions = await getInumaPositionsPreview();
    res.status(200).json({
      message: 'Inuma positions preview retrieved',
      data: positions,
      count: positions.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function syncInumaPositionsController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId =
      typeof req.body?.organization_id === 'string'
        ? req.body.organization_id
        : req.user!.organization_id;

    const result = await syncInumaPositionsCatalog({
      approverUserId: req.user!.user_id,
      organizationId,
    });

    res.status(200).json({
      message: 'Inuma positions synced successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
