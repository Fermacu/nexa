import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return sendError(
      res,
      err.message,
      err.status,
      err.code,
      'errors' in err ? err.errors : undefined
    );
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500
  );
};
