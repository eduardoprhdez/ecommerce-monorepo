import {
  BaseError,
  DatabaseRecordNotFoundError,
  TransactionManager,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import { OrderAggregate, OrderRepository } from '../../domain';
import { ApproveOrderCommand } from '../commands/approve-order.command';
import { OrderApprovedEvent } from '../../domain/events/order-approved.event';
import { OrderEventRepository } from '../../domain/repositories/order-event.repository';

export class ApproveOrderCommandHandler {
  constructor(
    private orderRepository: OrderRepository,
    private orderEventRepository: OrderEventRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(approveOrderCommand: ApproveOrderCommand): Promise<void> {
    try {
      const orderPrimitive = await this.orderRepository.getOrder(
        approveOrderCommand.id,
      );

      if (!orderPrimitive)
        throw new DatabaseRecordNotFoundError(this.constructor.name, 'execute');

      const aggregate = OrderAggregate.fromPrimitives(orderPrimitive);

      const orderApprovedEvent: OrderApprovedEvent = aggregate.approveOrder();

      const transaction = this.transactionManager.createTransaction();
      await transaction.start();

      try {
        await this.orderRepository.saveOrder(aggregate.toPrimitives());
        await this.orderEventRepository.saveOrderEvent(orderApprovedEvent);
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
        JSON.stringify(approveOrderCommand),
      );
    }
  }
}
