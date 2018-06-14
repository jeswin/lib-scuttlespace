import * as path from "path";
import winston = require("winston");
import * as config from "./config";

let logger: winston.Logger;
export async function init() {
  logger = winston.createLogger({
    format: winston.format.json(),
    level: "info",
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({
        filename: path.join(config.logsDir, "error.log"),
        level: "error"
      }),
      new winston.transports.File({
        filename: path.join(config.logsDir, "combined.log")
      })
    ]
  });

  if (process.env.NODE_ENV !== "production" && logToConsole) {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple()
      })
    );
  }
}

let logToConsole = true;
export async function setConsoleLogging(logOrNot: boolean) {
  logToConsole = logOrNot;
}

export async function log(message: string, level: string = "info") {
  logger.log({ level, message });
}
