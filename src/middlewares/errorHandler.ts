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

  // Table/column missing — migration not applied on this database.
  if (err?.code === 'P2021' || err?.code === 'P2022') {
    console.error(err);
    return res.status(503).json({
      message:
        'Database schema is out of date. Apply pending migrations (prisma migrate deploy) and restart the API.',
      data: null,
    });
  }

  if (!err.statusCode) {
    console.error(err);
    const prismaCode = err?.code as string | undefined;
    if (prismaCode === 'P2003') {
      return res.status(409).json({
        message: 'Cannot delete user: related records still reference this account.',
        data: null,
      });
    }
    if (prismaCode === 'P2025') {
      return res.status(404).json({ message: 'Record not found', data: null });
    }
    if (prismaCode === 'P2028') {
      return res.status(504).json({
        message: 'Database operation timed out. Please try again.',
        data: null,
      });
    }
    const detail =
      process.env.NODE_ENV !== 'production' && err?.message
        ? err.message
        : undefined;
    return res.status(500).json({
      message: detail ?? 'Something went wrong',
      data: null,
    });
  }

  const statusCode = err.statusCode;
  const message = err.message;

  res.status(statusCode).json({
    message,
    data: null
  });
};