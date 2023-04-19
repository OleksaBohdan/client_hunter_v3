import { Request, Response, NextFunction } from 'express';
import { readParsers as getParsers } from '../services/repositories/parser.service.js';

export async function readParsers(req: Request, res: Response, next: NextFunction) {
  try {
    const parsers = await getParsers();

    res.status(200).json({ parsers, message: 'Success' });
  } catch (err) {
    next(err);
  }
}
