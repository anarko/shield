import { logger, removeUndefinedValues, ServerError } from "../utils";
import { Request, Response, NextFunction } from "express";

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const { method, originalUrl, body, params } = req;

  logger.info(
    removeUndefinedValues({ params, body }),
    `Request ${method} ${originalUrl}`
  );
  next();
}

export function errorLogger(
  error: ServerError,
  request: Request,
  _response: Response,
  next: NextFunction
) {
  logger.error(
    removeUndefinedValues({
      errorName: error.name,
      data: error.data,
      path: request.originalUrl,
      body: request.body,
      stack: error.stack,
    })
  );
  next(error);
}
