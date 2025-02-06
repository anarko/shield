import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (validations: any[]) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(request)));

    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    }
    response.status(400).json({ errors: errors.array() });
  };
};
