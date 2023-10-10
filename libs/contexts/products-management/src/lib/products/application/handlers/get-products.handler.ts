import { BaseError, UnexpectedError } from '@ecommerce-monorepo/shared';
import {
  ProductAggregate,
  ProductPrimitive,
  ProductRepository,
} from '../../domain';

export class GetManyProductsQueryHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<ProductPrimitive[]> {
    try {
      const productPrimitives = await this.productRepository.getProducts();

      const products: ProductAggregate[] = productPrimitives.map(
        (productPrimitive) => ProductAggregate.fromPrimitives(productPrimitive),
      );

      return products.map((product) => product.toPrimitives());
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(this.constructor.name, 'execute', '');
    }
  }
}
