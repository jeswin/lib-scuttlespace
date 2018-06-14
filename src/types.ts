export interface IMessage {
  author: string;
  branch?: string | string[];
  channel?: string;
  key: string;
  mentions?: string[];
  root?: string;
  text: string;
  timestamp: number;
  type: string;
}

export interface IReply {
  message: string;
}

export interface IMessageSource {
  get(id: string): Promise<IMessage>;
}
