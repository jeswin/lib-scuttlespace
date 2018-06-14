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
    } else if (args.admin) {
      return await setCustomDomain(idRow, args, message);
    } else if (args.user) {
      return await setCustomDomain(idRow, args, message);
    } else if (args.remove) {
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
  const { identityId, userId } = idRow;
  const db = await getDb();

  // deactivate the rest
  db.prepare(
    "UPDATE user SET primary_identity_id=$identity_id WHERE id=$user_id"
  ).run({ identity_id: identityId, user_id: userId });

  return new Response(`Switched to ${identityId}.`, message.id);
}

async function disableId(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityId, membershipType } = idRow;
  if (membershipType === "ADMIN") {
    const db = await getDb();
    db.prepare("UPDATE identity SET enabled=0 WHERE id=$identity_id").run({
      identity_id: identityId
    });
    return new Response(`The id ${identityId} was disabled.`, message.id);
  } else {
    return needToBeAnAdmin(identityId, message);
  }
}

async function enableId(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityId, membershipType } = idRow;
  if (membershipType === "ADMIN") {
    const db = await getDb();
    db.prepare("UPDATE identity SET enabled=1 WHERE id=$identity_id").run({
      identity_id: identityId
    });
    return new Response(`The id ${identityId} was enabled again.`, message.id);
  } else {
    return needToBeAnAdmin(identityId, message);
  }
}

async function destroyId(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityId, membershipType, enabled } = idRow;
  if (membershipType === "ADMIN") {
    if (enabled) {
      return new Response(
        `You may only delete a disabled id. Try 'id ${identityId} disable' first.`,
        message.id
      );
    } else {
      const db = await getDb();
      db.transaction([
        `DELETE FROM membership WHERE identity_id=$identity_id`,
        `DELETE FROM identity WHERE id=$identity_id`,
        `UPDATE user SET primary_identity_id=null 
          WHERE primary_identity_id=$identity_id`
      ]).run({ identity_id: identityId });

      fs.rmdirSync(path.join(dataDir, identityId));

      return new Response(
        `The id ${identityId} was deleted. Everything is gone.`,
        message.id
      );
    }
  } else {
    return needToBeAnAdmin(identityId, message);
  }
}

async function setCustomDomain(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityId, membershipType } = idRow;
  if (membershipType === "ADMIN") {
    const db = await getDb();
    db.prepare("UPDATE identity SET domain=$domain WHERE id=$identity_id").run({
      domain: args.domain,
      identity_id: identityId
    });
    return new Response(
      `The id '${identityId}' is now accessible at ${args.domain}.`,
      message.id
    );
  } else {
    return needToBeAnAdmin(identityId, message);
  }
}

async function addAdmin(
  idRow: IExistingIdentityResult,
  args: any,
  message: IMessage
) {
  const { identityId, membershipType } = idRow;
  if (membershipType === "ADMIN") {
    const db = await getDb();

    const membership = db.prepare("SELECT * FROM membership WHERE ");

    db.prepare("UPDATE identity SET domain=$domain WHERE id=$identity_id").run({
      domain: args.domain,
      identity_id: identityId
    });
    return new Response(
      `The id '${identityId}' is now accessible at ${args.domain}.`,
      message.id
    );
  } else {
    return needToBeAnAdmin(identityId, message);
  }
}

function needToBeAnAdmin(identityId: string, message: IMessage) {
  return new Response(
    `You don't have permissions to update the id '${identityId}'. Need to be an admin.`,
    message.id
  );
}
