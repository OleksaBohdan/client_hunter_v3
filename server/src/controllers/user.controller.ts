import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import {
  readUser as getUser,
  updateUser as changeUser,
  deleteUser as removeUser,
} from '../services/repositories/user.service.js';
import { Model } from 'mongoose';

export async function readUser(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email;

    if (typeof email !== 'string') {
      throw HttpError(400, 'Invalid email parameter');
    }

    const user = await getUser(email);

    if (!user) {
      throw HttpError(404, 'User does not exist');
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const user = await changeUser(id, password, email);

    if (!user) {
      throw HttpError(404, 'User does not exist');
    }

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    await removeUser(id);

    res.status(204).json({ message: 'User deleted succesfully' });
  } catch (err) {
    next(err);
  }
}
