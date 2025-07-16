import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!err.statusCode) {
    console.error(err)
    return res.status(500).json({message: 'Something went wrong'})
  }

  const statusCode = err.statusCode;
  const message = err.message;

  res.status(statusCode).json({
    message,
    dadta: null
  });
};