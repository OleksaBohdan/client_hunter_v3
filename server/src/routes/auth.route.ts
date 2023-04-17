import { Router } from 'express';
import { login, register, getMe } from '../controllers/auth.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';

export const authRoute = Router();

authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.get('/me', checkAuth, getMe);
