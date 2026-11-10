import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { success } from '../../utils/api-response';

export async function list(_req: Request, res: Response) {
  return success(res, await prisma.type.findMany({ orderBy: { name: 'asc' } }));
}
