import "mocha";
import "should";

import * as config from "../config";
import * as db from "../db";
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
  await auth(msgSource);
});
