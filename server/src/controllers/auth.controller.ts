import { Request, Response, NextFunction } from 'express';
import { registerUser } from '../services/auth/auth.service.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const newUser = await registerUser(email, password);
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ message: 'login' });
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
