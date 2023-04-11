import { Router } from 'express';
import { main } from '../controllers/main.controller.js';

export const router = Router();

router.get('/', main);
