import type { Request } from 'express';

export const getCurrentUser = (req: Request) => {
  return req.user;
};
