import { DomainEvent } from '@ecommerce-monorepo/shared-kernel';
import { NotificationPrimitive } from '../primitives/notification.primitive';

export class NotificationCreatedEvent extends DomainEvent {
  constructor(aggregateId: string, eventData: NotificationPrimitive) {
    super(aggregateId, 'NotificationCreated', eventData);
  }
}
