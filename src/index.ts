import express, { json, urlencoded } from "express";
import methodOverride from "method-override";

import { indexRouter, walletRouter } from "./routes";
import { environment, initializeDataSource } from "./utils";
import { errorHandler, errorLogger, requestLogger } from "./middleware";
import helmet from "helmet";

var app = express();

export const bootstrap = async () => {
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(requestLogger);

  app.use("/", indexRouter);
  app.use("/wallets", walletRouter);

  app.use(methodOverride());
  app.use(errorLogger);
  app.use(errorHandler);

  await initializeDataSource();

  app.listen(environment.APP_PORT, () => {
    console.log(`Server started at http://localhost:${environment.APP_PORT}`);
  });
};
