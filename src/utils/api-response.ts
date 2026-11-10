import { Response } from 'express';

export function success<T>(res: Response, data: T, statusCode = 200, meta?: unknown) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta === undefined ? {} : { meta }),
  });
}

export function failure(res: Response, message: string, statusCode: number, details?: unknown) {
  return res.status(statusCode).json({
    success: false,
    error: { message, ...(details === undefined ? {} : { details }) },
  });
}
