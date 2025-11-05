import { NextFunction, Request, Response, RequestHandler } from 'express';

type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>;

export const asyncHandler = (controller: AsyncControllerType): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
};
