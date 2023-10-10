import { AggregateRoot } from '@ecommerce-monorepo/shared-kernel';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderPrimitive } from './primitives/order.primitive';
import { OrderIdValueObject } from './value-objects/order-id.value-object';
import { OrderStateValueObject } from './value-objects/order-state.value-object';
import { OrderStatePrimitive } from './primitives/order-state.primitive';
import { v4 as uuid } from 'uuid';
import { OrderRejectionReasonValueObject } from './value-objects/order-rejection-reason.value-object';
import { OrderCancelledEvent } from './events/order-cancelled.event';
import { OrderApprovedEvent } from './events/order-approved.event';

export class OrderAggregate extends AggregateRoot {
  id: OrderIdValueObject;
  items: OrderItemEntity[];
  state: OrderStateValueObject;
  rejectionReason?: OrderRejectionReasonValueObject;

  constructor(
    id: OrderIdValueObject,
    items: OrderItemEntity[],
    state: OrderStateValueObject,
    rejectionReason?: OrderRejectionReasonValueObject,
  ) {
    super();
    this.id = id;
    this.items = items;
    this.state = state;
    this.rejectionReason = rejectionReason;
  }

  approveOrder(): OrderApprovedEvent {
    this.state = new OrderStateValueObject(OrderStatePrimitive.APPROVED);

    return new OrderApprovedEvent(this.id.value, {
      id: this.id.value,
      state: this.state.value as OrderStatePrimitive,
    });
  }

  cancelOrder(rejectionReason?: string): OrderCancelledEvent {
    this.state = new OrderStateValueObject(OrderStatePrimitive.CANCELLED);
    if (rejectionReason)
      this.rejectionReason = new OrderRejectionReasonValueObject(
        rejectionReason,
      );

    return new OrderCancelledEvent(this.id.value, {
      id: this.id.value,
      state: this.state.value as OrderStatePrimitive,
      ...(rejectionReason && { rejectionReason }),
    });
  }

  toPrimitives(): OrderPrimitive {
    return {
      id: this.id.value,
      items: this.items.map((item) => item.toPrimitives()),
      state: this.state.value as OrderStatePrimitive,
      rejectionReason: this.rejectionReason?.value,
    };
  }

  static fromPrimitives(
    order: Omit<OrderPrimitive, 'id'> & Partial<Pick<OrderPrimitive, 'id'>>,
  ): OrderAggregate {
    const id = new OrderIdValueObject(order.id ?? uuid());
    const items = order.items.map((item) => {
      return OrderItemEntity.fromPrimitives(item);
    });
    const state = new OrderStateValueObject(order.state);

    return new OrderAggregate(id, items, state);
  }
}
