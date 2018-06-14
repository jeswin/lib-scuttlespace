export interface IMessage {
  id: string;
  sender: string;
  root: string;
  text: string;
  timestamp: number;
}

export interface IMessageSource {
  get(id: string): Promise<IMessage>;
}
