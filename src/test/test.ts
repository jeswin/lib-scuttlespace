import "mocha";
import "should";

import fs = require("fs");

import * as config from "../config";
import * as db from "../db";
import init from "../init";
import { setConsoleLogging } from "../logger";
import { IMessageSource } from "../types";
import auth from "./auth";

/* tslint:disable */
if (
  !process.env.NODE_ENV ||
  process.env.NODE_ENV.toLowerCase() !== "development"
) {
  console.log("Tests can only be run in the development environment.");
  process.exit(1);
}

if (
  !config.dbDir.includes("scuttlespace-test/") ||
  !config.dataDir.includes("scuttlespace-test/")
) {
  console.log(
    "Test directories were not set up. Run 'source test-env.sh' prior to running the tests."
  );
  process.exit(1);
}
/* tslint:enable */

const shouldLib = require("should");

const dbName = `${config.dbDir}/test-db.sqlite`;
db.setDbName(dbName);

class MockMessageSource implements IMessageSource {
  get(x: any): any {}
}

function createMockMessageSource(): IMessageSource {
  return new MockMessageSource();
}

const msgSource = createMockMessageSource();

describe("scuttlespace", async () => {
  before(async () => {
    if (fs.existsSync(config.dataDir)) {
      fs.rmdirSync(config.dataDir);
      fs.mkdirSync(config.dataDir);
    }

    if (fs.existsSync(config.dbDir)) {
      fs.rmdirSync(config.dbDir);
      fs.mkdirSync(config.dbDir);
    }
  });
  await auth(msgSource);
});

export async function resetDb() {
  setConsoleLogging(false);
  if (fs.existsSync(dbName)) {
    fs.unlinkSync(dbName);
  }
  db.resetDb();
  await init();
}
