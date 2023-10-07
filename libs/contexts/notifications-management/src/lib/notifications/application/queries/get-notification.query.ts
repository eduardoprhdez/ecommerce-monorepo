import { NotificationPrimitive } from '../../domain';

//TODO: Deberían ser los comandos y queries tipos?
export type GetNotificationQuery = Pick<NotificationPrimitive, 'id'>;
