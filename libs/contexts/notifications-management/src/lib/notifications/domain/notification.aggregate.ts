import { AggregateRoot } from '@ecommerce-monorepo/shared-kernel';
import { NotificationPrimitive } from './primitives/notification.primitive';
import { NotificationIdValueObject } from './value-objects/notification-id.value-object';
import { NotificationMessageValueObject } from './value-objects/notification-message.value-object';
import { v4 as uuid } from 'uuid';

export class NotificationAggregate extends AggregateRoot {
  id: NotificationIdValueObject;
  message: NotificationMessageValueObject;

  constructor(
    id: NotificationIdValueObject,
    message: NotificationMessageValueObject,
  ) {
    super();
    this.id = id;
    this.message = message;
  }

  toPrimitives(): NotificationPrimitive {
    return {
      id: this.id.value,
      message: this.message.value,
    };
  }

  static fromPrimitives(
    notification: Omit<NotificationPrimitive, 'id'> &
      Partial<Pick<NotificationPrimitive, 'id'>>,
  ): NotificationAggregate {
    const id = new NotificationIdValueObject(notification.id ?? uuid());
    const message = new NotificationMessageValueObject(notification.message);

    return new NotificationAggregate(id, message);
  }
}
