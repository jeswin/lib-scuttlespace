import * as path from "path";

if (!process.env.SCUTTLESPACE_DOMAIN) {
  throw new Error(`$SCUTTLESPACE_DOMAIN environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_DB_NAME) {
  throw new Error(`$SCUTTLESPACE_DB_NAME environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_DB_USER) {
  throw new Error(`$SCUTTLESPACE_DB_USER environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_DB_PASSWORD) {
  throw new Error(
    `$SCUTTLESPACE_DB_PASSWORD environment variable was not set.`
  );
}

if (!process.env.SCUTTLESPACE_DB_HOST) {
  throw new Error(`$SCUTTLESPACE_DB_HOST environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_DB_PORT) {
  throw new Error(`$SCUTTLESPACE_DB_PORT environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_DATA_DIR) {
  throw new Error(`$SCUTTLESPACE_DATA_DIR environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_LOGS_DIR) {
  throw new Error(`$SCUTTLESPACE_LOGS_DIR environment variable was not set.`);
}

// domain
export const domain = process.env.SCUTTLESPACE_DOMAIN;

// database
export const dbName = process.env.SCUTTLESPACE_DB_NAME;
export const dbUser = process.env.SCUTTLESPACE_DB_USER;
export const dbPassword = process.env.SCUTTLESPACE_DB_PASSWORD;
export const dbHost = process.env.SCUTTLESPACE_DB_HOST;
export const dbPort = process.env.SCUTTLESPACE_DB_PORT;

// directories
export const dataDir = process.env.SCUTTLESPACE_DATA_DIR;
export const logsDir = process.env.SCUTTLESPACE_LOGS_DIR;
