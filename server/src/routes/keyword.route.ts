import { Router } from 'express';
import { createKeyword, readKeywords, deleteKeywordById } from '../controllers/keyword.controller.js';

import { checkAuth } from '../middlewares/checkAuth.middleware.js';

export const keywordRoute = Router();

keywordRoute.post('/keyword', checkAuth, createKeyword);
keywordRoute.get('/keywords', checkAuth, readKeywords);
keywordRoute.delete('/keyword/:id', checkAuth, deleteKeywordById);
