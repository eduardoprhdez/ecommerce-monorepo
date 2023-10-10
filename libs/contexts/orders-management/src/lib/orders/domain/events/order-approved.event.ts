import { DomainEvent } from '@ecommerce-monorepo/shared-kernel';
import { OrderPrimitive } from '../primitives/order.primitive';

export class OrderApprovedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    eventData: Pick<OrderPrimitive, 'id' | 'state'>,
  ) {
    super(aggregateId, 'OrderApproved', eventData);
  }
}
