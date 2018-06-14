import Response from "../../Response";
import { IMessage } from "../../types";

export default async function unavailableIdentity(
  identityId: string,
  sender: string,
  command: string,
  message: IMessage
) {
  return new Response(
    `The id ${identityId} already exists. Choose something else.`,
    message.id
  );
}
