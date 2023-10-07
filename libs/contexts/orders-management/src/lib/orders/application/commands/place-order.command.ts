import { OrderPrimitive } from '../../domain';

export type PlaceOrderCommand = Pick<OrderPrimitive, 'items'>;
