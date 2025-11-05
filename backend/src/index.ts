import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from '@config/app.config';
import { errorHandler } from '@middlewares/error-handler.middleware';
import { HTTP_STATUS } from '@config/http.config';
import { asyncHandler } from '@middlewares/async-handler.middleware';
import { requestLogger } from '@middlewares/request-logger.middleware';
import v1Router from '@routes/v1/index';
import { connectPostgres } from '@db/index';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/openapi.config';
import logger from '@config/logger.config';

export const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(compression());
app.use(requestLogger);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get(
  `/`,
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(HTTP_STATUS.OK).json({ message: 'OK' });
  }),
);

app.use(config.BASE_PATH, v1Router);

app.use(errorHandler);

if (config.NODE_ENV !== 'test') {
  app.listen(config.PORT, async () => {
    logger.info(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    connectPostgres();
  });
}
