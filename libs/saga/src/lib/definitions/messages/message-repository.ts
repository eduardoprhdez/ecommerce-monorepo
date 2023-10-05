import { Transaction } from '@ecommerce-monorepo/shared';
import { MessageEntity } from './message-entity';

export interface MessageRepository {
  saveMessage(message: MessageEntity, transaction?: Transaction): Promise<void>;
}
