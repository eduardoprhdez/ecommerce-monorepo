import { OrderPrimitive } from '../../domain';

//TODO: Deberían ser los comandos y queries tipos?
export type GetOrderQuery = Pick<OrderPrimitive, 'id'>;
