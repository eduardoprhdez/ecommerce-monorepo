import {
  BaseError,
  DatabaseRecordNotFoundError,
  TransactionManager,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import { OrderAggregate, OrderRepository } from '../../domain';
import { CancelOrderCommand } from '../commands/cancel-order.command';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import { OrderEventRepository } from '../../domain/repositories/order-event.repository';

export class CancelOrderCommandHandler {
  constructor(
    private orderRepository: OrderRepository,
    private orderEventRepository: OrderEventRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(cancelOrderCommand: CancelOrderCommand): Promise<void> {
    console.log('COMANDO', cancelOrderCommand);
    try {
      const orderPrimitive = await this.orderRepository.getOrder(
        cancelOrderCommand.id,
      );

      if (!orderPrimitive)
        throw new DatabaseRecordNotFoundError(this.constructor.name, 'execute');

      const aggregate = OrderAggregate.fromPrimitives(orderPrimitive);

      const orderCanceldEvent: OrderCancelledEvent = aggregate.cancelOrder(
        cancelOrderCommand.rejectionReason,
      );

      const transaction = this.transactionManager.createTransaction();
      await transaction.start();

      try {
        await this.orderRepository.saveOrder(aggregate.toPrimitives());
        await this.orderEventRepository.saveOrderEvent(orderCanceldEvent);
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
        JSON.stringify(cancelOrderCommand),
      );
    }
  }
}
