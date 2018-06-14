import * as fs from "fs-extra";
import { IResult as IHumanistResult } from "humanist";
import * as path from "path";

import { didNotUnderstand, IExistingIdentityResult } from ".";
import { dataDir } from "../../config";
import { getDb } from "../../db";
import Response from "../../Response";
import { IMessage } from "../../types";

export default async function modifyIdentity(
  idRow: IExistingIdentityResult,
  args: any,
  command: string,
  message: IMessage
) {
  if (isJustUsername(args)) {
    return await switchPrimaryId(idRow, args, message);
  } else {
    if (args.disable) {
      return await disableId(idRow, args, message);
    } else if (args.enable) {
      return await enableId(idRow, args, message);
    } else if (args.destroy) {
      return await destroyId(idRow, args, message);
    } else if (args.domain) {
      return await setCustomDomain(idRow, args, message);
    } else {
      return await didNotUnderstand(command, message);
    }
  }
}

function isJustUsername(args: IHumanistResult) {
  return Object.keys(args).length === 2;
}

async function switchPrimaryId(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityName, sender } = idRow;
  const db = await getDb();

  // deactivate the rest
  db.prepare(
    "UPDATE user SET primary_identity_name=$identityName WHERE sender=$sender"
  ).run({ identityName, sender });

  return new Response(`Switched to ${identityName}.`, message.id);
}

async function disableId(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityName, membershipType } = idRow;
  if (membershipType === "ADMIN") {
    const db = await getDb();
    db.prepare("UPDATE identity SET enabled=0 WHERE name=$identityName").run({
      identityName
    });
    return new Response(`The id ${identityName} was disabled.`, message.id);
  } else {
    return needToBeAnAdmin(identityName, message);
  }
}

async function enableId(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityName, membershipType } = idRow;
  if (membershipType === "ADMIN") {
    const db = await getDb();
    db.prepare("UPDATE identity SET enabled=1 WHERE name=$identityName").run({
      identityName
    });
    return new Response(
      `The id ${identityName} was enabled again.`,
      message.id
    );
  } else {
    return needToBeAnAdmin(identityName, message);
  }
}

async function destroyId(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityName, membershipType, enabled } = idRow;
  if (membershipType === "ADMIN") {
    if (enabled) {
      return new Response(
        `You may only delete a disabled id. Try 'id ${identityName} disable' first.`,
        message.id
      );
    } else {
      const db = await getDb();
      db.transaction([
        `DELETE FROM user_identity WHERE identity_name=$identityName`,
        `DELETE FROM identity WHERE name=$identityName`,
        `UPDATE user SET primary_identity_name=null 
          WHERE primary_identity_name=$identityName`
      ]).run({ identityName });

      fs.rmdirSync(path.join(dataDir, identityName));

      return new Response(
        `The id ${identityName} was deleted. Everything is gone.`,
        message.id
      );
    }
  } else {
    return needToBeAnAdmin(identityName, message);
  }
}

async function setCustomDomain(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityName, membershipType } = idRow;
  if (membershipType === "ADMIN") {
    const db = await getDb();
    db.prepare("UPDATE identity SET domain=$domain WHERE name=$name").run({
      domain: args.domain,
      name: identityName
    });
    return new Response(
      `The id '${identityName}' is now accessible at ${args.domain}.`,
      message.id
    );
  } else {
    return needToBeAnAdmin(identityName, message);
  }
}

function needToBeAnAdmin(identityName: string, message: IMessage) {
  return new Response(
    `You don't have permissions to update the id '${identityName}'. Need to be an admin.`,
    message.id
  );
}
