import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as vehicleService from '../services/vehicle.services';
import { uploadToCloudinary } from '../utils/cloudinary';
import { AuthenticatedRequest } from '../types/access';
import { AppError } from '../utils/Error';
import { assertVehicleLocationAccess, assertVehicleUnitScope, assertVehicleUnitScopeById, clampVehicleUnitIdForUser } from '../utils/vehicle-access';
import { resolveUnitScopeForUser, isOrgLeader } from '../utils/orgLeader';
import { ServerResponse } from 'http';

const prisma = new PrismaClient();
function checkVehiclePermission(req: AuthenticatedRequest, action: keyof AuthenticatedRequest['user']['position_access']['vehicles']) {
  if (!req.user?.position_access?.vehicles?.[action]) {
    throw new AppError(`You do not have permission to ${String(action)} vehicles`, 403);
  }
}

export async function createVehicleModelController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'create');
    const model = await vehicleService.createVehicleModel(req.body);
    res.status(201).json({ message: 'Vehicle model created', data: model });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      throw new AppError(`Vehicle model ${field} already exists`, 409);
    }
    next(error);
  }
}

export async function getAllVehicleModelsController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'view');
    const models = await vehicleService.getAllVehicleModels();
    res.json({ data: models });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleModelByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'viewSingle');
    const model = await vehicleService.getVehicleModelById(req.params.id);
    if (!model) throw new AppError('Vehicle model not found', 404);
    res.json({ data: model });
  } catch (error) {
    next(error);
  }
}

export async function updateVehicleModelController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'update');
    const model = await vehicleService.updateVehicleModel(req.params.id, req.body);
    res.json({ message: 'Vehicle model updated', data: model });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      throw new AppError(`Vehicle model ${field} already exists`, 409);
    }
    if (error.code === 'P2025') {
      throw new AppError('Vehicle model not found', 404);
    }
    next(error);
  }
}

export async function deleteVehicleModelController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'delete');
    await vehicleService.deleteVehicleModel(req.params.id);
    res.json({ message: 'Vehicle model deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new AppError('Vehicle model not found', 404);
    }
    next(error);
  }
}

export async function createVehicleController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'create');
    let vehiclePhotoUrl = req.body.vehicle_photo;
    if (req.file) {
      vehiclePhotoUrl = await uploadToCloudinary(req.file.buffer, 'vehicles');
    }else{
      return res.status(400).json({ message: 'Vehicle photo is required' });
    }

    let gpsDevice;
    if (req.body.gps_device) {
      try {
        gpsDevice = typeof req.body.gps_device === 'string'
          ? JSON.parse(req.body.gps_device)
          : req.body.gps_device;
      } catch {
        return res.status(400).json({ message: 'Invalid GPS device payload' });
      }
    }

    const parsedBody = {
      ...req.body,
      vehicle_photo: vehiclePhotoUrl,
      vehicle_year: Number(req.body.vehicle_year),
      unit_id: await clampVehicleUnitIdForUser(
        (req as AuthenticatedRequest).user,
        req.body.unit_id || undefined
      ),
      gps_device: gpsDevice,
    };
    const data = { ...parsedBody, vehicle_status: parsedBody.vehicle_status ?? 'AVAILABLE', vehicle_photo: vehiclePhotoUrl };
    const vehicle = await vehicleService.createVehicle(data);
    res.status(201).json({ message: 'Vehicle created', data: vehicle });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      throw new AppError(`Vehicle ${field} already exists`, 409);
    }
    if (error.code === 'P2003') {
      throw new AppError('Organization or vehicle model not found', 404);
    }
    next(error);
  }
}

