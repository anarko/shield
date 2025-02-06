import { authService } from "../service";
import { Errors } from "../utils";
import { Request, Response, NextFunction } from "express";

export async function verifyToken(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const header = request.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    throw Errors.invalidCredentials();
  }

  const payload = await authService.verifyToken(token);
  request.userId = payload.userId;
  next();
}
