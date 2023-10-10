import { Repository } from 'typeorm';
import { OrderRepository, OrderPrimitive } from '../../domain';
import { OrderTypeormEntity } from '../entities/order-typeorm.entity';
import { SaveOrderDTO } from '../../domain/dtos/save-order.dto';
import { DatabaseError, TransactionTypeorm } from '@ecommerce-monorepo/shared';

export class OrderTypeormRepository
  extends Repository<OrderTypeormEntity>
  implements OrderRepository
{
  async saveOrder(
    order: SaveOrderDTO,
    transaction: TransactionTypeorm,
  ): Promise<void> {
    try {
      transaction
        ? await transaction.queryRunner.manager.save(OrderTypeormEntity, order)
        : await this.save(order);
    } catch (error) {
      console.log(error);
      throw new DatabaseError(
        this.constructor.name,
        'saveOrder',
        JSON.stringify(order),
      );
    }
  }

  async getOrder(orderId: string): Promise<OrderPrimitive | undefined> {
    try {
      const order = await this.findOne({
        where: { id: orderId },
        relations: {
          items: true,
        },
      });

      return order ?? undefined;
    } catch (error) {
      console.log(error);
      throw new DatabaseError(this.constructor.name, 'getOrder', orderId);
    }
  }

  async getOrders(): Promise<OrderPrimitive[]> {
    try {
      const orders = await this.find({
        relations: {
          items: true,
        },
      });

      return orders;
    } catch (error) {
      console.log(error);
      throw new DatabaseError(this.constructor.name, 'getOrders', '');
    }
  }
}
