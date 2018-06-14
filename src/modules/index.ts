import Response from "../Response";
import { IMessage, IMessageSource } from "../types";
import * as auth from "./auth";

export interface IConversationState {
  contexts: string[];
}

interface IScuttleSpaceModule {
  handle(
    command: string,
    message: IMessage,
    msgSource: IMessageSource
  ): Promise<IHandlerResponse | void>;
  setup(): Promise<void>;
}

const modules: IScuttleSpaceModule[] = [auth];

export async function init() {
  for (const mod of modules) {
    await mod.setup();
  }
}

async function loadState(sender: string) {}

async function saveState(state: any, sender: string) {}

export interface IHandlerResponse {
  message?: string;
}

export async function handle(
  message: IMessage,
  msgSource: IMessageSource
): Promise<IHandlerResponse> {
  const state = await loadState(message.sender);
  const command = message.text;

  for (const mod of modules) {
    const result = await mod.handle(command, message, msgSource);
    if (result) {
      saveState(state, message.sender);
      return result;
    }
  }

  // We did not get a response.
  saveState(state, message.sender);
  return new Response("I did not follow. TODO: Help link.", message.id);
}
