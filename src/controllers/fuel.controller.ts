import { NextFunction, Request, Response } from 'express';
import * as fuelService from '../services/fuel.service';
import type { position_accesses } from '../types/access';
import { AppError } from '../utils/Error';
import {
  createFuelRequisitionSchema,
  createGeneratorSchema,
  issueFuelRequisitionSchema,
  recommendFuelRequisitionSchema,
  rejectFuelRequisitionSchema,
  replenishFuelAccountSchema,
  updateGeneratorSchema,
} from '../schemas/fuel.schema';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access: position_accesses;
    unit_id?: string | null;
    inuma_position?: string | null;
    inuma_unit?: string | null;
    matched_unit_id?: string | null;
    is_sso_user?: boolean;
  };
}

type FuelPermission = keyof NonNullable<position_accesses['fuel']>;

/**
 * Each section of the fuel form is a separate permission, so a position can be
 * given exactly the step its holder signs and nothing else — a driver requests,
 * Assets and Services Management recommends, Finance funds, Logistics issues.
 *
 * `fuel` is absent from positions created before this module existed, which
 * reads as no access. That is deliberate: nobody silently gains a signature.
 */
function requirePermission(req: AuthenticatedRequest, permission: FuelPermission) {
  const user = req.user;
  if (!user) throw new AppError('Authentication required', 401);

  if (!user.position_access?.fuel?.[permission]) {
    throw new AppError(
      `Access denied. Your position does not allow you to ${DESCRIPTIONS[permission]}.`,
      403
    );
  }
  return user as Parameters<typeof fuelService.listFuelRequisitions>[0];
}

const DESCRIPTIONS: Record<FuelPermission, string> = {
  request: 'raise fuel requisitions',
  view: 'view fuel requisitions',
  viewOwn: 'view fuel requisitions',
  recommend: 'recommend fuel requisitions',
  confirmFunding: 'confirm funding for fuel requisitions',
  issue: 'issue fuel',
  receive: 'sign for fuel received',
  replenish: 'replenish the fuel account',
  viewReport: 'view the fuel consumption report',
  manageGenerators: 'manage generators',
};

/** Reading the list needs either the full view or the own-requests view. */
function requireAnyView(req: AuthenticatedRequest) {
  const user = req.user;
  if (!user) throw new AppError('Authentication required', 401);

  const access = user.position_access?.fuel;
  if (!access?.view && !access?.viewOwn) {
    throw new AppError('Access denied. You are not allowed to view fuel requisitions.', 403);
  }
  return user as Parameters<typeof fuelService.listFuelRequisitions>[0];
}

export const listRequisitions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requireAnyView(req);
    const data = await fuelService.listFuelRequisitions(user, {
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      request_type:
        typeof req.query.request_type === 'string' ? req.query.request_type : undefined,
      mine: req.query.mine === 'true',
    });
    res.status(200).json({ message: 'Fuel requisitions retrieved successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getRequisition = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requireAnyView(req);
    const data = await fuelService.getFuelRequisition(req.params.id, user);
    res.status(200).json({ message: 'Fuel requisition retrieved successfully', data });
  } catch (error) {
    next(error);
  }
};

export const createRequisition = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'request');
    const input = createFuelRequisitionSchema.parse(req.body);
    const data = await fuelService.createFuelRequisition(input, user);
    res.status(201).json({ message: 'Fuel requisition submitted successfully', data });
  } catch (error) {
    next(error);
  }
};

export const recommendRequisition = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'recommend');
    const { note } = recommendFuelRequisitionSchema.parse(req.body ?? {});
    const data = await fuelService.recommendFuelRequisition(req.params.id, note, user);
    res.status(200).json({ message: 'Fuel requisition recommended', data });
  } catch (error) {
    next(error);
  }
};

export const confirmFunding = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'confirmFunding');
    const data = await fuelService.confirmFuelRequisitionFunding(req.params.id, user);
    res.status(200).json({ message: 'Funding confirmed', data });
  } catch (error) {
    next(error);
  }
};

export const issueFuel = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'issue');
    const input = issueFuelRequisitionSchema.parse(req.body);
    const data = await fuelService.issueFuelRequisition(req.params.id, input, user);
    res.status(200).json({ message: 'Fuel issued and posted to the fuel account', data });
  } catch (error) {
    next(error);
  }
};

export const receiveFuel = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'receive');
    const data = await fuelService.receiveFuelRequisition(req.params.id, user);
    res.status(200).json({ message: 'Fuel receipt signed', data });
  } catch (error) {
    next(error);
  }
};

