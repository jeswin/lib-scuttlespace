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

    const command2 = "id alice";
    const message2 = createMessage({
      sender: "alices-user-id",
      text: command2
    });
    const reply2 = await handle(command2, message2, msgSource);

    const command3 = "id footballers user alices-user-id";
    const message3 = createMessage({ text: command3 });
    const reply3 = await handle(command3, message3, msgSource);

    const command4 = "id footballers remove alices-user-id";
    const message4 = createMessage({ text: command4 });
    const reply4 = await handle(command4, message4, msgSource);

    shouldLib.exist(reply4);
    const _ =
      reply4 &&
      reply4.message.should.equal(
        "alices-user-id was removed from footballers."
      );

    {
      const db = await getDb();
      const rows = db
        .prepare(
          `SELECT * FROM membership WHERE identity_id="footballers" AND user_id="alices-user-id"`
        )
        .all();
      rows.length.should.equal(0);
    }
  };
}
