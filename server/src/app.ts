import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { HttpError } from 'http-errors';
import { router as mainRouter } from './routes/main.route.js';

export const app = express();
app.use(bodyParser.json());
app.use(mainRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
