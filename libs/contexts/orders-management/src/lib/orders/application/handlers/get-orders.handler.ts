import { BaseError, UnexpectedError } from '@ecommerce-monorepo/shared';
import { OrderAggregate, OrderPrimitive, OrderRepository } from '../../domain';

export class GetManyOrdersQueryHandler {
  constructor(private orderRepository: OrderRepository) {}

  async execute(): Promise<OrderPrimitive[]> {
    try {
      const orderPrimitives = await this.orderRepository.getOrders();

      const orders: OrderAggregate[] = orderPrimitives.map((orderPrimitive) =>
        OrderAggregate.fromPrimitives(orderPrimitive),
      );

      return orders.map((order) => order.toPrimitives());
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(this.constructor.name, 'execute', '');
    }
  }
}
