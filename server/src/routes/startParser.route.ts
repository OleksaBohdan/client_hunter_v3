import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';
import { startParser } from '../controllers/startParser.controller.js';
import { stopParser } from '../controllers/startParser.controller.js';

export const startParserRoute = Router();

startParserRoute.get('/start', checkAuth, startParser);
startParserRoute.get('/stop', checkAuth, stopParser);
