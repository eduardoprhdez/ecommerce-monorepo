import { OrderAggregate, OrderRepository } from '../../domain';
import { SaveOrderDTO } from '../../domain/dtos/save-order.dto';
import { CancelOrderCommand } from '../commands/cancel-order.command';

export class CancelOrderCommandHandler {
  constructor(private orderRepository: OrderRepository) {}

  async execute(cancelOrderCommand: CancelOrderCommand): Promise<void> {
    let orderAggregate: OrderAggregate;

    try {
      orderAggregate = OrderAggregate.fromPrimitives(
        await this.orderRepository.getOrder(cancelOrderCommand.id),
      );
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }

    const orderPersistencyDTO: SaveOrderDTO = orderAggregate.cancelOrder(
      cancelOrderCommand.rejectionReason,
    );

    try {
      return await this.orderRepository.saveOrder(orderPersistencyDTO);
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }
  }
}
