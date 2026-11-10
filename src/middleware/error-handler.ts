import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { failure } from '../utils/api-response';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return failure(res, error.message, error.statusCode, error.details);
  }
  if (error instanceof ZodError) {
    return failure(res, 'Validation failed', 400, error.issues);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return failure(res, 'A record with the same unique value already exists', 409);
    if (error.code === 'P2025') return failure(res, 'Resource not found', 404);
  }
  console.error(error);
  return failure(res, 'Internal server error', 500);
}
