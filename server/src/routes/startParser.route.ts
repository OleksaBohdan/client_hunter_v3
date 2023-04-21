import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';
import { startParser } from '../controllers/startParser.controller.js';

export const startParserRoute = Router();

startParserRoute.get('/start', checkAuth, startParser);
