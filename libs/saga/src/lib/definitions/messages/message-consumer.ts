import { MessageHandler } from './message-handler';

export interface MessageConsumer {
  subscribe(
    subscriberId: string,
    channel: string,
    handler: MessageHandler,
  ): void;
  getId(): string;
}
