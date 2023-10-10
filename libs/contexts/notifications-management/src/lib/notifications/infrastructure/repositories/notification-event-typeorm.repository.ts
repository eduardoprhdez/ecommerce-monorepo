import { Repository } from 'typeorm';

import { DatabaseError, TransactionTypeorm } from '@ecommerce-monorepo/shared';

import { NotificationCreatedEvent } from '../../domain/events/notiification-created.event';
import { NotificationEventTypeormEntity } from '../entities/notification-event.typeorm.entity';
import { NotificationEventRepository } from '../../domain/repositories/notification-event.repository';

export class NotificationEventTypeormRepository
  extends Repository<NotificationEventTypeormEntity>
  implements NotificationEventRepository
{
  async getNotificationEvents(): Promise<NotificationCreatedEvent[]> {
    try {
      return this.find({
        order: {
          creationDate: 'DESC',
        },
      }) as any;
    } catch (error) {
      throw new DatabaseError(
        this.constructor.name,
        'getNotificationEvents',
        '',
      );
    }
  }
  async saveNotificationEvent(
    NotificationEvent: NotificationCreatedEvent,
    transaction: TransactionTypeorm,
  ): Promise<void> {
    try {
      transaction
        ? await transaction.queryRunner.manager.save(
            NotificationEventTypeormEntity,
            NotificationEvent.toJSON(),
          )
        : await this.save(NotificationEvent.toJSON());
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        this.constructor.name,
        'saveNotificationEvent',
        JSON.stringify(NotificationEvent),
      );
    }
  }
}
