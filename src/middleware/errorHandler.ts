import { Request, Response, NextFunction } from "express";

import { ServerError } from "../utils";

export function errorHandler(
  error: ServerError,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  response.status(error.statusCode || 500);
  let errorData = error.name;
  if (error.description) {
    errorData += `: ${error.description}`;
  }
  response.send(errorData || "Internal server error");
}
