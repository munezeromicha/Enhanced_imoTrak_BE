import { Request, Response, NextFunction } from 'express';
import * as vehicleService from '../services/vehicle.services';
import { vehicleModelSchema, vehicleModelUpdateSchema, vehicleSchema, vehicleUpdateSchema } from '../schemas/vehicle.schema';
import { uploadToCloudinary } from '../utils/cloudinary';
import { AuthenticatedRequest } from '../types/access';

function checkVehiclePermission(req: AuthenticatedRequest, action: keyof AuthenticatedRequest['user']['position_access']['vehicles']) {
  if (!req.user?.position_access?.vehicles?.[action]) {
    throw { status: 403, message: `Forbidden: insufficient vehicle permissions for ${String(action)}` };
  }
}

// Vehicle Model Controllers
export async function createVehicleModelController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'create');
    const parsed = vehicleModelSchema.safeParse(req.body);
    if (!parsed.success) throw new Error('Invalid input');
    const model = await vehicleService.createVehicleModel(parsed.data);
    res.status(201).json({ message: 'Vehicle model created', data: model });
  } catch (error) { next(error); }
}

export async function getAllVehicleModelsController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'view');
    const models = await vehicleService.getAllVehicleModels();
    res.json({ data: models });
  } catch (error) { next(error); }
}

export async function getVehicleModelByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'viewSingle');
    const model = await vehicleService.getVehicleModelById(req.params.id);
    if (!model) return res.status(404).json({ message: 'Vehicle model not found' });
    res.json({ data: model });
  } catch (error) { next(error); }
}

export async function updateVehicleModelController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'update');
    const parsed = vehicleModelUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new Error('Invalid input');
    const model = await vehicleService.updateVehicleModel(req.params.id, parsed.data);
    res.json({ message: 'Vehicle model updated', data: model });
  } catch (error) { next(error); }
}

export async function deleteVehicleModelController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'delete');
    await vehicleService.deleteVehicleModel(req.params.id);
    res.json({ message: 'Vehicle model deleted' });
  } catch (error) { next(error); }
}

export async function createVehicleController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'create');
    let vehiclePhotoUrl = req.body.vehicle_photo;
    if (req.file) {
      vehiclePhotoUrl = await uploadToCloudinary(req.file.buffer, 'vehicles');
    }
    // Parse/convert fields as needed for multipart/form-data
    const parsedBody = {
      ...req.body,
      vehicle_photo: vehiclePhotoUrl,
      vehicle_year: req.body.vehicle_year ? parseInt(req.body.vehicle_year, 10) : undefined,
      vehicle_capacity: req.body.vehicle_capacity ? parseInt(req.body.vehicle_capacity, 10) : undefined,
    };
    const parsed = vehicleSchema.safeParse(parsedBody);
    if (!parsed.success) throw new Error('Invalid input');
    const data = { ...parsed.data, vehicle_status: parsed.data.vehicle_status ?? 'AVAILABLE', vehicle_photo: vehiclePhotoUrl };
    const vehicle = await vehicleService.createVehicle(data);
    res.status(201).json({ message: 'Vehicle created', data: vehicle });
  } catch (error) { next(error); }
}

export async function getAllVehiclesController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'view');
    const userId = (req as AuthenticatedRequest).user.user_id;
    const vehicles = await vehicleService.getAllVehicles(userId);
    res.json({ data: vehicles });
  } catch (error) { next(error); }
}

export async function getVehicleByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'viewSingle');
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ data: vehicle });
  } catch (error) { next(error); }
}

export async function updateVehicleController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'update');
    const parsed = vehicleUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new Error('Invalid input');
    const vehicle = await vehicleService.updateVehicle(req.params.id, parsed.data);
    res.json({ message: 'Vehicle updated', data: vehicle });
  } catch (error) { next(error); }
}

export async function deleteVehicleController(req: Request, res: Response, next: NextFunction) {
  try {
    checkVehiclePermission(req as AuthenticatedRequest, 'delete');
    await vehicleService.deleteVehicle(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (error) { next(error); }
} 