export async function getAllVehiclesController(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    checkVehiclePermission(authReq, 'view');
    const organizationId = authReq.user.organization_id;
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const unitScope = await resolveUnitScopeForUser(authReq.user);
    const vehicles = await vehicleService.getAllVehicles(
      organizationId,
      startDate,
      endDate,
      unitScope ?? undefined
    );
    res.json({ data: vehicles });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    let isAssigned = false;
    
    // Check if caller is a driver assigned to this vehicle
    const driverProfile = await prisma.tbl_drivers.findUnique({
      where: { user_id: authReq.user?.user_id },
    });
    if (driverProfile) {
      const assignment = await prisma.tbl_reserved_vehicle_drivers.findFirst({
        where: {
          driver_id: driverProfile.driver_id,
          reserved_vehicle: {
            vehicle_id: req.params.id,
          },
        },
      });
      if (assignment) {
        isAssigned = true;
      }
    }

    if (!isAssigned) {
      checkVehiclePermission(authReq, 'viewSingle');
    }

    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) throw new AppError('Vehicle not found', 404);

    if (!isAssigned) {
      await assertVehicleUnitScope(authReq.user, vehicle);
    }

    res.json({ data: vehicle });
  } catch (error) {
    next(error);
  }
}

export async function updateVehicleController(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    checkVehiclePermission(authReq, 'update');
    await assertVehicleUnitScopeById(authReq.user, req.params.id);
    let vehiclePhotoUrl = req.body.vehicle_photo;
    if (req.file) {
      vehiclePhotoUrl = await uploadToCloudinary(req.file.buffer, 'vehicles');
    }

    // validateBody runs before this, but multipart fields are strings — build an explicit payload.
    const body = req.body as Record<string, unknown>;
    const payload: Parameters<typeof vehicleService.updateVehicle>[1] = {};

    if (body.plate_number !== undefined) payload.plate_number = String(body.plate_number);
    if (body.transmission_mode !== undefined) {
      payload.transmission_mode = String(body.transmission_mode) as typeof payload.transmission_mode;
    }
    if (body.vehicle_model_id) payload.vehicle_model_id = String(body.vehicle_model_id);
    if (body.vehicle_year !== undefined && body.vehicle_year !== '') {
      payload.vehicle_year = Number(body.vehicle_year);
    }
    if (body.energy_type !== undefined) payload.energy_type = String(body.energy_type);
    if (body.organization_id) payload.organization_id = String(body.organization_id);
    if (body.vehicle_status !== undefined) {
      payload.vehicle_status = String(body.vehicle_status) as typeof payload.vehicle_status;
    }
    if (vehiclePhotoUrl) payload.vehicle_photo = vehiclePhotoUrl;

    // unit_id: empty string clears assignment; omit to leave unchanged
    if (body.unit_id !== undefined) {
      const rawUnit = String(body.unit_id ?? '').trim();
      payload.unit_id = (await clampVehicleUnitIdForUser(
        authReq.user,
        rawUnit === '' ? null : rawUnit
      )) as string | null;
    }

    let gpsDevice: unknown = body.gps_device;
    if (typeof gpsDevice === 'string' && gpsDevice.trim()) {
      try {
        gpsDevice = JSON.parse(gpsDevice);
      } catch {
        throw new AppError('Invalid GPS device payload', 400);
      }
    }
    if (gpsDevice && typeof gpsDevice === 'object') {
      payload.gps_device = gpsDevice as Parameters<typeof vehicleService.updateVehicle>[1]['gps_device'];
    }

    const vehicle = await vehicleService.updateVehicle(req.params.id, payload);
    res.json({ message: 'Vehicle updated', data: vehicle });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      throw new AppError(`Vehicle ${field} already exists`, 409);
    }
    if (error.code === 'P2025') {
      throw new AppError('Vehicle not found', 404);
    }
    next(error);
  }
}

export async function deleteVehicleController(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const orgLeader = await isOrgLeader(authReq.user);
    if (!orgLeader) {
      checkVehiclePermission(authReq, 'delete');
    }
    await assertVehicleUnitScopeById(authReq.user, req.params.id);
    await vehicleService.deleteVehicle(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new AppError('Vehicle not found', 404);
    }
    next(error);
  }
}

