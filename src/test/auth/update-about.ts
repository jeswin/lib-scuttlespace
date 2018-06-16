import { createMessage } from ".";
import { getDb } from "../../db";
import { handle } from "../../modules/auth";
import { IMessageSource } from "../../types";

const shouldLib = require("should");

export default function(msgSource: IMessageSource) {
  return async () => {
    const command1 = "id jeswin";
    const message1 = createMessage({ text: command1 });
    const reply1 = await handle(command1, message1, msgSource);

    const command2 =
      "id jeswin about Your life is your life. Don't let it be clubbed into dank submission.";
    const message2 = createMessage({ text: command2 });
    const reply2 = await handle(command2, message2, msgSource);

    shouldLib.exist(reply2);
    const _ =
      reply2 && reply2.message.should.equal("Updated profile information for jeswin.");

    {
      const db = await getDb();
      const rows = db.prepare(`SELECT * FROM identity WHERE id="jeswin"`).all();
      shouldLib.exist(rows[0]);
      rows[0].enabled.should.equal(1);
    }
  };
}
