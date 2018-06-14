import fs = require("fs");
import * as path from "path";

import { createMessage } from ".";
import { dataDir } from "../../config";
import { getDb } from "../../db";
import { handle } from "../../modules/auth";
import { IMessageSource } from "../../types";

const shouldLib = require("should");

export default function(msgSource: IMessageSource) {
  return async () => {
    const command = "id jeswin";
    const message = createMessage({ text: `@scuttlespace ${command}` });
    const reply = await handle(command, message, msgSource);

    shouldLib.exist(reply);
    const _ =
      reply &&
      reply.message.should.equal(
        "Your profile is now accessible at https://scuttle.space/jeswin."
      );

    // db
    const db = await getDb();
    {
      const rows = db
        .prepare(`SELECT * FROM identity WHERE id="jeswin"`)
        .all();
      rows.length.should.equal(1);
      rows[0].id.should.equal("jeswin");
      rows[0].enabled.should.equal(1);
      shouldLib.not.exist(rows[0].domain);
    }

    {
      const rows = db
        .prepare(`SELECT * FROM user WHERE id="jeswins-user-id"`)
        .all();
      rows.length.should.equal(1);
      rows[0].id.should.equal("jeswins-user-id");
      rows[0].primary_identity_id.should.equal("jeswin");
    }

    {
      const rows = db
        .prepare(`SELECT * FROM membership WHERE identity_id="jeswin"`)
        .all();
      rows.length.should.equal(1);
      rows[0].identity_id.should.equal("jeswin");
      rows[0].user_id.should.equal("jeswins-user-id");
      rows[0].membership_type.should.equal("ADMIN");
    }

    // file system
    fs.existsSync(path.join(dataDir, "jeswin")).should.be.true();
  };
}
