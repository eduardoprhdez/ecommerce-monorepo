import { OrderAggregate, OrderRepository } from '../../domain';
import { SaveOrderDTO } from '../../domain/dtos/save-order.dto';
import { ApproveOrderCommand } from '../commands/approve-order.command';

export class ApproveOrderCommandHandler {
  constructor(private orderRepository: OrderRepository) {}

  async execute(approveOrderCommand: ApproveOrderCommand): Promise<void> {
    let aggregate: OrderAggregate;
    try {
      aggregate = OrderAggregate.fromPrimitives(
        await this.orderRepository.getOrder(approveOrderCommand.id),
      );
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }

    const orderPersistencyDTO: SaveOrderDTO = aggregate.approveOrder();

    try {
      return await this.orderRepository.saveOrder(orderPersistencyDTO);
    } catch (err) {
      //TODO: Error más semántico
      throw new Error();
    }
  }
}
