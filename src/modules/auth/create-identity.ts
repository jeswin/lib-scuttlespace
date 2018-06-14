import * as fs from "fs-extra";
import * as path from "path";
import { dataDir, dbDir } from "../../config";
import { getDb, sqlInsert } from "../../db";
import Response from "../../Response";
import { IMessage } from "../../types";

export default async function createIdentity(
  identityId: string,
  sender: string,
  command: string,
  message: IMessage
) {
  const db = await getDb();

  // See if the user already exists.
  const user = db
    .prepare(`SELECT * FROM user WHERE id=$sender`)
    .get({ sender });

  db.transaction(
    [
      sqlInsert({
        fields: ["id=identity_id", "enabled=identity_enabled"],
        table: "identity"
      })
    ]
      .concat(
        !user
          ? sqlInsert({
              fields: ["id=sender", "primary_identity_id"],
              table: "user"
            })
          : "UPDATE user SET primary_identity_id=$primary_identity_id WHERE id=$sender"
      )
      .concat(
        sqlInsert({
          fields: ["identity_id", "user_id=sender", "membership_type"],
          table: "membership"
        })
      )
  ).run({
    identity_enabled: 1,
    identity_id: identityId,
    membership_type: "ADMIN",
    primary_identity_id: identityId,
    sender
  });

  // Create home dir.
  fs.ensureDirSync(path.join(dataDir, identityId));

  return new Response(
    `The id '${identityId}' is now accessible at https://scuttle.space/${identityId}.`,
    message.id
  );
}
