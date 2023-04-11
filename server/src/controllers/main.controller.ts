import { Request, Response, NextFunction } from 'express';

export async function main(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ message: 'hello client hunter v3!' });
  } catch (err) {
    next(err);
  }
}
