import { SagaCommand } from '../commands/command';

export interface MessageType {
  channel: string;
  payload: SagaCommand;
  headers: Record<string, string>;
}
