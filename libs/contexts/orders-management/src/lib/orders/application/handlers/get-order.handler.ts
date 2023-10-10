import {
  BaseError,
  DatabaseRecordNotFoundError,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import { OrderAggregate, OrderPrimitive, OrderRepository } from '../../domain';
import { GetOrderQuery } from '../queries/get-order.query';

export class GetOrderQueryHandler {
  constructor(private orderRepository: OrderRepository) {}

  async execute(getOrderQuery: GetOrderQuery): Promise<OrderPrimitive> {
    try {
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
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(getOrderQuery),
      );
    }
  }
}
