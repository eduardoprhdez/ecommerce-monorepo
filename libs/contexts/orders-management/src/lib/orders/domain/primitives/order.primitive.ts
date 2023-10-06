import { OrderItemPrimitive } from './order-item.primitive';
import { OrderStatePrimitive } from './order-state.primitive';

export interface OrderPrimitive {
  id: string;
  items: OrderItemPrimitive[];
  state: OrderStatePrimitive;
  rejectionReason?: string;
}
