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
    const message1 = createMessage({ text: `@scuttlespace ${command1}` });
    const reply1 = await handle(command1, message1, msgSource);

    const command2 = "id jeswin disable";
    const message2 = createMessage({ text: `@scuttlespace ${command2}` });
    const reply2 = await handle(command2, message2, msgSource);

    const command3 = "id jeswin destroy";
    const message3 = createMessage({ text: `@scuttlespace ${command3}` });
    const reply3 = await handle(command3, message3, msgSource);

    shouldLib.exist(reply3);
    const _ =
      reply3 &&
      reply3.message.should.equal(
        "The id jeswin was deleted. Everything is gone."
      );

    {
      const db = await getDb();
      const rows = db
        .prepare(`SELECT * FROM identity WHERE id="jeswin"`)
        .all();
      rows.length.should.equal(0);
    }

    {
      const db = await getDb();
      const rows = db
        .prepare(`SELECT * FROM user WHERE id="jeswins-user-id"`)
        .all();
      rows.length.should.equal(1);
      shouldLib.not.exist(rows[0].primary_identity_id);
    }

    {
      const db = await getDb();
      const rows = db
        .prepare(
          `SELECT * FROM user_identity WHERE user_id="jeswins-user-id" AND identity_id="jeswin"`
        )
        .all();
      rows.length.should.equal(0);
    }

    fs.existsSync(path.join(dataDir, "jeswin")).should.be.false();
  };
}
