import { SaveNotificationDTO } from '../dto/save-notification.dto';
import { NotificationPrimitive } from '../primitives/notification.primitive';

export interface NotificationRepository {
  saveNotification(product: SaveNotificationDTO): Promise<void>;
  getNotification(
    notificationId: NotificationPrimitive['id'],
  ): Promise<NotificationPrimitive | undefined>;
}
