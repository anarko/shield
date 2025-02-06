import pino, { LoggerOptions } from "pino";

export const loggerOptions: LoggerOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  redact: {
    paths: ["*.password", "*.token"],
    censor: "<***>",
  },
};

export const logger = pino(loggerOptions);
