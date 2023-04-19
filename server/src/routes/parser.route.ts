import { Router } from 'express';
import { readParsers } from '../controllers/parser.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';

export const parserRoute = Router();

parserRoute.get('/parsers', readParsers);

// checkAuth,
