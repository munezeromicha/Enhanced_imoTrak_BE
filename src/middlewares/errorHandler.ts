import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Prisma throws initialization errors when the DB is unreachable.
  // Surface this as a 503 so the frontend can show a proper "DB down" state.
  if (err?.name === 'PrismaClientInitializationError') {
    console.error(err);
    return res.status(503).json({
      message: 'Database unavailable. Please check DATABASE_URL / network connectivity.',
      data: null,
    });
  }

  if (!err.statusCode) {
    console.error(err)
    return res.status(500).json({message: 'Something went wrong'})
  }

  const statusCode = err.statusCode;
  const message = err.message;

  res.status(statusCode).json({
    message,
    data: null
  });
};