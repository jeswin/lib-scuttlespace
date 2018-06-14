import { IMessage } from "../../types";
import Response from "../../Response";

export default async function alreadyTaken(
  identityName: string,
  pubkey: string,
  command: string,
  message: IMessage
) {
  return new Response(
    `The username ${identityName} already exists. Choose something else.`,
    message.id
  );
}
