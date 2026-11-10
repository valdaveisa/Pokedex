import { Request, Response } from 'express';
import { authSchema } from './auth.schema';
import * as service from './auth.service';
import { success } from '../../utils/api-response';

export async function register(req: Request, res: Response) {
  const input = authSchema.parse(req.body);
  return success(res, await service.register(input.email, input.password), 201);
}

export async function login(req: Request, res: Response) {
  const input = authSchema.parse(req.body);
  return success(res, await service.login(input.email, input.password));
}
