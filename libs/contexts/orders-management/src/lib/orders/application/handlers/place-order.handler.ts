import {
  BaseError,
  TransactionManager,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import {
  OrderRepository,
  OrderAggregate,
  OrderStatePrimitive,
} from '../../domain';
import { PlaceOrderCommand } from '../commands/place-order.command';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderEventRepository } from '../../domain/repositories/order-event.repository';

export class PlaceOrderCommandHandler {
  constructor(
    private orderRepository: OrderRepository,
    private orderEventRepository: OrderEventRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(placeOrderCommand: PlaceOrderCommand): Promise<void> {
    try {
      console.log('-------------------------------------');
      const order = OrderAggregate.fromPrimitives({
        ...placeOrderCommand,
        state: OrderStatePrimitive.PENDING,
      });

      const orderPlacedEvent = new OrderPlacedEvent(
        order.id.value,
        order.toPrimitives(),
      );

      const transaction = this.transactionManager.createTransaction();
      await transaction.start();

      try {
        await this.orderRepository.saveOrder(order.toPrimitives());
        await this.orderEventRepository.saveOrderEvent(orderPlacedEvent);
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
      } finally {
        await transaction.finish();
      }
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(placeOrderCommand),
      );
    }
  }
}
