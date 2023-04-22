import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import { User } from '../databases/mongo/models/User.js';
import { Parser } from '../databases/mongo/models/Parser.js';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';

export const stopFlags = new Map();

export async function startParser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const user = await User.findById(req.userId).populate('activeCity').populate('activeKeyword');

    if (!user) {
      throw HttpError(404, 'User does not exist');
    }

    const parser = await Parser.findById(user.parser);

    console.log('parser:', parser);

    if (!parser) {
      throw HttpError(404, 'Parser not chosen');
    }

    if (stopFlags.get(id) == false) {
      console.log('Parser alreay run');
      res.status(403).json({ message: 'Parser alreay run' });
      return;
    }

    const position = user.activeKeyword ? user.activeKeyword.keyword : '';
    const city = user.activeCity ? user.activeCity.city : '';

    switch (parser.name) {
      case 'jobbank.gc.ca':
        res.status(200).json({ message: 'Parser started succesfully' });
        try {
          await runCaJobankParser(user, city, position);
        } catch (err) {
          stopFlags.set(id, true);
        }
        console.log('running jobbank.gc.ca');
        break;
      case 'xing.com':
        res.status(200).json({ message: 'Parser started succesfully' });
        console.log('running xing.com');
        break;
      case 'linkedin.com':
        res.status(200).json({ message: 'Parser started succesfully' });
        console.log('running linkedin.com');
        break;
    }
  } catch (err) {
    next(err);
  }
}

export async function stopParser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    stopFlags.set(id, true);

    res.status(200).json({ message: 'Parser stop requested.' });
  } catch (err) {
    next(err);
  }
}
