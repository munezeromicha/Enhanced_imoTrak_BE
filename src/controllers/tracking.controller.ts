import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/access';
import * as trackingService from '../services/tracking.services';

export async function getFleetOverviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await trackingService.getFleetOverview((req as AuthenticatedRequest).user);
    res.json({ message: 'Fleet overview', data });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleTrackingDetailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const includeGeocode = req.query.geocode !== 'false';
    const data = await trackingService.getVehicleTrackingDetail(
      (req as AuthenticatedRequest).user,
      req.params.vehicleId,
      includeGeocode
    );
    res.json({ message: 'Vehicle tracking detail', data });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleTrackHistoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const from = typeof req.query.from === 'string' ? req.query.from : undefined;
    const to = typeof req.query.to === 'string' ? req.query.to : undefined;
    const data = await trackingService.getVehicleTrackHistory(
      (req as AuthenticatedRequest).user,
      req.params.vehicleId,
      from,
      to
    );
    res.json({ message: 'Vehicle track history', data });
  } catch (error) {
    next(error);
  }
}

export async function getTrackingDashboardController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await trackingService.getTrackingDashboardStats((req as AuthenticatedRequest).user);
    res.json({ message: 'Tracking dashboard stats', data });
  } catch (error) {
    next(error);
  }
}

export async function reverseGeocodeController(req: Request, res: Response, next: NextFunction) {
  try {
    const lat = parseFloat(String(req.query.lat));
    const lng = parseFloat(String(req.query.lng));
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: 'lat and lng query parameters are required' });
    }
    const data = await trackingService.reverseGeocodeForUser(
      (req as AuthenticatedRequest).user,
      lat,
      lng
    );
    res.json({ message: 'Reverse geocode result', data });
  } catch (error) {
    next(error);
  }
}
