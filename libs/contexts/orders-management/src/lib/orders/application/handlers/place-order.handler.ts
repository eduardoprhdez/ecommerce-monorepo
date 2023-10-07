import {
  OrderRepository,
  OrderAggregate,
  OrderStatePrimitive,
} from '../../domain';
import { PlaceOrderCommand } from '../commands/place-order.command';

export class PlaceOrderCommandHandler {
  constructor(private orderRepository: OrderRepository) {}

  async execute(placeOrderCommand: PlaceOrderCommand): Promise<void> {
    const order = OrderAggregate.fromPrimitives({
      ...placeOrderCommand,
      state: OrderStatePrimitive.PENDING,
    });

    try {
      return this.orderRepository.saveOrder(order.toPrimitives());
    } catch (err) {
      //TODO: Meaningful error
      throw new Error();
    }
  }
}
