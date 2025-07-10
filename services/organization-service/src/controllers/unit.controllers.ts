import { Request, Response, NextFunction } from 'express';
import { createUnit, getAllUnits } from '../services/unit.services';

export const handleCreateUnit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { unit_name, organization_id } = req.body;

    const unit = await createUnit({
      unit_name,
      organization_id,
    });

    res.status(201).json({
      message: 'Unit created successfully',
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetAllUnits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const units = await getAllUnits();

    res.status(200).json({
      message: 'Units fetched successfully',
      data: units,
    });
  } catch (error) {
    next(error);
  }
};