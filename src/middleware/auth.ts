import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { failure } from '../utils/api-response';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return failure(res, 'Authentication token is required', 401);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === 'string' || !payload.sub || !payload.email || (payload.role !== 'USER' && payload.role !== 'ADMIN')) {
      return failure(res, 'Invalid authentication token', 401);
    }
    req.user = { id: Number(payload.sub), email: payload.email, role: payload.role };
    return next();
  } catch {
    return failure(res, 'Invalid or expired authentication token', 401);
  }
}

export function requireRole(...roles: Array<'USER' | 'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return failure(res, 'You do not have permission to perform this action', 403);
    }
    return next();
  };
}
