import { BaseError, UnexpectedError } from '@ecommerce-monorepo/shared';
import {
  NotificationAggregate,
  NotificationPrimitive,
  NotificationRepository,
} from '../../domain';

export class GetManyNotificationsQueryHandler {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(): Promise<NotificationPrimitive[]> {
    try {
      const notificationPrimitives =
        await this.notificationRepository.getNotifications();

      const notifications: NotificationAggregate[] = notificationPrimitives.map(
        (notificationPrimitive) =>
          NotificationAggregate.fromPrimitives(notificationPrimitive),
      );

      return notifications.map((notification) => notification.toPrimitives());
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(this.constructor.name, 'execute', '');
    }
  }
}
