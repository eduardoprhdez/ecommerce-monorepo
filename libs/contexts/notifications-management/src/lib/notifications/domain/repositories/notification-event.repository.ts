import { Transaction } from '@ecommerce-monorepo/shared';
import { NotificationCreatedEvent } from '../events/notiification-created.event';

export interface NotificationEventRepository {
  saveNotificationEvent(
    NotificationEvent: NotificationCreatedEvent,
    transaction?: Transaction,
  ): Promise<void>;
}
