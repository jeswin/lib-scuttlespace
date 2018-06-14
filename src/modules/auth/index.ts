import humanist, { IResult as IHumanistResult } from "humanist";

import { getDb, sqlInsert } from "../../db";
import Response from "../../Response";
import { IMessage, IMessageSource } from "../../types";
import createIdentity from "./create-identity";
import modifyIdentity from "./modify-identity";
import unavailableIdentity from "./unavailable-identity";

export { default as setup } from "./setup";

/*
  Supported commands
  
  A given sender can have multiple usernames associated with it, one of which will be in is_primary state.

  Account Management
  ------------------
  # Creates a new identity, owned by the sender's pkey
  # If the identity already exists, sets it as active.
  id jeswin 

  # Gives another user access to the identity
  id anongamers member jeswin

  # Gives another user admin access to the identity
  id anongamers admin jeswin

  # Disassociate a user from the identity
  # There needs to be at least one admit
  id anongamers remove jeswin

  # Sets custom domain for username
  id jeswin domain jeswin.org

  # Disables an identity
  id jeswin disable
  
  # Enables an identity
  id jeswin enable 

  # Deletes a previously disabled identity
  id jeswin destroy 
*/

const parser = humanist([
  ["id", 1],
  ["enable", 0],
  ["disable", 0],
  ["destroy", 0],
  ["domain", 1],
  ["admin", 1],
  ["member", 1],
  ["remove", 1]
]);

export async function handle(
  command: string,
  message: IMessage,
  msgSource: IMessageSource
): Promise<Response | undefined> {
  const lcaseCommand = command.toLowerCase();
  if (lcaseCommand.startsWith("id ")) {
    const args: any = parser(command);
    const identityId = args.id;
    const sender = message.sender;
    if (isValidIdentity(identityId)) {
      const identityStatus = await checkIdentityStatus(
        identityId,
        message.sender
      );
      return identityStatus.status === "AVAILABLE"
        ? await createIdentity(identityId, sender, command, message)
        : identityStatus.status === "TAKEN"
          ? await unavailableIdentity(identityId, sender, command, message)
          : await modifyIdentity(identityStatus, args, command, message);
    }
  }
}

function isValidIdentity(username: string) {
  const regex = /^[a-z][a-z0-9_]+$/;
  return regex.test(username);
}

export interface IExistingIdentityResult {
  status: "ADMIN" | "MEMBER";
  enabled: boolean;
  identityId: string;
  membershipType: string;
  primaryIdentityName: string;
  userId: string;
}

export type IdentityStatusCheckResult =
  | IExistingIdentityResult
  | { status: "AVAILABLE" }
  | { status: "TAKEN" };

async function checkIdentityStatus(
  identityId: string,
  sender: string
): Promise<IdentityStatusCheckResult> {
  const db = await getDb();

  const identity = db
    .prepare(
      `SELECT
        i.enabled as enabled,
        i.id as identityId,
        ui.membership_type as membershipType,
        u.primary_identity_id as primaryIdentityName,
        u.id as userId
      FROM user_identity ui
      JOIN identity i ON ui.identity_id = i.id
      JOIN user u on ui.user_id = u.id
      WHERE identity_id=$identity_id`
    )
    .get({ identity_id: identityId });

  if (!identity) {
    return { status: "AVAILABLE" };
  } else {
    if (identity.userId === sender) {
      return {
        enabled: identity.enabled,
        identityId: identity.identityId,
        membershipType: identity.membershipType,
        primaryIdentityName: identity.primaryIdentityName,
        status: identity.membershipType,
        userId: identity.userId
      };
    } else {
      return {
        status: "TAKEN"
      };
    }
  }
}

export async function didNotUnderstand(command: string, message: IMessage) {
  return new Response(
    `Sorry I did not follow the instruction '${command}'.`,
    message.id
  );
}
