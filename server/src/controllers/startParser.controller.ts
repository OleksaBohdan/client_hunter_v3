import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import { User } from '../databases/mongo/models/User.js';
import { Parser } from '../databases/mongo/models/Parser.js';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';

export async function startParser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const user = await User.findById(req.userId).populate('activeCity').populate('activeKeyword');
    const parser = await Parser.find(user?.parser);

    if (!user) {
      throw HttpError(404, 'User does not exist');
    }

    if (!parser) {
      throw HttpError(404, 'Parser does not choosen');
    }

    const { city } = user.activeCity;
    const { keyword } = user.activeKeyword;

    console.log(city, keyword);

    switch (parser[0].name) {
      case 'jobbank.gc.ca':
        // runCaJobankParser(user);
        console.log('running jobbank.gc.ca');
        break;
      case 'xing.com':
        console.log('running xing.com');
        break;
      case 'linkedin.com':
        console.log('running linkedin.com');
        break;
    }

    res.status(200).json({ message: 'Parser started succesfully' });
  } catch (err) {
    next(err);
  }
}
