import { Request, Response, NextFunction } from 'express';
import { createPosition } from '../services/position.services';

export const handleCreatePosition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { position_name, position_description, position_access, unit_id } = req.body;

    const position = await createPosition({
      position_name,
      position_description,
      position_access,
      unit_id,
    });

    res.status(201).json({
      message: 'Position created successfully',
      data: position,
    });
  } catch (error) {
    next(error);
  }
};
