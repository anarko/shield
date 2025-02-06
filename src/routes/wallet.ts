import { WalletCreateData } from "../service";
import { validateRequest, verifyToken } from "../middleware";
import { walletService } from "../service";
import { Router, Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import { isWalletValid } from "r2c-wallet-validator";

export const walletRouter = Router();

walletRouter.get(
  "/",
  verifyToken,
  async function (request: Request, response: Response, next: NextFunction) {
    const userId = request.userId ?? "";
    try {
      const wallets = await walletService.find(userId);
      response.send({ status: "Ok", wallets });
    } catch (error) {
      next(error);
    }
  }
);

const getWalletSchema = [param("id").optional().isUUID()];

walletRouter.get(
  "/:id",
  verifyToken,
  validateRequest(getWalletSchema),
  async function (request: Request, response: Response, next: NextFunction) {
    const userId = request.userId ?? "";
    const walletId = request.params.id;
    try {
      const wallet = await walletService.findById(userId, walletId);
      response.send({ status: "Ok", wallet });
    } catch (error) {
      next(error);
    }
  }
);

const createWalletSchema = [
  body("tag").optional().isString(),
  body("chain").isAlphanumeric(),
  body("address").custom((value, { req }) => {
    const validation = isWalletValid(value);
    if (!validation.valid) {
      throw new Error("Invalid address format");
    }
    return true;
  }),
  param("id").optional().isUUID(),
];

walletRouter.post(
  "/",
  verifyToken,
  validateRequest(createWalletSchema),
  async function (request: Request, response: Response, next: NextFunction) {
    const walletData = request.body as WalletCreateData;
    walletData.userId = request.userId ?? "";
    try {
      const wallet = await walletService.create(walletData);
      response.send({ status: "Ok", wallet });
    } catch (error) {
      next(error);
    }
  }
);

walletRouter.put(
  "/:id",
  verifyToken,
  validateRequest(createWalletSchema),
  async function (request: Request, response: Response, next: NextFunction) {
    const walletData = request.body as WalletCreateData;
    walletData.userId = request.userId ?? "";
    walletData.id = request.params.id;
    try {
      const wallet = await walletService.update(walletData);
      response.send({ status: "Ok", wallet });
    } catch (error) {
      next(error);
    }
  }
);

walletRouter.delete(
  "/:id",
  verifyToken,
  validateRequest(getWalletSchema),
  async function (request: Request, response: Response, next: NextFunction) {
    const userId = request.userId ?? "";
    const walletId = request.params.id;
    try {
      const wallet = await walletService.delete(userId, walletId);
      response.send({ status: "Ok", wallet });
    } catch (error) {
      next(error);
    }
  }
);
