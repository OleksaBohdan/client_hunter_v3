import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router as mainRouter } from './routes/main.route.js';
import { authRoute } from './routes/auth.route.js';
import { userRoute } from './routes/user.route.js';
import { parserRoute } from './routes/parser.route.js';
export const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(cors());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(mainRouter);
app.use('/api/v1/', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/', parserRoute);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});
//# sourceMappingURL=app.js.map