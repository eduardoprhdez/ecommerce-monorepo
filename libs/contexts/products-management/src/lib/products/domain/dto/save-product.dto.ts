import { ProductPrimitive } from '../primitives/product.primitive';

export type SaveProductDTO = Partial<Omit<ProductPrimitive, 'id'>> &
  Pick<ProductPrimitive, 'id'>;
