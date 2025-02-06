import { UserData } from "@src/service/dto";
import { verifyToken } from "../middleware";
import { authService } from "../service";
import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware";
import { body } from "express-validator";

export const indexRouter = Router();

const signInValidationSchema = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
];

indexRouter.post(
  "/signin",
  validateRequest(signInValidationSchema),
  async function (request: Request, response: Response, next: NextFunction) {
    const loginData = request.body;
    try {
      const token = await authService.signIn(loginData);
      response.send({ token });
    } catch (error) {
      next(error);
    }
  }
);

indexRouter.post(
  "/register",
  validateRequest(signInValidationSchema),
  async function (request: Request, response: Response, next: NextFunction) {
    const registerData = request.body as UserData;
    try {
      await authService.register(registerData);
      response.send({ status: "Ok" });
    } catch (error) {
      next(error);
    }
  }
);

indexRouter.get(
  "/signout",
  verifyToken,
  async function (request: Request, response: Response, next: NextFunction) {
    const loginData = request.userId ?? "";
    try {
      await authService.signOut(loginData);
      response.send({ status: "Ok" });
    } catch (error) {
      next(error);
    }
  }
);
