import { NotificationPrimitive } from '../primitives/notification.primitive';

export type SaveNotificationDTO = Partial<Omit<NotificationPrimitive, 'id'>> &
  Pick<NotificationPrimitive, 'id'>;
