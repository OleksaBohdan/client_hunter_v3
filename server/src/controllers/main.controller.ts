import { Request, Response, NextFunction } from 'express';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';

export async function main(req: Request, res: Response, next: NextFunction) {
  try {
    await runCaJobankParser('dsfedd', '');
    res.status(200).json({ message: 'hello client hunter v3!' });
  } catch (err) {
    next(err);
  }
}
