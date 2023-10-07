import { OrderPrimitive } from '../../domain';

export type CancelOrderCommand = Pick<OrderPrimitive, 'id' | 'rejectionReason'>;
