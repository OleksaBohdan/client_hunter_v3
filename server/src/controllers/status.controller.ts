import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import { readUserById } from '../services/repositories/user.service.js';
import { updateCompanyStatus } from '../services/repositories/company.service.js';

export async function changeCompaniesStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const { status, companies } = req.body;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const user = await readUserById(id);

    if (!user) {
      throw HttpError(404, 'User does not exist');
    }

    await updateCompanyStatus(status, companies);

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    next(err);
  }
}
