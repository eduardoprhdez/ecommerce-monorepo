import { Repository } from 'typeorm';
import { OrderEventRepository } from '../../domain/repositories/order-event.repository';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import { OrderApprovedEvent } from '../../domain/events/order-approved.event';
import { OrderEventTypeormEntity } from '../entities/order-event.typeorm.entity';
import { DatabaseError, TransactionTypeorm } from '@ecommerce-monorepo/shared';

export class OrderEventTypeormRepository
  extends Repository<OrderEventTypeormEntity>
  implements OrderEventRepository
{
  async saveOrderEvent(
    orderEvent: OrderPlacedEvent | OrderCancelledEvent | OrderApprovedEvent,
    transaction: TransactionTypeorm,
  ): Promise<void> {
    try {
      transaction
        ? await transaction.queryRunner.manager.save(
            OrderEventTypeormEntity,
            orderEvent.toJSON(),
          )
        : await this.save(orderEvent.toJSON());
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        this.constructor.name,
        'saveOrderEvent',
        JSON.stringify(orderEvent),
      );
    }
  }

  async getOrderEvents(): Promise<
    (OrderApprovedEvent | OrderCancelledEvent | OrderPlacedEvent)[]
  > {
    try {
      return this.find({
        order: {
          creationDate: 'DESC',
        },
      }) as any;
    } catch (error) {
      console.log(error);
      throw new DatabaseError(this.constructor.name, 'getOrderEvents', '');
    }
  }
}
