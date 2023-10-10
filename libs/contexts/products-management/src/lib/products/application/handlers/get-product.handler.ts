import {
  BaseError,
  DatabaseRecordNotFoundError,
  UnexpectedError,
} from '@ecommerce-monorepo/shared';
import {
  ProductAggregate,
  ProductPrimitive,
  ProductRepository,
} from '../../domain';
import { GetProductQuery } from '../queries/get-product.query';

export class GetProductQueryHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(getProductQuery: GetProductQuery): Promise<ProductPrimitive> {
    try {
      const productPrimitives = await this.productRepository.getProduct(
        getProductQuery.id,
      );

      if (!productPrimitives)
        throw new DatabaseRecordNotFoundError(
          this.constructor.name,
          getProductQuery.id,
        );

      const product: ProductAggregate =
        ProductAggregate.fromPrimitives(productPrimitives);

      return product.toPrimitives();
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(getProductQuery),
      );
    }
  }
}
