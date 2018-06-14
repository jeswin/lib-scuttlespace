import * as path from "path";

if (!process.env.SCUTTLESPACE_DOMAIN) {
  throw new Error(`$SCUTTLESPACE_DOMAIN environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_DB_DIR) {
  throw new Error(`$SCUTTLESPACE_DB_DIR environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_DATA_DIR) {
  throw new Error(`$SCUTTLESPACE_DATA_DIR environment variable was not set.`);
}

if (!process.env.SCUTTLESPACE_LOGS_DIR) {
  throw new Error(`$SCUTTLESPACE_LOGS_DIR environment variable was not set.`);
}

export const domain = process.env.SCUTTLESPACE_DOMAIN;
export const dbDir = process.env.SCUTTLESPACE_DB_DIR;
export const dataDir = process.env.SCUTTLESPACE_DATA_DIR;
export const logsDir = process.env.SCUTTLESPACE_LOGS_DIR;

export const dbName = path.join(dbDir, "scuttlespace.sqlite");
