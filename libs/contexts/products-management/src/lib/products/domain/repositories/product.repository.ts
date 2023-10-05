import { SaveProductDTO } from '../dto/save-product.dto';
import { ProductPrimitive } from '../primitives/product.primitive';

export interface ProductRepository {
  deleteProduct(productId: ProductPrimitive['id']): Promise<void>;
  saveProduct(product: SaveProductDTO): Promise<void>;
  getProduct(
    productId: ProductPrimitive['id'],
  ): Promise<ProductPrimitive | undefined>;
}
