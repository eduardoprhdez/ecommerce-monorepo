import { ProductPrimitive } from '../../domain';

export type DeleteProductCommand = Pick<ProductPrimitive, 'id'>;
