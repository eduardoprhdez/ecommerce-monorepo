import { OrderPrimitive } from '../primitives/order.primitive';

export type SaveOrderDTO = Partial<Omit<OrderPrimitive, 'id'>> &
  Pick<OrderPrimitive, 'id'>;
