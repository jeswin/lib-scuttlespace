import "mocha";
import "should";

import fs = require("fs-extra");

import * as config from "../config";
import * as db from "../db";
import init from "../init";
import { setConsoleLogging } from "../logger";

export async function deleteEverything() {
  setConsoleLogging(false);
  if (fs.existsSync(config.dataDir)) {
    fs.removeSync(config.dataDir);
    fs.mkdirSync(config.dataDir);
  }

  if (fs.existsSync(config.dbDir)) {
    fs.removeSync(config.dbDir);
    fs.mkdirSync(config.dbDir);
  }

  db.resetDb();
  await init();
}
