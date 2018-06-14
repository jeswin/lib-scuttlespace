import "mocha";
import "should";

import fs = require("fs");

import * as db from "../db";
import init from "../init";
import { setConsoleLogging } from "../logger";
import { IMessageSource } from "../types";
import auth from "./auth";

const shouldLib = require("should");

const dbName = "db/test-db.sqlite";
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
    ["data/jeswin", "data/jeswin1", "data/jeswin2"].forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmdirSync(dir);
      }
    });
    [dbName].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
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
