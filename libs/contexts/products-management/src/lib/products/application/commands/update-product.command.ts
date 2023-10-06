import { ProductPrimitive } from '../../domain';

export type UpdateProductCommand = Partial<Omit<ProductPrimitive, 'id'>> &
  Pick<ProductPrimitive, 'id'>;
