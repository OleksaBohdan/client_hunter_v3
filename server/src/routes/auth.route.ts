import { Router } from 'express';
import { login, register, getMe } from '../controllers/auth.controller.js';

export const authRoute = Router();

authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.get('/me', getMe);
