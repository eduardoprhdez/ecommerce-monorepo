import { Transaction } from '@ecommerce-monorepo/shared';
import { SagaCommand } from './command';

export interface CommandProducer {
  send(
    channel: string,
    command: SagaCommand,
    replyTo: string,
    headers: Record<string, string>,
    transaction?: Transaction,
  ): Promise<string>;
}
