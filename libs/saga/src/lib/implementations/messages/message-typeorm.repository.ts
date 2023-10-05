import { Repository } from 'typeorm';
import { MessageTypeormEntity } from './meesage-typeorm-entity';
import { TransactionTypeorm } from '@ecommerce-monorepo/shared';
import { MessageRepository } from '../../definitions/messages/message-repository';
import { MessageEntity } from '../../definitions/messages/message-entity';

export class MessageTypeormRepository
  extends Repository<MessageTypeormEntity>
  implements MessageRepository
{
  async saveMessage(
    message: MessageEntity,
    transaction: TransactionTypeorm,
  ): Promise<void> {
    transaction
      ? transaction.queryRunner.manager.save(MessageTypeormEntity, message)
      : this.save(message);
    return;
  }
}
