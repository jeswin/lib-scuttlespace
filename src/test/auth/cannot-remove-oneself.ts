import { createMessage } from ".";
import { getDb } from "../../db";
import { handle } from "../../modules/auth";
import { IMessageSource } from "../../types";

const shouldLib = require("should");

export default function(msgSource: IMessageSource) {
  return async () => {
    const command1 = "id footballers";
    const message1 = createMessage({ text: command1 });
    const reply1 = await handle(command1, message1, msgSource);

    const command2 = "id footballers remove jeswins-user-id";
    const message2 = createMessage({ text: command2 });
    const reply2 = await handle(command2, message2, msgSource);

    shouldLib.exist(reply2);
    const _ =
      reply2 &&
      reply2.message.should.equal("Cannot remove oneself from footballers.");

    {
      const db = await getDb();
      const rows = db
        .prepare(
          `SELECT * FROM membership WHERE identity_id="footballers" AND user_id="jeswins-user-id"`
        )
        .all();
      rows.length.should.equal(1);
      rows[0].membership_type.should.equal("ADMIN");
    }
  };
}
