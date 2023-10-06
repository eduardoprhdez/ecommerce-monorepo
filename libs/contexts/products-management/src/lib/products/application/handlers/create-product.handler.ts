import { ProductRepository, ProductAggregate } from '../../domain';
import { CreateProductCommand } from '../commands/create-product.command';

export class CreateProductCommandHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(createProductCommand: CreateProductCommand): Promise<void> {
    const product = ProductAggregate.fromPrimitives({
      ...createProductCommand,
    });

    try {
      return this.productRepository.saveProduct(product.toPrimitives());
    } catch (err) {
      //TODO: Meaningful error
      throw new Error();
    }
  }
}