export const rejectRequisition = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) throw new AppError('Authentication required', 401);

    // Any of the three approving hands may refuse a form at their own step;
    // the service checks the form has not already been issued.
    const access = user.position_access?.fuel;
    if (!access?.recommend && !access?.confirmFunding && !access?.issue) {
      throw new AppError('Access denied. You are not allowed to reject fuel requisitions.', 403);
    }

    const { reason } = rejectFuelRequisitionSchema.parse(req.body);
    const data = await fuelService.rejectFuelRequisition(
      req.params.id,
      reason,
      user as Parameters<typeof fuelService.rejectFuelRequisition>[2]
    );
    res.status(200).json({ message: 'Fuel requisition rejected', data });
  } catch (error) {
    next(error);
  }
};

export const cancelRequisition = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'request');
    const data = await fuelService.cancelFuelRequisition(req.params.id, user);
    res.status(200).json({ message: 'Fuel requisition withdrawn', data });
  } catch (error) {
    next(error);
  }
};

export const listVehicles = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Raising a requisition is what this list is for, so it rides on the same
    // permission rather than requiring the vehicles module as well.
    const user = requirePermission(req, 'request');
    const data = await fuelService.listFuellableVehicles(user);
    res.status(200).json({ message: 'Vehicles retrieved successfully', data });
  } catch (error) {
    next(error);
  }
};

export const listGenerators = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) throw new AppError('Authentication required', 401);

    const access = user.position_access?.fuel;
    if (!access?.request && !access?.manageGenerators && !access?.view) {
      throw new AppError('Access denied. You are not allowed to view generators.', 403);
    }

    const data = await fuelService.listGenerators(
      user as Parameters<typeof fuelService.listGenerators>[0]
    );
    res.status(200).json({ message: 'Generators retrieved successfully', data });
  } catch (error) {
    next(error);
  }
};

export const createGenerator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'manageGenerators');
    const input = createGeneratorSchema.parse(req.body);
    const data = await fuelService.createGenerator(input, user);
    res.status(201).json({ message: 'Generator registered successfully', data });
  } catch (error) {
    next(error);
  }
};

export const updateGenerator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'manageGenerators');
    const input = updateGeneratorSchema.parse(req.body);
    const data = await fuelService.updateGenerator(req.params.id, input, user);
    res.status(200).json({ message: 'Generator updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const replenish = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'replenish');
    const input = replenishFuelAccountSchema.parse(req.body);
    const data = await fuelService.replenishFuelAccount(input, user);
    res.status(201).json({ message: 'Fuel account replenished', data });
  } catch (error) {
    next(error);
  }
};

export const consumptionReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'viewReport');
    const from = typeof req.query.from === 'string' ? new Date(req.query.from) : undefined;
    const to = typeof req.query.to === 'string' ? new Date(req.query.to) : undefined;

    if ((from && Number.isNaN(from.getTime())) || (to && Number.isNaN(to.getTime()))) {
      throw new AppError('from and to must be valid dates', 400);
    }

    const data = await fuelService.getFuelConsumptionReport(user, { from, to });
    res.status(200).json({ message: 'Fuel consumption report generated', data });
  } catch (error) {
    next(error);
  }
};

export const balance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requirePermission(req, 'viewReport');
    const value = await fuelService.getFuelBalance(user.organization_id);
    res.status(200).json({
      message: 'Fuel account balance retrieved',
      data: { balance_rwf: value },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Where the form has got to and whose desk it is sitting on.
 *
 * Open to anyone who can see the requisition — a requester chasing their own
 * form is exactly who needs it.
 */
export const requisitionChain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = requireAnyView(req);
    const data = await fuelService.getFuelRequisitionChain(req.params.id, user);
    res.status(200).json({ message: 'Approval chain retrieved successfully', data });
  } catch (error) {
    next(error);
  }
};

/**
 * Fuel history for one vehicle or generator.
 *
 * Anyone who can see requisitions can see what an asset has been fuelled
 * with — it is the same information, grouped by asset instead of by form.
 */
const assetHistory =
  (assetType: 'VEHICLE' | 'GENERATOR', param: string) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = requireAnyView(req);
      const data = await fuelService.getAssetFuelHistory(
        assetType,
        req.params[param],
        user
      );
      res.status(200).json({ message: 'Fuel history retrieved successfully', data });
    } catch (error) {
      next(error);
    }
  };

export const vehicleFuelHistory = assetHistory('VEHICLE', 'vehicleId');
export const generatorFuelHistory = assetHistory('GENERATOR', 'generatorId');
