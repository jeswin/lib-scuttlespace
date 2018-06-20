import * as fs from "fs-extra";
import * as path from "path";
import PGParams from "pg-params";
import { dataDir } from "../../config";
import { getDb, sqlInsert, withClient } from "../../db";
import Response from "../../Response";
import { IMessage } from "../../types";

export default async function createIdentity(
  identityId: string,
  sender: string,
  command: string,
  message: IMessage
) {
  return await withClient(async client => {
    await client.query("BEGIN");

    try {
      const params = new PGParams({ sender });
      const { rows } = await client.query(
        `SELECT * FROM user WHERE id=${params.key("sender")}`,
        params.values()
      );

      

      await client.query("COMMIT");
    } catch {
      await client.query("ROLLBACK");
    }
  });

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
