import {
  BaseError,
  DatabaseRecordNotFoundError,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import {
  NotificationAggregate,
  NotificationPrimitive,
  NotificationRepository,
} from '../../domain';
import { GetNotificationQuery } from '../queries/get-notification.query';

export class GetNotificationQueryHandler {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(
    getNotificationQuery: GetNotificationQuery,
  ): Promise<NotificationPrimitive> {
    try {
      const notificationPrimitives =
        await this.notificationRepository.getNotification(
          getNotificationQuery.id,
        );

      if (!notificationPrimitives)
        throw new DatabaseRecordNotFoundError(
          this.constructor.name,
          getNotificationQuery.id,
        );

      const notification: NotificationAggregate =
        NotificationAggregate.fromPrimitives(notificationPrimitives);

      return notification.toPrimitives();
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(getNotificationQuery),
      );
    }
  }
}
