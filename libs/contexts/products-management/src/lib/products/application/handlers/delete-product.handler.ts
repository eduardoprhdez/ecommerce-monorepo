import {
  BaseError,
  UnexpectedError,
  DatabaseRecordNotFoundError,
} from '@ecommerce-monorepo/shared';
import { ProductRepository, ProductAggregate } from '../../domain';
import { DeleteProductCommand } from '../commands/delete-product.command';

export class DeleteProductCommandHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(deleteProductCommand: DeleteProductCommand): Promise<void> {
    try {
      const productPrimitive = await this.productRepository.getProduct(
        deleteProductCommand.id,
      );

      if (!productPrimitive)
        throw new DatabaseRecordNotFoundError(this.constructor.name, 'execute');

      ProductAggregate.fromPrimitives(productPrimitive);

      return await this.productRepository.deleteProduct(
        deleteProductCommand.id,
      );
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(deleteProductCommand),
      );
    }
  }
}
