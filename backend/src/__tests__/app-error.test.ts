import { describe, it, expect } from 'vitest';
import {
  AppError,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerException,
} from '@utils/app-error';
import { HTTP_STATUS } from '@config/http.config';

describe('AppError classes', () => {
  it('AppError sets status and code', () => {
    const err = new AppError('Boom', HTTP_STATUS.BAD_REQUEST);
    expect(err.message).toBe('Boom');
    expect(err.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it('NotFoundException has 404', () => {
    const err = new NotFoundException('Missing');
    expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
  });

  it('BadRequestException has 400', () => {
    const err = new BadRequestException('Bad');
    expect(err.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it('UnauthorizedException has 401', () => {
    const err = new UnauthorizedException('Nope');
    expect(err.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
  });

  it('ForbiddenException has 403', () => {
    const err = new ForbiddenException('Stop');
    expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it('InternalServerException has 500', () => {
    const err = new InternalServerException('Crash');
    expect(err.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  });
});
