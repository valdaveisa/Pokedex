import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import * as controller from './pokemon.controller';

export const pokemonRouter = Router();
pokemonRouter.get('/', controller.list);
pokemonRouter.get('/:id', controller.get);
pokemonRouter.post('/', requireAuth, requireRole('ADMIN'), controller.create);
pokemonRouter.put('/:id', requireAuth, requireRole('ADMIN'), controller.update);
pokemonRouter.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove);
