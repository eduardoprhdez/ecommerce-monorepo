import { Message } from './message';

export type MessageHandler = (message: Message) => void;
