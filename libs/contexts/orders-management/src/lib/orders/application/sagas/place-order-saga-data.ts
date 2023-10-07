import { OrderPrimitive } from '../../domain';

export type PlaceOrderSagaData = Omit<OrderPrimitive, 'state'>;
