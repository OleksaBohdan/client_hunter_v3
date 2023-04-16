import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth/auth.service.js';
import HttpError from 'http-errors';
import { User } from '../databases/mongo/models/User.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/app.config.js';

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
    const user = await User.findById(req.userId);

    if (!user) {
      throw HttpError(404, 'User does not exist');
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user?.email,
      },
      JWT_SECRET,
      { expiresIn: '30d' },
    );

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}
