export default class Response {
  message: string;
  replyToId: string;
  timestamp: number;

  constructor(message: string, replyToId: string) {
    this.message = message;
    this.replyToId = replyToId;
    this.timestamp = Date.now();
  }
}
