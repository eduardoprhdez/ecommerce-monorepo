import { Transaction } from '@ecommerce-monorepo/shared';
import { OrderApprovedEvent } from '../events/order-approved.event';
import { OrderCancelledEvent } from '../events/order-cancelled.event';
import { OrderPlacedEvent } from '../events/order-placed.event';

export interface OrderEventRepository {
  saveOrderEvent(
    orderEvent: OrderApprovedEvent | OrderCancelledEvent | OrderPlacedEvent,
    transaction?: Transaction,
  ): Promise<void>;
  getOrderEvents(): Promise<
    (OrderApprovedEvent | OrderCancelledEvent | OrderPlacedEvent)[]
  >;
}
