import { ProductPrimitive } from '../../domain';

export type CreateProductCommand = Omit<ProductPrimitive, 'id'>;
