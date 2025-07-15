import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validateBody = (schema: ZodType<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return res.status(400).json({
        message: `${firstIssue.path.join('.')}: ${firstIssue.message}`,
        data: null
      });
    }

    next(error);
  }
};
