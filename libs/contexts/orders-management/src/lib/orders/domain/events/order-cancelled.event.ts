import { DomainEvent } from '@ecommerce-monorepo/shared-kernel';
import { OrderPrimitive } from '../primitives/order.primitive';

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    eventData: Pick<OrderPrimitive, 'id' | 'state' | 'rejectionReason'>,
  ) {
    super(aggregateId, 'OrderCancelled', eventData);
  }
}
