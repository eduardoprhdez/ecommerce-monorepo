import { Transaction } from '@ecommerce-monorepo/shared';
import { SaveNotificationDTO } from '../dto/save-notification.dto';
import { NotificationPrimitive } from '../primitives/notification.primitive';

export interface NotificationRepository {
  saveNotification(
    product: SaveNotificationDTO,
    transaction?: Transaction,
  ): Promise<void>;
  getNotification(
    notificationId: NotificationPrimitive['id'],
  ): Promise<NotificationPrimitive | undefined>;
  getNotifications(): Promise<NotificationPrimitive[]>;
}
