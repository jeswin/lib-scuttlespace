import IResponse from "./Response";
import Response from "./Response";

export function merge(messages: IResponse[]): IResponse {
  const consistentReplyToId = messages.every(
    x => x.replyToId === messages[0].replyToId
  );

  return consistentReplyToId
    ? new Response(
        messages.map(x => x.message).join(" "),
        messages[0].replyToId
      )
    : new Response(
        "There has been a mistake made. We're on it.",
        messages[0].replyToId
      );
}
