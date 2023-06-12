import { Request, Response, NextFunction } from 'express';
import { transferCompanies } from '../services/admin/admin.service.js';

export async function transferCompaniesDB(req: Request, res: Response, next: NextFunction) {
  try {
    await transferCompanies();
    res.status(200).json({ message: 'DB transefer succesfully' });
  } catch (err) {
    next(err);
  }
}
