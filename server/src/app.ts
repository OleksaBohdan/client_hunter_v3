import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import * as WebSocket from 'ws';
import { HttpError } from 'http-errors';
import { setupWebSocketHandlers } from './websocket/index.websocket.js';

import { authRoute } from './routes/auth.route.js';
import { userRoute } from './routes/user.route.js';
import { parserRoute } from './routes/parser.route.js';
import { keywordRoute } from './routes/keyword.route.js';
import { cityRoute } from './routes/city.route.js';
import { startParserRoute } from './routes/startParser.route.js';

const app = express();
const server = createServer(app);
const wss = new WebSocket.WebSocketServer({ server });

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(cors());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use('/api/v1/', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/', parserRoute);
app.use('/api/v1/', keywordRoute);
app.use('/api/v1/', cityRoute);
app.use('/api/v1/', startParserRoute);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

setupWebSocketHandlers();

export { server, wss };
