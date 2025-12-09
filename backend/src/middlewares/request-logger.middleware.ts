import morgan from 'morgan';
import logger from '../config/logger.config';

/** HTTP isteklerini morgan aracılığıyla loglar. */
export const requestLogger = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});
