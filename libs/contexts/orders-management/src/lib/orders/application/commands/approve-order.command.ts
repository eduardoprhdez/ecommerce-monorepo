import { OrderPrimitive } from '../../domain';

export type ApproveOrderCommand = Pick<OrderPrimitive, 'id'>;
