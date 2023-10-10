import { Transaction } from '@ecommerce-monorepo/shared';
import { SaveOrderDTO } from '../dtos/save-order.dto';
import { OrderPrimitive } from '../primitives/order.primitive';

export interface OrderRepository {
  saveOrder(order: SaveOrderDTO, transaction?: Transaction): Promise<void>;
  getOrder(orderId: OrderPrimitive['id']): Promise<OrderPrimitive | undefined>;
  getOrders(): Promise<OrderPrimitive[]>;
}
