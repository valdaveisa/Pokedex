import { Router } from 'express';
import { list } from './type.controller';
export const typeRouter = Router();
typeRouter.get('/', list);
