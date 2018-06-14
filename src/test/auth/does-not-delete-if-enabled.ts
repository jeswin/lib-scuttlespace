import fs = require("fs-extra");
import * as path from "path";

import { createMessage } from ".";
import { dataDir } from "../../config";
import { getDb } from "../../db";
import { handle } from "../../modules/auth";
import { IMessageSource } from "../../types";

const shouldLib = require("should");

export default function(msgSource: IMessageSource) {
  return async () => {
    const command1 = "id jeswin";
    const message1 = createMessage({ text: command1 });
    await handle(command1, message1, msgSource);

    const command2 = "id jeswin destroy";
    const message2 = createMessage({ text: command2 });
    const reply2 = await handle(command2, message2, msgSource);

    shouldLib.exist(reply2);
    const _ =
      reply2 &&
      reply2.message.should.equal(
        "You may only delete a disabled id. Try 'id jeswin disable' first."
      );

    {
      const db = await getDb();
      const rows = db
        .prepare(`SELECT * FROM identity WHERE id="jeswin"`)
        .all();
      rows.length.should.equal(1);

      fs.existsSync(path.join(dataDir, "jeswin")).should.be.true();
    }
  };
}
