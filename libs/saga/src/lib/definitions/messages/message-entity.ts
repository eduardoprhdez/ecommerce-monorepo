import { SagaCommand } from '../commands/command';

export interface MessageEntity {
  id: string;
  channel: string;
  payload: SagaCommand;
  headers: Record<string, string>;
}
