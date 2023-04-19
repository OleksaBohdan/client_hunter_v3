import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import { readParsers as getParsers } from '../services/repositories/parser.service.js';
import { chooseParser as updateParser } from '../services/repositories/parser.service.js';
import { readParser } from '../services/repositories/parser.service.js';

export async function readParsers(req: Request, res: Response, next: NextFunction) {
  try {
    const parsers = await getParsers();

    res.status(200).json({ parsers, message: 'Success' });
  } catch (err) {
    next(err);
  }
}

export async function chooseParser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const { parserId } = req.body;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!parserId) {
      throw HttpError(400, 'Client error. Choosen parser does not exist. Try again later...');
    }

    const parser = await readParser(parserId);

    if (!parser) {
      throw HttpError(500, 'Server error. Choosen parser does not exist. Try again later... ');
    }

    await updateParser(id, parserId);

    res.status(204).json({ parser, message: 'Parser choosen succesfully' });
  } catch (err) {
    next(err);
  }
}