export async function getVehicleTrackingContextController(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    let isAssigned = false;

    const driverProfile = await prisma.tbl_drivers.findUnique({
      where: { user_id: authReq.user?.user_id },
    });
    if (driverProfile) {
      const assignment = await prisma.tbl_reserved_vehicle_drivers.findFirst({
        where: {
          driver_id: driverProfile.driver_id,
          reserved_vehicle: { vehicle_id: req.params.id },
        },
      });
      if (assignment) isAssigned = true;
    }

    if (!isAssigned) {
      await assertVehicleLocationAccess(authReq.user, req.params.id);
    }

    const context = await vehicleService.getVehicleTrackingContext(req.params.id);
    if (!context) throw new AppError('Vehicle not found', 404);
    res.json({ data: context });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleLocationHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    let isAssigned = false;
    
    // Check if caller is a driver assigned to this vehicle
    const driverProfile = await prisma.tbl_drivers.findUnique({
      where: { user_id: authReq.user?.user_id },
    });
    if (driverProfile) {
      const assignment = await prisma.tbl_reserved_vehicle_drivers.findFirst({
        where: {
          driver_id: driverProfile.driver_id,
          reserved_vehicle: {
            vehicle_id: req.params.id,
          },
        },
      });
      if (assignment) {
        isAssigned = true;
      }
    }

    if (!isAssigned) {
      await assertVehicleLocationAccess(authReq.user, req.params.id);
    }

    const reservedVehicleId = typeof req.query.trip === 'string' ? req.query.trip : undefined;
    const history = await vehicleService.getVehicleLocationHistory(req.params.id, reservedVehicleId);
    res.json({ data: history });
  } catch (error) {
    next(error);
  }
}

export async function getTripLocationHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    let isAssigned = false;
    
    // Check if caller is a driver assigned to this trip's vehicle
    const driverProfile = await prisma.tbl_drivers.findUnique({
      where: { user_id: authReq.user?.user_id },
    });
    if (driverProfile) {
      const assignment = await prisma.tbl_reserved_vehicle_drivers.findFirst({
        where: {
          driver_id: driverProfile.driver_id,
          reserved_vehicle_id: req.params.reservedVehicleId,
        },
      });
      if (assignment) {
        isAssigned = true;
      }
    }

    if (!isAssigned) {
      checkVehiclePermission(authReq, 'viewSingle');
    }

    const history = await vehicleService.getTripLocationHistory(req.params.reservedVehicleId);
    res.json({ data: history });
  } catch (error) {
    next(error);
  }
}

export async function updateVehicleLocationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const pathVehicleId = req.params.id;
    const { vehicle_id, coords, timestamp, reserved_vehicle_id } = req.body;

    if (!vehicle_id || !coords || !timestamp) {
      return res.status(400).json({ error: 'Missing vehicle_id, coords, or timestamp in request body.' });
    }

    if (pathVehicleId !== vehicle_id) {
      return res.status(400).json({ error: 'Vehicle ID in path and body must match.' });
    }

    const location: vehicleService.Location = {
      vehicle_id,
      reserved_vehicle_id: reserved_vehicle_id ?? undefined,
      coords,
      timestamp: typeof timestamp === 'number' ? new Date(timestamp).toISOString() : timestamp,
    };

    // Broadcast + update in-memory
    await vehicleService.saveAndBroadcastLocation(location);

    return res.status(200).json({ status: 'Location received and broadcasted' });
  } catch (error) {
    return next(error);
  }
}


export async function streamVehicleLocationController(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicleId = req.params.id;
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).end();
    }
    try {
      await assertVehicleLocationAccess(authReq.user, vehicleId);
    } catch {
      return res.status(403).end();
    }
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish the SSE stream

    // Optionally send last known location immediately
    const latest = await vehicleService.getLatestLocation(vehicleId);
    if (latest) {
      const ssePayload = `data: ${JSON.stringify(latest)}\n\n`;
      (res as unknown as ServerResponse).write(ssePayload);
    }

    // Register this client for future location updates
    vehicleService.addSSEClient(vehicleId, res);
  } catch (error) {
    next(error);
  }
}
