import * as fs from "fs-extra";
import * as path from "path";
import { dataDir, dbDir } from "../../config";
import { getDb, sqlInsert } from "../../db";
import Response from "../../Response";
import { IMessage } from "../../types";

export default async function createIdentity(
  id: string,
  pubkey: string,
  command: string,
  message: IMessage
) {
  const db = await getDb();

  // See if the user already exists.
  const user = db
    .prepare(`SELECT * FROM user WHERE pubkey=$pubkey`)
    .get({ pubkey });

  db.transaction(
    [
      sqlInsert({
        fields: ["name=identity_name", "enabled=identity_enabled"],
        table: "identity"
      })
    ]
      .concat(
        !user
          ? sqlInsert({
              fields: ["pubkey", "primary_identity_name"],
              table: "user"
            })
          : "UPDATE user SET primary_identity_name=$primary_identity_name WHERE pubkey=$pubkey"
      )
      .concat(
        sqlInsert({
          fields: ["identity_name", "user_pubkey=pubkey", "membership_type"],
          table: "user_identity"
        })
      )
  ).run({
    identity_enabled: 1,
    identity_name: id,
    membership_type: "ADMIN",
    primary_identity_name: id,
    pubkey
  });

  // Create home dir.
  fs.ensureDirSync(path.join(dataDir, id));

  return new Response(
    `Your profile is now accessible at https://scuttle.space/${id}.`,
    message.id
  );
}
