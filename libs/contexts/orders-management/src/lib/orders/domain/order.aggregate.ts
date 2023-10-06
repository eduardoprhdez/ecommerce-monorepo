import { AggregateRoot } from '@ecommerce-monorepo/shared-kernel';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderPrimitive } from './primitives/order.primitive';
import { OrderIdValueObject } from './value-objects/order-id.value-object';
import { OrderStateValueObject } from './value-objects/order-state.value-object';
import { OrderStatePrimitive } from './primitives/order-state.primitive';
import { SaveOrderDTO } from './dtos/save-order.dto';
import { v4 as uuid } from 'uuid';
import { OrderRejectionReasonValueObject } from './value-objects/order-rejection-reason.value-object';

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

  approveOrder(): SaveOrderDTO {
    this.state = new OrderStateValueObject(OrderStatePrimitive.APPROVED);

    return this.toPersistencyDTO(true, false, false);
  }

  cancelOrder(rejectionReason?: string): SaveOrderDTO {
    this.state = new OrderStateValueObject(OrderStatePrimitive.CANCELLED);
    if (rejectionReason)
      this.rejectionReason = new OrderRejectionReasonValueObject(
        rejectionReason,
      );

    return this.toPersistencyDTO(true, false, rejectionReason ? true : false);
  }

  private toPersistencyDTO(
    state: boolean,
    items: boolean,
    rejectionReason: boolean,
  ): SaveOrderDTO {
    return {
      id: this.id.value,
      ...(state && { state: this.state.value as OrderStatePrimitive }),
      ...(items && { items: this.items.map((item) => item.toPrimitives()) }),
      ...(rejectionReason && { rejectionReason: this.rejectionReason?.value }),
    };
  }

  toPrimitives(): OrderPrimitive {
    return {
      id: this.id.value,
      items: this.items.map((item) => item.toPrimitives()),
      state: this.state.value as OrderStatePrimitive,
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
