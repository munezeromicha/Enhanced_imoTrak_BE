import { Response, NextFunction } from 'express';
import { AppError } from '../utils/Error';
import { type AuthorizedRequest } from '../middlewares/requirePermission';
import {
  listArchivedItemsService,
  permanentlyDeleteArchivedOrganizationService,
  permanentlyDeleteArchivedPositionService,
  permanentlyDeleteArchivedUnitService,
  restoreOrganizationService,
  restorePositionService,
  restoreUnitService,
} from '../services/archive.service';

function actorId(req: AuthorizedRequest): string {
  if (!req.user?.user_id) {
    throw new AppError('Authentication required', 401);
  }
  return req.user.user_id;
}

export async function listArchiveController(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await listArchivedItemsService();
    res.status(200).json({
      message: 'Archived items retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function restoreOrganizationController(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await restoreOrganizationService(req.params.id);
    res.status(200).json({
      message: 'Organization restored successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function restoreUnitController(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await restoreUnitService(req.params.id);
    res.status(200).json({
      message: 'Unit restored successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function restorePositionController(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await restorePositionService(req.params.id);
    res.status(200).json({
      message: 'Position restored successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function permanentlyDeleteOrganizationController(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await permanentlyDeleteArchivedOrganizationService({
      organization_id: req.params.id,
      actorUserId: actorId(req),
    });
    res.status(200).json({
      message: 'Organization deleted permanently',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function permanentlyDeleteUnitController(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await permanentlyDeleteArchivedUnitService(req.params.id);
    res.status(200).json({
      message: 'Unit deleted permanently',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function permanentlyDeletePositionController(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await permanentlyDeleteArchivedPositionService(req.params.id);
    res.status(200).json({
      message: 'Position deleted permanently',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
