import { NotificationPrimitive } from '../../domain';

export type CreateNotificationCommand = Omit<NotificationPrimitive, 'id'>;
