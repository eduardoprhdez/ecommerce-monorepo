import { Entity } from '@ecommerce-monorepo/shared-kernel';
import { OrderItemPrimitive } from '../primitives/order-item.primitive';
import { OrderItemIdValueObject } from '../value-objects/order-item-id.value-object';
import { OrderItemNameValueObject } from '../value-objects/order-item-name.value-object';
import { OrderItemPriceValueObject } from '../value-objects/order-item-price.value-object';
import { OrderItemQuantityValueObject } from '../value-objects/order-item-quantity.value-object';

export class OrderItemEntity extends Entity {
  private id: OrderItemIdValueObject;
  private name: OrderItemNameValueObject;
  private price: OrderItemPriceValueObject;
  private quantity: OrderItemQuantityValueObject;

  constructor(
    id: OrderItemIdValueObject,
    name: OrderItemNameValueObject,
    price: OrderItemPriceValueObject,
    quantity: OrderItemQuantityValueObject,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  toPrimitives(): OrderItemPrimitive {
    return {
      id: this.id.value,
      name: this.name.value,
      price: this.price.value,
      quantity: this.quantity.value,
    };
  }

  static fromPrimitives(orderItem: OrderItemPrimitive): OrderItemEntity {
    const id = new OrderItemIdValueObject(orderItem.id);
    const name = new OrderItemNameValueObject(orderItem.name);
    const price = new OrderItemPriceValueObject(orderItem.price);
    const quantity = new OrderItemQuantityValueObject(orderItem.quantity);

    return new OrderItemEntity(id, name, price, quantity);
  }
}
