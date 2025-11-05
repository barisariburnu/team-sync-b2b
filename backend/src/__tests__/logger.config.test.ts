import { describe, it, expect } from 'vitest';
import logger from '@config/logger.config';

describe('Logger config', () => {
  it('logs at various levels without crashing', () => {
    logger.debug?.('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    expect(true).toBe(true);
  });
});
