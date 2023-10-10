import { BaseError, UnexpectedError } from '@ecommerce-monorepo/shared';
import { ProductRepository, ProductAggregate } from '../../domain';
import { CreateProductCommand } from '../commands/create-product.command';

export class CreateProductCommandHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(createProductCommand: CreateProductCommand): Promise<void> {
    try {
      const product = ProductAggregate.fromPrimitives(createProductCommand);

      return this.productRepository.saveProduct(product.toPrimitives());
    } catch (err) {
      if (err instanceof BaseError) throw err;
      throw new UnexpectedError(
        this.constructor.name,
        'execute',
        JSON.stringify(createProductCommand),
      );
    }
  }
}
