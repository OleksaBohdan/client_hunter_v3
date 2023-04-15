import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/app.config.js';

// export interface AuthenticatedRequest extends Request {
//   userId: string;
// }

export const checkAuth = async function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if ((decoded as JwtPayload).id) {
          req.userId = (decoded as JwtPayload).id;
          next();
        } else {
          throw HttpError(403, 'No access');
        }
      } catch (err) {
        throw HttpError(403, 'No access');
      }
    }
  } catch (err) {
    throw HttpError(403, 'No access');
  }
};
