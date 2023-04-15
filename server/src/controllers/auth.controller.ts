import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth/auth.service.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const newUser = await registerUser(email, password);
    res.status(201).json({ newUser, message: 'Registration completed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    await loginUser(email, password);

    res.status(200).json(await loginUser(email, password));
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ message: 'me' });
  } catch (err) {
    next(err);
  }
}
