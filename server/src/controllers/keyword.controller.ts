import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import {
  createKeyword as writeKeyword,
  readKeywords as getKeywords,
  readKeyword as getKeyword,
  deleteKeyword,
  chooseKeyword as chooseActiveKeyword,
} from '../services/repositories/keyword.service.js';

export async function createKeyword(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const { keyword } = req.body;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!keyword) {
      throw HttpError(400, 'Client error. Kyword cannot be empty.');
    }

    const newKeyword = await writeKeyword(keyword, id);

    res.status(201).json({ newKeyword, message: 'Success' });
  } catch (err) {
    next(err);
  }
}

export async function readKeywords(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const keywords = await getKeywords(id);

    res.status(200).json({ keywords, message: 'Success' });
  } catch (err) {
    next(err);
  }
}

export async function deleteKeywordById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const keywordId = req.params.id;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!keywordId) {
      throw HttpError(400, 'Client error. Keyword not set. Try again later...');
    }

    await deleteKeyword(id, keywordId);

    res.status(204).json({ message: 'Keyword deleted succesfully' });
  } catch (err) {
    next(err);
  }
}

export async function chooseKeyword(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const { keywordId } = req.body;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!keywordId) {
      throw HttpError(400, 'Client error. Choosen keyword does not exist. Try again later...');
    }

    const keyword = await getKeyword(keywordId);

    if (!keyword) {
      throw HttpError(500, 'Server error. Choosen keyword does not exist. Try again later... ');
    }

    await chooseActiveKeyword(id, keywordId);

    res.status(204).json({ message: 'Keyword choosen succesfully' });
  } catch (err) {
    next(err);
  }
}
