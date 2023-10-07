import { DatabaseRecordNotFoundError } from '@ecommerce-monorepo/shared';
import { OrderAggregate, OrderPrimitive, OrderRepository } from '../../domain';
import { GetOrderQuery } from '../queries/get-order.query';

export class GetOrderQueryHandler {
  constructor(private orderRepository: OrderRepository) {}

  async execute(getOrderQuery: GetOrderQuery): Promise<OrderPrimitive> {
    const orderPrimitives = await this.orderRepository.getOrder(
      getOrderQuery.id,
    );

    if (!orderPrimitives)
      throw new DatabaseRecordNotFoundError(
        this.constructor.name,
        getOrderQuery.id,
      );

    const order: OrderAggregate =
      OrderAggregate.fromPrimitives(orderPrimitives);

    return order.toPrimitives();
  }
}
