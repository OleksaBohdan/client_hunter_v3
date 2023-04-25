import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import {
  deleteBlackIndustry,
  readBlackIndustries as getBlackIndustries,
  createBlackIndustry as writeBlackIndustry,
} from '../services/repositories/blackIndustry.service.js';

export async function createBlackIndustry(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const { blackIndustry } = req.body;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!blackIndustry) {
      throw HttpError(400, 'Client error. Black industry cannot be empty.');
    }

    const newBlackIndustry = await writeBlackIndustry(blackIndustry, id);

    res.status(201).json({ newBlackIndustry, message: 'Success' });
  } catch (err) {
    next(err);
  }
}

export async function readBlackIndustries(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const blackIndustries = await getBlackIndustries(id);

    res.status(200).json({ blackIndustries, message: 'Success' });
  } catch (err) {
    next(err);
  }
}

export async function deleteBlackIndustryById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const BlackIndustryId = req.params.id;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!BlackIndustryId) {
      throw HttpError(400, 'Client error. Black industry not set. Try again later...');
    }

    await deleteBlackIndustry(id, BlackIndustryId);

    res.status(204).json({ message: 'Black industry deleted succesfully' });
  } catch (err) {
    next(err);
  }
}
